import { db } from '../../../../lib/db';
import { courses, units, lessons } from '../../../../lib/db/schema';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect, notFound } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { BookOpen } from 'lucide-react';
import { Breadcrumb } from '../../../../components/Breadcrumb';
import { CourseUnitsClient } from './CourseUnitsClient';

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

export default async function CoursePage({ params }: CoursePageProps) {
    const { courseId } = await params;
    const userId = await getUserId();

    // Fetch course by level (e.g., 'n5', 'n4')
    const [course] = await db.select().from(courses).where(eq(courses.level, courseId.toUpperCase()));

    if (!course) {
        notFound();
    }

    // Fetch units for this course (ordered by order)
    const courseUnits = await db
        .select()
        .from(units)
        .where(eq(units.courseId, course.id))
        .orderBy(units.order);

    // Fetch lessons for all units
    const unitIds = courseUnits.map(u => u.id);

    // Import dependencies
    const { inArray } = await import('drizzle-orm');
    const { userProgress } = await import('../../../../lib/db/schema');

    const allLessons = unitIds.length > 0
        ? await db.select().from(lessons).where(inArray(lessons.unitId, unitIds))
        : [];

    // Fetch user progress for lessons
    const lessonIds = allLessons.map(l => l.id);
    const userLessonProgress = lessonIds.length > 0
        ? await db.select().from(userProgress).where(
            inArray(userProgress.itemId, lessonIds)
        ).then(rows => rows.filter(r => r.userId === userId && r.itemType === 'lesson'))
        : [];

    // Create a set of completed lesson IDs for quick lookup
    const completedLessonIds = new Set(userLessonProgress.map(p => p.itemId));

    // Group lessons by unit
    const lessonsByUnit = new Map<number, typeof allLessons>();
    courseUnits.forEach(unit => {
        lessonsByUnit.set(unit.id, allLessons.filter(l => l.unitId === unit.id));
    });

    // Calculate progress - a unit is unlocked if:
    // 1. It's the first unit (idx === 0), OR
    // 2. All lessons from the previous unit are completed (have progress entries)
    const unitsWithProgress = courseUnits.map((unit, idx) => {
        const unitLessons = lessonsByUnit.get(unit.id) || [];
        const completedCount = unitLessons.filter(l => completedLessonIds.has(l.id)).length;
        const totalLessons = unitLessons.length;
        const isComplete = totalLessons > 0 && completedCount === totalLessons;

        // Check if previous unit's lessons are all completed
        let isUnlocked = idx === 0; // First unit always unlocked
        if (idx > 0) {
            const prevUnit = courseUnits[idx - 1];
            const prevUnitLessons = lessonsByUnit.get(prevUnit.id) || [];
            const prevUnitCompleted = prevUnitLessons.length > 0 &&
                prevUnitLessons.every(l => completedLessonIds.has(l.id));
            isUnlocked = prevUnitCompleted;
        }

        return {
            ...unit,
            isUnlocked,
            isComplete,
            completedLessons: completedCount,
            totalLessons,
        };
    });

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
                    {(() => {
                        const totalLessons = allLessons.length;
                        const completedCount = allLessons.filter(l => completedLessonIds.has(l.id)).length;
                        const progressPercentage = totalLessons > 0
                            ? Math.round((completedCount / totalLessons) * 100)
                            : 0;
                        return (
                            <>
                                <div className="flex items-center justify-between text-sm mb-2">
                                    <span className="text-emerald-100">Course Progress</span>
                                    <span className="font-medium">{progressPercentage}%</span>
                                </div>
                                <div className="bg-white/20 rounded-full h-2.5 overflow-hidden">
                                    <div
                                        className="bg-white h-full rounded-full transition-all duration-500"
                                        style={{ width: `${progressPercentage}%` }}
                                    />
                                </div>
                            </>
                        );
                    })()}
                </div>
            </div>

            {/* Units List - Client component for localStorage state */}
            <CourseUnitsClient
                courseId={courseId}
                units={unitsWithProgress}
                lessonsByUnit={Object.fromEntries(
                    Array.from(lessonsByUnit.entries()).map(([k, v]) => [
                        k,
                        v.map(l => ({ id: l.id, title: l.title, type: l.type }))
                    ])
                )}
                completedLessonIds={Array.from(completedLessonIds)}
            />

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
