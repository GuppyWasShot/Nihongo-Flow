'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { X, CheckCircle, XCircle, Trophy, ArrowRight, Target } from 'lucide-react';
import { completeLesson } from '../lesson/[lessonId]/actions';

interface Question {
    id: number;
    type: 'vocab' | 'grammar';
    question: string;
    prompt?: string;
    sentence?: string;
    sentenceReading?: string;
    options: string[];
    correctAnswer: number;
}

interface MixedPracticeSessionProps {
    unitId: number;
    unitTitle: string;
    courseId: string;
    questions: Question[];
}

export default function MixedPracticeSession({ unitId, unitTitle, courseId, questions }: MixedPracticeSessionProps) {
    const router = useRouter();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [results, setResults] = useState<{ id: number; correct: boolean }[]>([]);
    const [isComplete, setIsComplete] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Shuffle questions on mount
    const [shuffledQuestions] = useState(() =>
        [...questions].sort(() => Math.random() - 0.5)
    );

    const currentQuestion = shuffledQuestions[currentIndex];
    const progress = ((currentIndex + 1) / shuffledQuestions.length) * 100;

    const handleOptionSelect = (idx: number) => {
        if (showFeedback) return;
        setSelectedOption(idx);
    };

    const handleSubmit = () => {
        if (selectedOption === null) return;

        const correct = selectedOption === currentQuestion.correctAnswer;
        setIsCorrect(correct);
        setShowFeedback(true);
        setResults(prev => [...prev, { id: currentQuestion.id, correct }]);
    };

    const handleNext = () => {
        setSelectedOption(null);
        setShowFeedback(false);

        if (currentIndex + 1 >= shuffledQuestions.length) {
            setIsComplete(true);
        } else {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handleComplete = async () => {
        setIsSubmitting(true);
        // Navigate back to course
        router.push(`/learn/${courseId}`);
    };

    const handleExit = () => {
        if (confirm('Are you sure you want to exit? Your progress will not be saved.')) {
            router.push(`/learn/${courseId}`);
        }
    };

    // Completion screen
    if (isComplete) {
        const correctCount = results.filter(r => r.correct).length;
        const accuracy = Math.round((correctCount / results.length) * 100);
        const xpEarned = results.length * 3 + (accuracy >= 80 ? 15 : 0);

        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center px-4"
            >
                <div className="max-w-2xl w-full bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700/50 p-10 text-center shadow-lg">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring' }}
                        className="flex justify-center mb-8"
                    >
                        <div className="flex items-center justify-center w-28 h-28 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full shadow-lg">
                            <Trophy className="w-14 h-14 text-white" />
                        </div>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-4xl font-semibold text-slate-900 dark:text-slate-100 mb-3"
                    >
                        Unit Practice Complete!
                    </motion.h1>
                    <p className="text-slate-600 dark:text-slate-400 mb-8">
                        {unitTitle}
                    </p>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="grid grid-cols-2 gap-5 mb-10"
                    >
                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl p-6 border border-amber-200/50 dark:border-amber-700/50">
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Accuracy</p>
                            <p className="text-4xl font-semibold text-amber-600 dark:text-amber-400">{accuracy}%</p>
                        </div>
                        <div className="bg-gradient-to-br from-orange-50 to-rose-50 dark:from-orange-900/20 dark:to-rose-900/20 rounded-2xl p-6 border border-orange-200/50 dark:border-orange-700/50">
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">XP Earned</p>
                            <p className="text-4xl font-semibold text-orange-600 dark:text-orange-400">+{xpEarned}</p>
                        </div>
                    </motion.div>

                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        onClick={handleComplete}
                        disabled={isSubmitting}
                        className="w-full px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl font-medium text-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50"
                    >
                        {isSubmitting ? 'Saving...' : 'Continue'}
                    </motion.button>
                </div>
            </motion.div>
        );
    }

    if (!currentQuestion) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
            {/* Header */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200/80 dark:border-slate-800">
                <div className="max-w-4xl mx-auto px-4 py-5">
                    <div className="flex items-center justify-between mb-4">
                        <button
                            onClick={handleExit}
                            className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                        >
                            <X className="w-6 h-6 text-slate-500" />
                        </button>
                        <div className="flex items-center gap-2">
                            <Target className="w-5 h-5 text-amber-500" />
                            <h2 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                                Unit Practice
                            </h2>
                        </div>
                        <span className="text-sm text-slate-500">
                            {currentIndex + 1}/{shuffledQuestions.length}
                        </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="bg-slate-100 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                        <motion.div
                            className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                </div>
            </div>

            {/* Question */}
            <div className="max-w-2xl mx-auto px-4 py-14">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                    >
                        {/* Question Card */}
                        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700/50 p-10 mb-8 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${currentQuestion.type === 'vocab'
                                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                                        : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                                    }`}>
                                    {currentQuestion.type === 'vocab' ? 'Vocabulary' : 'Grammar'}
                                </span>
                            </div>

                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                                {currentQuestion.question}
                            </p>

                            {currentQuestion.prompt && (
                                <p className="text-4xl font-medium text-slate-900 dark:text-slate-100 mb-6 text-center">
                                    {currentQuestion.prompt}
                                </p>
                            )}

                            {currentQuestion.sentence && (
                                <div className="text-center mb-6">
                                    <p className="text-3xl font-medium text-slate-900 dark:text-slate-100">
                                        {currentQuestion.sentence}
                                    </p>
                                    {currentQuestion.sentenceReading && (
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                                            {currentQuestion.sentenceReading}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Options */}
                            <div className="grid grid-cols-2 gap-4 mt-6">
                                {currentQuestion.options.map((option, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleOptionSelect(idx)}
                                        disabled={showFeedback}
                                        className={`px-6 py-4 rounded-2xl text-lg font-medium transition-all duration-200 ${selectedOption === idx
                                                ? showFeedback
                                                    ? idx === currentQuestion.correctAnswer
                                                        ? 'bg-emerald-500 text-white'
                                                        : 'bg-rose-500 text-white'
                                                    : 'bg-amber-500 text-white ring-4 ring-amber-200 dark:ring-amber-800'
                                                : showFeedback && idx === currentQuestion.correctAnswer
                                                    ? 'bg-emerald-500 text-white'
                                                    : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-amber-100 dark:hover:bg-amber-900/30'
                                            } disabled:cursor-not-allowed`}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Submit / Next Button */}
                        {!showFeedback ? (
                            <button
                                onClick={handleSubmit}
                                disabled={selectedOption === null}
                                className="w-full px-8 py-5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xl font-medium rounded-2xl hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Check Answer
                            </button>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`rounded-2xl p-6 border mb-4 ${isCorrect
                                        ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700/50'
                                        : 'bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-700/50'
                                    }`}
                            >
                                <div className="flex items-center justify-center gap-3 mb-3">
                                    {isCorrect ? (
                                        <>
                                            <CheckCircle className="w-8 h-8 text-emerald-500" />
                                            <span className="text-2xl font-semibold text-emerald-700 dark:text-emerald-300">
                                                Correct!
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <XCircle className="w-8 h-8 text-rose-500" />
                                            <span className="text-2xl font-semibold text-rose-700 dark:text-rose-300">
                                                Not quite
                                            </span>
                                        </>
                                    )}
                                </div>
                                {!isCorrect && (
                                    <p className="text-center text-slate-600 dark:text-slate-400">
                                        Correct answer: <strong>{currentQuestion.options[currentQuestion.correctAnswer]}</strong>
                                    </p>
                                )}
                                <button
                                    onClick={handleNext}
                                    className="w-full mt-4 px-8 py-4 bg-gradient-to-r from-slate-600 to-slate-700 dark:from-slate-500 dark:to-slate-600 text-white text-lg font-medium rounded-xl hover:from-slate-700 hover:to-slate-800 transition-all"
                                >
                                    Continue
                                    <ArrowRight className="w-5 h-5 inline ml-2" />
                                </button>
                            </motion.div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
