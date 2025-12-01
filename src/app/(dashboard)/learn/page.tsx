import { db } from '../../../lib/db';
import { courses, type Course } from '../../../lib/db/schema';
import { BookOpen, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default async function LearnPage() {
    // Fetch all courses from database
    const allCourses = await db.select().from(courses);

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Choose Your Course
                </h1>
                <p className="text-gray-600">
                    Select a JLPT level to begin your Japanese learning journey
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allCourses.map((course: Course) => (
                    <Link
                        key={course.id}
                        href={`/learn/${course.level.toLowerCase()}`}
                        className="group"
                    >
                        <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 hover:border-indigo-500 hover:shadow-xl transition-all duration-200 cursor-pointer">
                            {/* Course Icon */}
                            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-200">
                                <BookOpen className="w-8 h-8 text-white" />
                            </div>

                            {/* Course Title */}
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                {course.title}
                            </h2>

                            {/* Course Level Badge */}
                            <div className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold mb-3">
                                JLPT {course.level}
                            </div>

                            {/* Description */}
                            {course.description && (
                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                    {course.description}
                                </p>
                            )}

                            {/* CTA */}
                            <div className="flex items-center gap-2 text-indigo-600 font-medium group-hover:gap-3 transition-all duration-200">
                                <span>Start Learning</span>
                                <ArrowRight className="w-4 h-4" />
                            </div>
                        </div>
                    </Link>
                ))}

                {/* Empty State */}
                {allCourses.length === 0 && (
                    <div className="col-span-full text-center py-12">
                        <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            No Courses Available
                        </h3>
                        <p className="text-gray-600">
                            Courses will appear here once they are added to the database.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
