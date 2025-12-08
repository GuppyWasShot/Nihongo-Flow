import { db } from '../../../lib/db';
import { courses, userProfiles, units, lessons, userProgress } from '../../../lib/db/schema';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Flame, Trophy, Zap, ArrowRight, BookOpen, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { eq, and, inArray } from 'drizzle-orm';

async function getUserData() {
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

    // Get user profile from database
    let [profile] = await db.select().from(userProfiles).where(eq(userProfiles.id, user.id));

    // If profile doesn't exist, create it
    if (!profile) {
        [profile] = await db.insert(userProfiles).values({
            id: user.id,
            email: user.email!,
            displayName: user.user_metadata?.name || null,
            avatarUrl: user.user_metadata?.avatar_url || null,
        }).returning();
    }

    return { user, profile };
}

function calculateLevel(xp: number): string {
    if (xp < 100) return 'Beginner';
    if (xp < 500) return 'Elementary';
    if (xp < 1000) return 'Intermediate';
    if (xp < 2000) return 'Advanced';
    return 'Expert';
}

export default async function LearnPage() {
    const { user, profile } = await getUserData();

    // Fetch all courses
    const allCourses = await db.select().from(courses).orderBy(courses.order);

    // Fetch all units and lessons for progress calculation
    const allUnits = await db.select().from(units);
    const allLessons = await db.select().from(lessons);

    // Get all lesson IDs
    const lessonIds = allLessons.map(l => l.id);

    // Fetch user's completed lessons (lessons in user_progress = completed)
    const completedLessonProgress = lessonIds.length > 0
        ? await db.select().from(userProgress).where(
            and(
                eq(userProgress.userId, user.id),
                eq(userProgress.itemType, 'lesson'),
                inArray(userProgress.itemId, lessonIds)
            )
        )
        : [];

    const completedLessonIds = new Set(completedLessonProgress.map(p => p.itemId));

    // Calculate course progress from actual data
    const coursesWithProgress = allCourses.map(course => {
        const courseUnits = allUnits.filter(u => u.courseId === course.id);
        const courseLessons = allLessons.filter(l =>
            courseUnits.some(u => u.id === l.unitId)
        );

        const totalLessons = courseLessons.length;
        const completedLessons = courseLessons.filter(l => completedLessonIds.has(l.id)).length;

        // A unit is complete if all its lessons are complete
        const completedUnits = courseUnits.filter(unit => {
            const unitLessons = courseLessons.filter(l => l.unitId === unit.id);
            return unitLessons.length > 0 && unitLessons.every(l => completedLessonIds.has(l.id));
        }).length;

        const progressPercentage = totalLessons > 0
            ? Math.round((completedLessons / totalLessons) * 100)
            : 0;

        return {
            ...course,
            completedUnits,
            totalUnits: courseUnits.length,
            completedLessons,
            totalLessons,
            progressPercentage,
        };
    });

    const userXp = profile?.totalXp ?? 0;
    const userStreak = profile?.studyStreak ?? 0;
    const userLevel = calculateLevel(userXp);

    return (
        <div className="max-w-7xl mx-auto">
            {/* Stats Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {/* Streak Counter */}
                <div className="group bg-gradient-to-br from-rose-50 to-orange-50 dark:from-rose-900/20 dark:to-orange-900/20 rounded-2xl border border-rose-200/50 dark:border-rose-800/50 p-8 transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg min-h-[140px]">
                    <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                            <Flame className="w-12 h-12 text-rose-400 animate-pulse" />
                        </div>
                        <div>
                            <p className="text-4xl font-semibold text-slate-900 dark:text-slate-100">{userStreak}</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Day Streak 🔥</p>
                        </div>
                    </div>
                </div>

                {/* XP Total */}
                <div className="group bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl border border-emerald-200/50 dark:border-emerald-800/50 p-8 transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg min-h-[140px]">
                    <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                            <Zap className="w-12 h-12 text-emerald-500 dark:text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-4xl font-semibold text-slate-900 dark:text-slate-100">{userXp}</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Total XP</p>
                        </div>
                    </div>
                </div>

                {/* Level */}
                <div className="group bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-2xl border border-teal-200/50 dark:border-teal-800/50 p-8 transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg min-h-[140px]">
                    <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                            <Trophy className="w-12 h-12 text-teal-500 dark:text-teal-400" />
                        </div>
                        <div>
                            <p className="text-4xl font-semibold text-slate-900 dark:text-slate-100">{userLevel}</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Level</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Continue Learning CTA */}
            <div className="mb-10">
                <Link
                    href="/learn/n5"
                    className="group block bg-gradient-to-r from-emerald-500 to-teal-500 dark:from-emerald-600 dark:to-teal-600 rounded-2xl p-8 hover:from-emerald-600 hover:to-teal-600 dark:hover:from-emerald-500 dark:hover:to-teal-500 transition-all duration-300 shadow-md hover:shadow-xl hover:translate-y-[-2px] active:scale-[0.99]"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-5">
                            <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl">
                                <BookOpen className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-semibold text-white mb-1">
                                    Continue Learning
                                </h3>
                                <p className="text-emerald-100">
                                    Pick up where you left off in Unit 1
                                </p>
                            </div>
                        </div>
                        <ArrowRight className="w-8 h-8 text-white group-hover:translate-x-2 transition-transform duration-300" />
                    </div>
                </Link>
            </div>

            {/* Header */}
            <div className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-2">Your Courses</h2>
                <p className="text-slate-600 dark:text-slate-400">Track your progress across all JLPT levels</p>
            </div>

            {/* Courses with Progress Bars */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {coursesWithProgress.map((course) => (
                    <Link
                        key={course.id}
                        href={`/learn/${course.level.toLowerCase()}`}
                        className="group"
                    >
                        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-8 hover:border-emerald-400 dark:hover:border-emerald-500/50 hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px] active:scale-[0.99]">
                            {/* Course Icon & Title */}
                            <div className="flex items-center gap-5 mb-5">
                                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl group-hover:scale-105 transition-transform duration-300">
                                    <BookOpen className="w-8 h-8 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                        {course.title}
                                    </h3>
                                    <span className="inline-block mt-1 px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full text-xs font-semibold">
                                        JLPT {course.level}
                                    </span>
                                </div>
                            </div>

                            {/* Description */}
                            {course.description && (
                                <p className="text-slate-600 dark:text-slate-400 text-sm mb-5 line-clamp-2 leading-relaxed">
                                    {course.description}
                                </p>
                            )}

                            {/* Progress Bar */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-600 dark:text-slate-400">Progress</span>
                                    <span className="font-medium text-slate-900 dark:text-slate-100">
                                        {course.completedUnits} / {course.totalUnits} units
                                    </span>
                                </div>
                                <div className="bg-slate-100 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                                    <div
                                        className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full transition-all duration-500 rounded-full"
                                        style={{ width: `${course.progressPercentage}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Empty State */}
            {coursesWithProgress.length === 0 && (
                <div className="text-center py-16">
                    <Sparkles className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                        No Courses Available
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                        Courses will appear here once they are added to the database.
                    </p>
                </div>
            )}
        </div>
    );
}
