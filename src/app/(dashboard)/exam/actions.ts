'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { db } from '../../../lib/db';
import { mockExams, userExamAttempts } from '../../../lib/db/schema';
import { eq } from 'drizzle-orm';

async function getUserId() {
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
                set(name: string, value: string, options: any) {
                    cookieStore.set({ name, value, ...options });
                },
                remove(name: string, options: any) {
                    cookieStore.set({ name, value: '', ...options });
                },
            },
        }
    );

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    return user.id;
}

/**
 * Get all available mock exams
 */
export async function getMockExams() {
    try {
        const exams = await db.select().from(mockExams).orderBy(mockExams.level);
        return { exams };
    } catch (error: any) {
        console.error('Error fetching mock exams:', error);
        return { exams: [], error: 'Failed to fetch exams' };
    }
}

/**
 * Get a specific mock exam by ID
 */
export async function getMockExamById(examId: number) {
    try {
        const [exam] = await db.select()
            .from(mockExams)
            .where(eq(mockExams.id, examId));

        if (!exam) {
            return { error: 'Exam not found' };
        }

        return { exam };
    } catch (error: any) {
        console.error('Error fetching mock exam:', error);
        return { error: 'Failed to fetch exam' };
    }
}

/**
 * Submit exam results
 */
export async function submitExamResults(
    examId: number,
    answers: { questionId: number; selectedAnswer: number; isCorrect: boolean }[],
    timeTaken: number
) {
    try {
        const userId = await getUserId();

        // Get the exam to calculate section scores
        const [exam] = await db.select()
            .from(mockExams)
            .where(eq(mockExams.id, examId));

        if (!exam) {
            return { error: 'Exam not found' };
        }

        // Calculate section scores
        const sectionScores: { type: string; score: number; correct: number; total: number }[] = [];
        let totalCorrect = 0;
        let totalQuestions = 0;

        for (const section of exam.sections) {
            const sectionQuestions = section.questions.map(q => q.id);
            const sectionAnswers = answers.filter(a => sectionQuestions.includes(a.questionId));
            const correct = sectionAnswers.filter(a => a.isCorrect).length;
            const total = sectionQuestions.length;
            const score = total > 0 ? Math.round((correct / total) * 100) : 0;

            sectionScores.push({
                type: section.type,
                score,
                correct,
                total,
            });

            totalCorrect += correct;
            totalQuestions += total;
        }

        const overallScore = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

        // Save the attempt
        const [attempt] = await db.insert(userExamAttempts).values({
            userId,
            examId,
            score: overallScore,
            sectionScores,
            answers,
            timeTaken,
            completedAt: new Date(),
        }).returning();

        return {
            success: true,
            attemptId: attempt.id,
            score: overallScore,
            sectionScores,
            passed: overallScore >= exam.passingScore,
        };
    } catch (error: any) {
        console.error('Error submitting exam:', error);
        return { error: 'Failed to submit exam' };
    }
}

/**
 * Get user's exam history
 */
export async function getExamHistory(examId?: number) {
    try {
        const userId = await getUserId();

        let query = db.select()
            .from(userExamAttempts)
            .where(eq(userExamAttempts.userId, userId));

        if (examId) {
            query = db.select()
                .from(userExamAttempts)
                .where(eq(userExamAttempts.examId, examId));
        }

        const attempts = await query;
        return { attempts };
    } catch (error: any) {
        console.error('Error fetching exam history:', error);
        return { attempts: [], error: 'Failed to fetch history' };
    }
}
