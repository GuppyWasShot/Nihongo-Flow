'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { db } from '../../../../../../../../lib/db';
import { userProgress, userProfiles } from '../../../../../../../../lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { calculateNextReview } from '../../../../../../../../lib/srs';

interface QuizResult {
    itemType: 'vocabulary' | 'kanji';
    itemId: number;
    correct: boolean;
}

interface CompleteLessonData {
    lessonId: number;
    results: QuizResult[];
    accuracy: number;
}

export async function completeLesson(data: CompleteLessonData) {
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
        return { error: 'Not authenticated' };
    }

    try {
        // Calculate XP earned
        const totalItems = data.results.length;
        const correctItems = data.results.filter(r => r.correct).length;
        const baseXP = totalItems * 2; // 2 XP per item
        const bonusXP = data.accuracy === 100 ? 10 : 0; // Bonus for perfect score
        const xpEarned = baseXP + bonusXP;

        // Update user progress for each item
        for (const result of data.results) {
            // Check if progress exists
            const existing = await db.select()
                .from(userProgress)
                .where(
                    and(
                        eq(userProgress.userId, user.id),
                        eq(userProgress.itemType, result.itemType),
                        eq(userProgress.itemId, result.itemId)
                    )
                );

            if (existing.length > 0) {
                // Update existing progress
                const current = existing[0];
                const { newStage, nextReview } = calculateNextReview(
                    current.srsStage,
                    result.correct
                );

                await db.update(userProgress)
                    .set({
                        srsStage: newStage,
                        correctCount: result.correct ? current.correctCount + 1 : current.correctCount,
                        incorrectCount: result.correct ? current.incorrectCount : current.incorrectCount + 1,
                        nextReview,
                        lastReviewed: new Date(),
                        updatedAt: new Date(),
                    })
                    .where(eq(userProgress.id, current.id));
            } else {
                // Create new progress entry
                const { newStage, nextReview } = calculateNextReview(0, result.correct);

                await db.insert(userProgress).values({
                    userId: user.id,
                    itemType: result.itemType,
                    itemId: result.itemId,
                    srsStage: newStage,
                    correctCount: result.correct ? 1 : 0,
                    incorrectCount: result.correct ? 0 : 1,
                    nextReview,
                    lastReviewed: new Date(),
                });
            }
        }

        // Also save lesson-level progress for unit unlock tracking
        const existingLessonProgress = await db.select()
            .from(userProgress)
            .where(
                and(
                    eq(userProgress.userId, user.id),
                    eq(userProgress.itemType, 'lesson'),
                    eq(userProgress.itemId, data.lessonId)
                )
            );

        if (existingLessonProgress.length === 0) {
            // Mark lesson as completed (SRS stage 1 = learned)
            await db.insert(userProgress).values({
                userId: user.id,
                itemType: 'lesson',
                itemId: data.lessonId,
                srsStage: 1,
                correctCount: correctItems,
                incorrectCount: totalItems - correctItems,
                nextReview: new Date(Date.now() + 24 * 60 * 60 * 1000),
                lastReviewed: new Date(),
            });
        } else {
            // Update existing lesson progress
            await db.update(userProgress)
                .set({
                    correctCount: existingLessonProgress[0].correctCount + correctItems,
                    incorrectCount: existingLessonProgress[0].incorrectCount + (totalItems - correctItems),
                    lastReviewed: new Date(),
                    updatedAt: new Date(),
                })
                .where(eq(userProgress.id, existingLessonProgress[0].id));
        }

        // Update user profile with XP and streak
        const [profile] = await db.select()
            .from(userProfiles)
            .where(eq(userProfiles.id, user.id));

        if (profile) {
            // Update streak logic
            const lastStudy = profile.lastStudyDate ? new Date(profile.lastStudyDate) : null;
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            let newStreak = profile.studyStreak;

            if (lastStudy) {
                const lastStudyDate = new Date(lastStudy);
                lastStudyDate.setHours(0, 0, 0, 0);

                const daysDiff = Math.floor((today.getTime() - lastStudyDate.getTime()) / (1000 * 60 * 60 * 24));

                if (daysDiff === 0) {
                    // Same day - keep streak
                    newStreak = profile.studyStreak;
                } else if (daysDiff === 1) {
                    // Consecutive day - increment
                    newStreak = profile.studyStreak + 1;
                } else {
                    // Missed day(s) - reset
                    newStreak = 1;
                }
            } else {
                // First study
                newStreak = 1;
            }

            await db.update(userProfiles)
                .set({
                    totalXp: profile.totalXp + xpEarned,
                    studyStreak: newStreak,
                    lastStudyDate: new Date(),
                    updatedAt: new Date(),
                })
                .where(eq(userProfiles.id, user.id));
        }

        // Revalidate paths
        revalidatePath('/learn');
        revalidatePath(`/learn/[courseId]`, 'page');

        return {
            success: true,
            xpEarned,
            newStreak: profile ? (profile.studyStreak + 1) : 1,
        };
    } catch (error: any) {
        console.error('Error completing lesson:', error);
        return { error: 'Failed to complete lesson' };
    }
}
