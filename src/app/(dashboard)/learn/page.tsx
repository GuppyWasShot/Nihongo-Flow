import { db } from '../../../lib/db';
import { courses, userProfiles } from '../../../lib/db/schema';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Flame, Trophy, Zap, ArrowRight, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { eq } from 'drizzle-orm';

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
    const allCourses = await db.select().from(courses);

    // Calculate course progress (mock for now - TODO: calculate from actual completion)
    const coursesWithProgress = allCourses.map(course => ({
        ...course,
        completedUnits: 0, // TODO: Calculate from user_progress
        totalUnits: 3, // TODO: Get actual count from units table
        progressPercentage: 0,
    }));

    const userXp = profile?.totalXp ?? 0;
    const userStreak = profile?.studyStreak ?? 0;
    const userLevel = calculateLevel(userXp);

    return (
        <div className="max-w-7xl mx-auto">
            {/* Stats Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {/* Streak Counter */}
                <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl border-2 border-orange-200 dark:border-orange-800 p-6 transition-colors duration-200">
                    <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                            <Flame className="w-12 h-12 text-orange-500 animate-pulse" />
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{userStreak}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Day Streak 🔥</p>
                        </div>
                    </div>
                </div>

                {/* XP Total */}
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl border-2 border-indigo-200 dark:border-indigo-800 p-6 transition-colors duration-200">
                    <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                            <Zap className="w-12 h-12 text-indigo-500 dark:text-indigo-400" />
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{userXp}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Total XP</p>
                        </div>
                    </div>
                </div>

                {/* Level */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border-2 border-green-200 dark:border-green-800 p-6 transition-colors duration-200">
                    <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                            <Trophy className="w-12 h-12 text-green-500 dark:text-green-400" />
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{userLevel}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Level</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Continue Learning CTA */}
            <div className="mb-8">
                <Link
                    href="/learn/n5"
                    className="group block bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 rounded-2xl p-6 hover:from-indigo-700 hover:to-purple-700 dark:hover:from-indigo-600 dark:hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-14 h-14 bg-white/20 rounded-xl">
                                <BookOpen className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-1">
                                    Continue Learning
                                </h3>
                                <p className="text-indigo-100">
                                    Pick up where you left off in Unit 1
                                </p>
                            </div>
                        </div>
                        <ArrowRight className="w-8 h-8 text-white group-hover:translate-x-2 transition-transform duration-200" />
                    </div>
                </Link>
            </div>

            {/* Header */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Your Courses</h2>
                <p className="text-gray-600 dark:text-gray-400">Track your progress across all JLPT levels</p>
            </div>

            {/* Courses with Progress Bars */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {coursesWithProgress.map((course) => (
                    <Link
                        key={course.id}
                        href={`/learn/${course.level.toLowerCase()}`}
                        className="group"
                    >
                        <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-6 hover:border-indigo-500 dark:hover:border-indigo-400 hover:shadow-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
                            {/* Course Icon & Title */}
                            <div className="flex items-center gap-4 mb-4">
                                <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl group-hover:scale-110 transition-transform duration-200">
                                    <BookOpen className="w-7 h-7 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                        {course.title}
                                    </h3>
                                    <span className="inline-block mt-1 px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-semibold">
                                        JLPT {course.level}
                                    </span>
                                </div>
                            </div>

                            {/* Description */}
                            {course.description && (
                                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                                    {course.description}
                                </p>
                            )}

                            {/* Progress Bar */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Progress</span>
                                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                                        {course.completedUnits} / {course.totalUnits} units
                                    </span>
                                </div>
                                <div className="bg-gray-100 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                                    <div
                                        className="bg-gradient-to-r from-indigo-600 to-purple-600 h-full transition-all duration-500"
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
                <div className="text-center py-12">
                    <BookOpen className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        No Courses Available
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                        Courses will appear here once they are added to the database.
                    </p>
                </div>
            )}
        </div>
    );
}
