import { db } from '../../../../../../../../lib/db';
import { lessons, vocabulary, userProgress, units, type UserProgress } from '../../../../../../../../lib/db/schema';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect, notFound } from 'next/navigation';
import { eq, and, inArray } from 'drizzle-orm';
import QuizSession from '../../../../../../../../components/lesson/QuizSession';
import { Lock, ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface LessonPageProps {
    params: Promise<{
        courseId: string;
        unitId: string;
        lessonId: string;
    }>;
}

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

export default async function LessonPage({ params }: LessonPageProps) {
    const { courseId, unitId, lessonId } = await params;
    const userId = await getUserId();

    // Fetch lesson
    const [lesson] = await db.select()
        .from(lessons)
        .where(eq(lessons.id, parseInt(lessonId)));

    if (!lesson) {
        notFound();
    }

    // Fetch unit for navigation
    const [unit] = await db.select()
        .from(units)
        .where(eq(units.id, parseInt(unitId)));

    // Check vocabulary dependencies
    const requiredVocabIds = (lesson.requiredVocabulary as number[]) || [];
    let unmetDependencies: any[] = [];

    if (requiredVocabIds.length > 0) {
        // Fetch required vocabulary
        const requiredVocab = await db.select()
            .from(vocabulary)
            .where(inArray(vocabulary.id, requiredVocabIds));

        // Check user progress for each required vocab
        const vocabProgress = await db.select()
            .from(userProgress)
            .where(
                and(
                    eq(userProgress.userId, userId),
                    eq(userProgress.itemType, 'vocabulary'),
                    inArray(userProgress.itemId, requiredVocabIds)
                )
            );

        // Map progress by itemId
        const progressMap = new Map<number, UserProgress>(
            vocabProgress.map((p: UserProgress) => [p.itemId, p])
        );

        // Find unmet dependencies (SRS stage < 3 = not mastered enough)
        unmetDependencies = requiredVocab.filter((v: typeof vocabulary.$inferSelect) => {
            const progress = progressMap.get(v.id);
            return !progress || progress.srsStage < 3;
        });
    }

    // If there are unmet dependencies, show locked screen
    if (unmetDependencies.length > 0) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <Link
                        href={`/learn/${courseId}`}
                        className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to course
                    </Link>
                </div>

                <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 text-center">
                    <div className="flex justify-center mb-6">
                        <div className="flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full">
                            <Lock className="w-10 h-10 text-gray-400" />
                        </div>
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        Lesson Locked
                    </h1>
                    <p className="text-gray-600 mb-8">
                        You need to master these vocabulary words before starting this lesson:
                    </p>

                    <div className="max-w-2xl mx-auto space-y-3 mb-8">
                        {unmetDependencies.map((vocab: any) => (
                            <div
                                key={vocab.id}
                                className="bg-gray-50 rounded-xl p-4 border border-gray-200 flex items-center justify-between"
                            >
                                <div className="text-left">
                                    <p className="text-xl font-bold text-gray-900">{vocab.writing}</p>
                                    <p className="text-sm text-gray-600">{vocab.reading} • {vocab.meaning}</p>
                                </div>
                                <div className="text-xs px-3 py-1 bg-orange-100 text-orange-700 rounded-full font-medium">
                                    Not mastered
                                </div>
                            </div>
                        ))}
                    </div>

                    <Link
                        href="/review"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                        Go to Vocabulary Drill
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        );
    }

    // Lesson is unlocked - prepare quiz data
    const lessonData = {
        id: lesson.id,
        title: lesson.title,
        type: lesson.type,
        content: lesson.content as any,
    };

    return (
        <div>
            <QuizSession
                lesson={lessonData}
                courseId={courseId}
                unitId={parseInt(unitId)}
            />
        </div>
    );
}
