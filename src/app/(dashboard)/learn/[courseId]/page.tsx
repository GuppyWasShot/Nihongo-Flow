import { db } from '../../../../lib/db';
import { courses, units, lessons, type Unit, type Lesson } from '../../../../lib/db/schema';
import { eq } from 'drizzle-orm';
import { BookOpen, Lock, CheckCircle2, Circle } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface CoursePageProps {
    params: Promise<{
        courseId: string;
    }>;
}

export default async function CoursePage({ params }: CoursePageProps) {
    // In Next.js 15, params is a Promise and must be awaited
    const { courseId } = await params;

    // Fetch course by level (e.g., "n5")
    const courseLevel = courseId.toUpperCase();

    const [course] = await db
        .select()
        .from(courses)
        .where(eq(courses.level, courseLevel));

    if (!course) {
        notFound();
    }

    // Fetch all units for this course with their lessons
    const courseUnits = await db
        .select()
        .from(units)
        .where(eq(units.courseId, course.id))
        .orderBy(units.order);

    // Fetch lessons for all units
    const allLessons = await db
        .select()
        .from(lessons)
        .where(
            eq(lessons.unitId, courseUnits[0]?.id) // For now, just get lessons from first unit
        )
        .orderBy(lessons.order);

    // TODO: Fetch user progress to determine locked/unlocked status
    // For now, only Unit 1 is unlocked
    const unitsWithStatus = courseUnits.map((unit, index) => ({
        ...unit,
        isUnlocked: index === 0, // Only first unit is unlocked for now
        lessonsCompleted: 0,
        totalLessons: index === 0 ? allLessons.length : 0,
    }));

    // Calculate overall progress
    const totalUnits = unitsWithStatus.length;
    const completedUnits = 0; // TODO: Calculate from user progress
    const progressPercentage = totalUnits > 0 ? (completedUnits / totalUnits) * 100 : 0;

    return (
        <div className="max-w-6xl mx-auto">
            {/* Course Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl">
                        <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
                        <p className="text-gray-600">{course.description}</p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 h-full transition-all duration-500"
                        style={{ width: `${progressPercentage}%` }}
                    />
                </div>
                <p className="text-sm text-gray-600 mt-2">
                    {completedUnits} of {totalUnits} units completed
                </p>
            </div>

            {/* Units List */}
            <div className="space-y-6">
                {unitsWithStatus.map((unit, unitIndex) => (
                    <div
                        key={unit.id}
                        className={`bg-white rounded-2xl border-2 p-6 transition-all duration-200 ${unit.isUnlocked
                            ? 'border-gray-200 hover:border-indigo-300 hover:shadow-lg'
                            : 'border-gray-200 opacity-60'
                            }`}
                    >
                        {/* Unit Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        Unit {unit.order}: {unit.title}
                                    </h2>
                                    {unit.isUnlocked ? (
                                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                                    ) : (
                                        <Lock className="w-6 h-6 text-gray-400" />
                                    )}
                                </div>
                                {unit.description && (
                                    <p className="text-gray-600 text-sm">{unit.description}</p>
                                )}
                            </div>

                            {/* Unit Progress */}
                            <div className="text-right ml-4">
                                <p className="text-sm font-medium text-gray-900">
                                    {unit.lessonsCompleted} / {unit.totalLessons}
                                </p>
                                <p className="text-xs text-gray-500">lessons</p>
                            </div>
                        </div>

                        {/* Locked Overlay */}
                        {!unit.isUnlocked && (
                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                                <Lock className="w-5 h-5 text-gray-400" />
                                <p className="text-sm text-gray-600">
                                    Complete Unit {unitIndex} to unlock this unit
                                </p>
                            </div>
                        )}

                        {/* Lessons Grid */}
                        {unit.isUnlocked && unit.totalLessons > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-4">
                                {allLessons.map((lesson, lessonIndex) => (
                                    <Link
                                        key={lesson.id}
                                        href={`/learn/${courseId}/unit/${unit.id}/lesson/${lesson.id}`}
                                        className="group"
                                    >
                                        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border-2 border-transparent hover:border-indigo-300 hover:shadow-md transition-all duration-200">
                                            <div className="flex items-center justify-between mb-2">
                                                <Circle className="w-4 h-4 text-gray-400 group-hover:text-indigo-600" />
                                                <span className="text-xs font-medium text-gray-500">
                                                    {lessonIndex + 1}
                                                </span>
                                            </div>
                                            <p className="text-sm font-medium text-gray-900 line-clamp-2">
                                                {lesson.title}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}

                        {/* Empty State for No Lessons */}
                        {unit.isUnlocked && unit.totalLessons === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                <p className="text-sm">No lessons available yet</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {courseUnits.length === 0 && (
                <div className="text-center py-12">
                    <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        No Units Available
                    </h3>
                    <p className="text-gray-600">
                        Units will appear here once they are added to this course.
                    </p>
                </div>
            )}
        </div>
    );
}
