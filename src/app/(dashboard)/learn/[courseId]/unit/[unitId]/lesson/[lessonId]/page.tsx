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
                set() { },
                remove() { },
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
                        className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to course
                    </Link>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-2xl border-2 border-slate-200 dark:border-slate-700 p-8 text-center transition-colors">
                    <div className="flex justify-center mb-6">
                        <div className="flex items-center justify-center w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-full">
                            <Lock className="w-10 h-10 text-slate-400 dark:text-slate-500" />
                        </div>
                    </div>

                    <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                        Lesson Locked
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 mb-8">
                        You need to master these vocabulary words before starting this lesson:
                    </p>

                    <div className="max-w-2xl mx-auto space-y-3 mb-8">
                        {unmetDependencies.map((vocab: any) => (
                            <div
                                key={vocab.id}
                                className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 border border-slate-200 dark:border-slate-600 flex items-center justify-between"
                            >
                                <div className="text-left">
                                    <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{vocab.writing}</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">{vocab.reading} • {vocab.meaning}</p>
                                </div>
                                <div className="text-xs px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-full font-medium">
                                    Not mastered
                                </div>
                            </div>
                        ))}
                    </div>

                    <Link
                        href="/review"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 shadow-lg hover:shadow-xl"
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
