'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Lightbulb, ChevronRight, Volume2, Check, X, AlertTriangle, HelpCircle } from 'lucide-react';

interface GrammarExample {
    japanese: string;
    reading: string;
    english: string;
}

interface UseCase {
    correct: string;
    incorrect: string;
    explanation: string;
}

interface CommonMistake {
    mistake: string;
    correction: string;
    why: string;
}

interface QuickCheckQuestion {
    question: string;
    options: string[];
    answer: number;
    explanation?: string;
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
            useCases?: UseCase[];
            commonMistakes?: CommonMistake[];
            quickCheck?: QuickCheckQuestion[];
            notes?: string;
        };
    };
    onComplete: () => void;
}

export default function GrammarLesson({ lesson, onComplete }: GrammarLessonProps) {
    const { content } = lesson;
    const [quizAnswers, setQuizAnswers] = useState<Record<number, number | null>>({});
    const [showResults, setShowResults] = useState<Record<number, boolean>>({});

    const handleQuizAnswer = (questionIdx: number, answerIdx: number) => {
        setQuizAnswers(prev => ({ ...prev, [questionIdx]: answerIdx }));
        setShowResults(prev => ({ ...prev, [questionIdx]: true }));
    };

    const allQuizAnswered = content.quickCheck?.every((_, idx) => showResults[idx]) ?? true;

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

                {/* Use Cases - Correct vs Incorrect */}
                {content.useCases && content.useCases.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-6 mb-6"
                    >
                        <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                            <HelpCircle className="w-5 h-5 text-blue-500" />
                            Correct vs Incorrect Usage
                        </h3>
                        <div className="space-y-4">
                            {content.useCases.map((useCase, idx) => (
                                <div key={idx} className="space-y-3">
                                    {/* Correct */}
                                    <div className="flex items-start gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-700/50">
                                        <div className="p-1 bg-emerald-500 rounded-full flex-shrink-0">
                                            <Check className="w-4 h-4 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-lg font-medium text-emerald-800 dark:text-emerald-200">
                                                {useCase.correct}
                                            </p>
                                            <p className="text-sm text-emerald-600 dark:text-emerald-400">Correct ✓</p>
                                        </div>
                                    </div>
                                    {/* Incorrect */}
                                    <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-700/50">
                                        <div className="p-1 bg-red-500 rounded-full flex-shrink-0">
                                            <X className="w-4 h-4 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-lg font-medium text-red-800 dark:text-red-200 line-through opacity-70">
                                                {useCase.incorrect}
                                            </p>
                                            <p className="text-sm text-red-600 dark:text-red-400">Incorrect ✗</p>
                                        </div>
                                    </div>
                                    {/* Explanation */}
                                    <div className="ml-8 p-3 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                            💡 {useCase.explanation}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Common Mistakes */}
                {content.commonMistakes && content.commonMistakes.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.45 }}
                        className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-700/50 p-6 mb-6"
                    >
                        <h3 className="font-medium text-amber-800 dark:text-amber-200 mb-4 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5" />
                            Common Mistakes to Avoid
                        </h3>
                        <div className="space-y-4">
                            {content.commonMistakes.map((mistake, idx) => (
                                <div key={idx} className="p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl">
                                    <div className="flex items-start gap-3">
                                        <span className="text-2xl">⚠️</span>
                                        <div>
                                            <p className="font-medium text-amber-900 dark:text-amber-100 mb-1">
                                                {mistake.mistake}
                                            </p>
                                            <p className="text-emerald-700 dark:text-emerald-300 text-sm mb-2">
                                                ✓ Correction: {mistake.correction}
                                            </p>
                                            <p className="text-amber-700 dark:text-amber-400 text-sm">
                                                {mistake.why}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Quick Check Quiz */}
                {content.quickCheck && content.quickCheck.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-6 mb-6"
                    >
                        <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                            🧠 Quick Check
                        </h3>
                        <div className="space-y-6">
                            {content.quickCheck.map((q, qIdx) => (
                                <div key={qIdx} className="space-y-3">
                                    <p className="font-medium text-slate-800 dark:text-slate-200">
                                        {qIdx + 1}. {q.question}
                                    </p>
                                    <div className="grid grid-cols-2 gap-2">
                                        {q.options.map((option, oIdx) => {
                                            const isSelected = quizAnswers[qIdx] === oIdx;
                                            const isCorrect = oIdx === q.answer;
                                            const showResult = showResults[qIdx];

                                            let buttonClass = 'p-3 rounded-xl border-2 text-left transition-all ';
                                            if (showResult) {
                                                if (isCorrect) {
                                                    buttonClass += 'bg-emerald-100 dark:bg-emerald-900/30 border-emerald-500 text-emerald-800 dark:text-emerald-200';
                                                } else if (isSelected && !isCorrect) {
                                                    buttonClass += 'bg-red-100 dark:bg-red-900/30 border-red-500 text-red-800 dark:text-red-200';
                                                } else {
                                                    buttonClass += 'bg-slate-50 dark:bg-slate-700/30 border-slate-200 dark:border-slate-600 text-slate-500';
                                                }
                                            } else {
                                                buttonClass += 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 hover:border-emerald-400 dark:hover:border-emerald-500 text-slate-700 dark:text-slate-300';
                                            }

                                            return (
                                                <button
                                                    key={oIdx}
                                                    onClick={() => !showResult && handleQuizAnswer(qIdx, oIdx)}
                                                    disabled={showResult}
                                                    className={buttonClass}
                                                >
                                                    <span className="flex items-center gap-2">
                                                        {showResult && isCorrect && <Check className="w-4 h-4" />}
                                                        {showResult && isSelected && !isCorrect && <X className="w-4 h-4" />}
                                                        {option}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <AnimatePresence>
                                        {showResults[qIdx] && q.explanation && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="p-3 bg-slate-100 dark:bg-slate-700/50 rounded-lg"
                                            >
                                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                                    💡 {q.explanation}
                                                </p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Notes */}
                {content.notes && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.55 }}
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
                        disabled={!allQuizAnswered}
                        className={`w-full flex items-center justify-center gap-2 px-8 py-4 text-lg font-medium rounded-2xl transition-all duration-300 shadow-md hover:shadow-lg active:scale-[0.98] ${allQuizAnswered
                                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600'
                                : 'bg-slate-300 dark:bg-slate-600 text-slate-500 dark:text-slate-400 cursor-not-allowed'
                            }`}
                    >
                        {allQuizAnswered ? (
                            <>
                                Continue to Practice
                                <ChevronRight className="w-5 h-5" />
                            </>
                        ) : (
                            'Complete the Quick Check to continue'
                        )}
                    </button>
                </motion.div>
            </div>
        </div>
    );
}

