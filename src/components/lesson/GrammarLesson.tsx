'use client';

import { motion } from 'framer-motion';
import { BookOpen, Lightbulb, ChevronRight, Volume2 } from 'lucide-react';

interface GrammarExample {
    japanese: string;
    reading: string;
    english: string;
}

interface GrammarLessonProps {
    lesson: {
        id: number;
        title: string;
        content: {
            grammar?: string;
            explanation?: string;
            formation?: string;
            examples?: GrammarExample[];
            notes?: string;
        };
    };
    onComplete: () => void;
}

export default function GrammarLesson({ lesson, onComplete }: GrammarLessonProps) {
    const { content } = lesson;

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
            <div className="max-w-3xl mx-auto px-4 py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 mb-2">
                        <BookOpen className="w-4 h-4" />
                        <span>Grammar Lesson</span>
                    </div>
                    <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">
                        {lesson.title}
                    </h1>
                </motion.div>

                {/* Grammar Pattern Card */}
                {content.grammar && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-8 mb-6 text-white shadow-lg"
                    >
                        <p className="text-sm uppercase tracking-wider opacity-80 mb-2">Pattern</p>
                        <h2 className="text-4xl font-semibold mb-4">{content.grammar}</h2>
                        {content.formation && (
                            <div className="bg-white/20 rounded-xl px-4 py-2 inline-block">
                                <span className="text-sm">Formation: </span>
                                <span className="font-medium">{content.formation}</span>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Explanation */}
                {content.explanation && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-6 mb-6"
                    >
                        <div className="flex items-start gap-3 mb-4">
                            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                                <Lightbulb className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-2">Explanation</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                    {content.explanation}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Examples */}
                {content.examples && content.examples.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-6 mb-6"
                    >
                        <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-4">Examples</h3>
                        <div className="space-y-4">
                            {content.examples.map((example, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 + idx * 0.1 }}
                                    className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl border-l-4 border-emerald-500"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <p className="text-xl font-medium text-slate-900 dark:text-slate-100 mb-1">
                                                {example.japanese}
                                            </p>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                                                {example.reading}
                                            </p>
                                            <p className="text-slate-600 dark:text-slate-300">
                                                {example.english}
                                            </p>
                                        </div>
                                        <button
                                            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors"
                                            aria-label="Play audio"
                                        >
                                            <Volume2 className="w-5 h-5 text-slate-400" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Notes */}
                {content.notes && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-teal-50 dark:bg-teal-900/20 rounded-2xl border border-teal-200 dark:border-teal-700/50 p-6 mb-8"
                    >
                        <h3 className="font-medium text-teal-800 dark:text-teal-200 mb-2">📝 Note</h3>
                        <p className="text-teal-700 dark:text-teal-300 leading-relaxed">
                            {content.notes}
                        </p>
                    </motion.div>
                )}

                {/* Continue Button */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    <button
                        onClick={onComplete}
                        className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-lg font-medium rounded-2xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-md hover:shadow-lg active:scale-[0.98]"
                    >
                        Continue to Practice
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </motion.div>
            </div>
        </div>
    );
}
