import { getMockExams } from './actions';
import Link from 'next/link';
import { FileText, Clock, Target, ChevronRight, Award, TrendingUp } from 'lucide-react';
import { PageHeader } from '../../../components/PageHeader';
import { MockExam } from '../../../lib/db/schema';

export default async function ExamPage() {
    const { exams, error } = await getMockExams();

    if (error) {
        return (
            <div className="max-w-4xl mx-auto">
                <PageHeader
                    icon={FileText}
                    title="Mock Exams"
                    description="Test your knowledge with JLPT-style practice exams"
                />
                <div className="bg-rose-50 dark:bg-rose-900/20 rounded-2xl p-6 text-center">
                    <p className="text-rose-600 dark:text-rose-400">Failed to load exams. Please try again.</p>
                </div>
            </div>
        );
    }

    // Group exams by level
    const examsByLevel = exams.reduce<Record<string, MockExam[]>>((acc, exam) => {
        const level = exam.level;
        if (!acc[level]) acc[level] = [];
        acc[level].push(exam);
        return acc;
    }, {});

    const levelOrder = ['N5', 'N4', 'N3', 'N2', 'N1'];
    const sortedLevels = levelOrder.filter(level => examsByLevel[level]);

    return (
        <div className="max-w-4xl mx-auto">
            <PageHeader
                icon={FileText}
                title="Mock Exams"
                description="Test your knowledge with JLPT-style practice exams"
            />

            {exams.length === 0 ? (
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-12 text-center">
                    <div className="flex justify-center mb-6">
                        <div className="flex items-center justify-center w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full">
                            <FileText className="w-8 h-8 text-slate-400" />
                        </div>
                    </div>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                        No Exams Available
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400">
                        Mock exams will appear here once they are created.
                    </p>
                </div>
            ) : (
                <div className="space-y-8">
                    {sortedLevels.map(level => (
                        <div key={level}>
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                                <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-lg text-sm">
                                    {level}
                                </span>
                                <span>{level === 'N5' ? 'Beginner' : level === 'N4' ? 'Elementary' : level === 'N3' ? 'Intermediate' : level === 'N2' ? 'Upper Intermediate' : 'Advanced'}</span>
                            </h2>
                            <div className="grid gap-4">
                                {examsByLevel[level].map((exam) => (
                                    <Link
                                        key={exam.id}
                                        href={`/exam/${exam.id}`}
                                        className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-6 hover:shadow-lg hover:border-emerald-300 dark:hover:border-emerald-600/50 transition-all"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                                    {exam.title}
                                                </h3>
                                                {exam.description && (
                                                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
                                                        {exam.description}
                                                    </p>
                                                )}
                                                <div className="flex flex-wrap gap-4 text-sm">
                                                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                                                        <Clock className="w-4 h-4 text-slate-400" />
                                                        <span>{exam.totalTimeLimit} min</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                                                        <Target className="w-4 h-4 text-slate-400" />
                                                        <span>Pass: {exam.passingScore}%</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                                                        <FileText className="w-4 h-4 text-slate-400" />
                                                        <span>{exam.sections.reduce((sum, s) => sum + s.questionCount, 0)} questions</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <ChevronRight className="w-6 h-6 text-slate-300 dark:text-slate-600 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Tips Section */}
            <div className="mt-8 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl p-6 border border-emerald-200/50 dark:border-emerald-700/50">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                    <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    Exam Tips
                </h3>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                    <li className="flex items-start gap-2">
                        <span className="text-emerald-500">•</span>
                        <span>Take exams in a quiet environment to simulate real test conditions</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-emerald-500">•</span>
                        <span>Don't spend too long on difficult questions - mark them and move on</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-emerald-500">•</span>
                        <span>Review your incorrect answers after each exam to identify weak areas</span>
                    </li>
                </ul>
            </div>
        </div>
    );
}
