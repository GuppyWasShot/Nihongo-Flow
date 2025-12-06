import { db } from '../../../../lib/db';
import { courses, units, lessons } from '../../../../lib/db/schema';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect, notFound } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { BookOpen, ChevronRight, Lock, CheckCircle, Play } from 'lucide-react';
import Link from 'next/link';
import { Breadcrumb } from '../../../../components/Breadcrumb';

interface CoursePageProps {
    params: Promise<{
        courseId: string;
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

export default async function CoursePage({ params }: CoursePageProps) {
    const { courseId } = await params;
    await getUserId();

    // Fetch course by level (e.g., 'n5', 'n4')
    const [course] = await db.select().from(courses).where(eq(courses.level, courseId.toUpperCase()));

    if (!course) {
        notFound();
    }

    // Fetch units for this course
    const courseUnits = await db.select().from(units).where(eq(units.courseId, course.id));

    // Fetch lessons for all units
    const unitIds = courseUnits.map(u => u.id);
    const allLessons = unitIds.length > 0
        ? await db.select().from(lessons).where(eq(lessons.unitId, courseUnits[0].id))
        : [];

    // Group lessons by unit
    const lessonsByUnit = new Map<number, typeof allLessons>();
    courseUnits.forEach(unit => {
        lessonsByUnit.set(unit.id, allLessons.filter(l => l.unitId === unit.id));
    });

    // Calculate mock progress (TODO: Use actual user progress)
    const unitsWithProgress = courseUnits.map((unit, idx) => ({
        ...unit,
        isUnlocked: idx === 0, // Only first unit unlocked for now
        isComplete: false,
        completedLessons: 0,
        totalLessons: lessonsByUnit.get(unit.id)?.length || 0,
    }));

    return (
        <div className="max-w-4xl mx-auto">
            <Breadcrumb items={[
                { label: 'Learn', href: '/learn' },
                { label: course.title }
            ]} />

            {/* Course Header */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-3xl p-10 mb-10 text-white shadow-lg">
                <div className="flex items-start gap-6">
                    <div className="flex items-center justify-center w-20 h-20 bg-white/20 rounded-2xl">
                        <BookOpen className="w-10 h-10 text-white" />
                    </div>
                    <div className="flex-1">
                        <h1 className="text-4xl font-semibold mb-2">{course.title}</h1>
                        <p className="text-emerald-100 text-lg mb-6 leading-relaxed">{course.description}</p>
                        <div className="flex items-center gap-6">
                            <span className="px-4 py-2 bg-white/20 rounded-full text-sm font-medium">
                                {courseUnits.length} Units
                            </span>
                            <span className="px-4 py-2 bg-white/20 rounded-full text-sm font-medium">
                                JLPT {course.level}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-8">
                    <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-emerald-100">Course Progress</span>
                        <span className="font-medium">0%</span>
                    </div>
                    <div className="bg-white/20 rounded-full h-2.5 overflow-hidden">
                        <div
                            className="bg-white h-full rounded-full"
                            style={{ width: '0%' }}
                        />
                    </div>
                </div>
            </div>

            {/* Units List */}
            <div className="space-y-6">
                {unitsWithProgress.map((unit, unitIdx) => (
                    <div
                        key={unit.id}
                        className={`bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden transition-all duration-300 ${unit.isUnlocked ? 'hover:shadow-lg hover:border-emerald-300 dark:hover:border-emerald-600/50' : 'opacity-70'
                            }`}
                    >
                        {/* Unit Header */}
                        <div className="p-6 border-b border-slate-100 dark:border-slate-700">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${unit.isComplete
                                            ? 'bg-emerald-100 dark:bg-emerald-900/30'
                                            : unit.isUnlocked
                                                ? 'bg-emerald-100 dark:bg-emerald-900/30'
                                                : 'bg-slate-100 dark:bg-slate-700'
                                        }`}>
                                        {unit.isComplete ? (
                                            <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                                        ) : unit.isUnlocked ? (
                                            <span className="text-xl font-semibold text-emerald-600 dark:text-emerald-400">{unitIdx + 1}</span>
                                        ) : (
                                            <Lock className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">{unit.title}</h3>
                                        {unit.description && (
                                            <p className="text-sm text-slate-500 dark:text-slate-400">{unit.description}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="text-sm text-slate-500 dark:text-slate-400">
                                    {unit.completedLessons} / {unit.totalLessons} lessons
                                </div>
                            </div>
                        </div>

                        {/* Lessons List */}
                        {unit.isUnlocked && (
                            <div className="divide-y divide-slate-100 dark:divide-slate-700">
                                {lessonsByUnit.get(unit.id)?.map((lesson, lessonIdx) => {
                                    const isLessonUnlocked = lessonIdx === 0; // Only first lesson unlocked

                                    return (
                                        <Link
                                            key={lesson.id}
                                            href={isLessonUnlocked ? `/learn/${courseId}/unit/${unit.id}/lesson/${lesson.id}` : '#'}
                                            className={`flex items-center justify-between px-6 py-5 transition-colors group ${isLessonUnlocked
                                                    ? 'hover:bg-emerald-50 dark:hover:bg-emerald-900/10 cursor-pointer'
                                                    : 'opacity-60 cursor-not-allowed'
                                                }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${isLessonUnlocked
                                                        ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400'
                                                        : 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500'
                                                    }`}>
                                                    {isLessonUnlocked ? (
                                                        <Play className="w-4 h-4" />
                                                    ) : (
                                                        <Lock className="w-4 h-4" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className={`font-medium ${isLessonUnlocked
                                                            ? 'text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400'
                                                            : 'text-slate-500 dark:text-slate-400'
                                                        }`}>
                                                        {lesson.title}
                                                    </p>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400 capitalize">{lesson.type.replace('_', ' ')}</p>
                                                </div>
                                            </div>
                                            {isLessonUnlocked && (
                                                <ChevronRight className="w-5 h-5 text-slate-400 dark:text-slate-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {courseUnits.length === 0 && (
                <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/50">
                    <BookOpen className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-slate-900 dark:text-slate-100 mb-2">
                        Coming Soon
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                        Units for this course are being prepared.
                    </p>
                </div>
            )}
        </div>
    );
}
