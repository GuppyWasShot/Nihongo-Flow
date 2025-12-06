'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, CheckCircle2, XCircle, Trophy, RotateCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import * as wanakana from 'wanakana';
import { submitReviewResult, completeReviewSession, type ReviewItem } from './actions';
import { getIntervalDescription } from '../../../lib/srs';

interface ReviewSessionProps {
    initialItems: ReviewItem[];
}

interface ReviewResult {
    progressId: number;
    isCorrect: boolean;
    newStage: number;
}

export default function ReviewSession({ initialItems }: ReviewSessionProps) {
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);

    const [items, setItems] = useState<ReviewItem[]>(initialItems);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [showFeedback, setShowFeedback] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [newStage, setNewStage] = useState(0);
    const [results, setResults] = useState<ReviewResult[]>([]);
    const [incorrectQueue, setIncorrectQueue] = useState<ReviewItem[]>([]);
    const [isComplete, setIsComplete] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Bind wanakana to input
    useEffect(() => {
        if (inputRef.current) {
            wanakana.bind(inputRef.current);
        }
        return () => {
            if (inputRef.current) {
                wanakana.unbind(inputRef.current);
            }
        };
    }, [currentIndex]);

    const currentItem = items[currentIndex];
    const progress = items.length > 0 ? ((currentIndex + 1) / items.length) * 100 : 0;
    const totalItems = initialItems.length;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!currentItem || showFeedback || isSubmitting) return;

        setIsSubmitting(true);

        // Normalize answers for comparison
        const normalizedAnswer = wanakana.toHiragana(userAnswer.trim().toLowerCase());
        const normalizedCorrect = wanakana.toHiragana(currentItem.answer.trim().toLowerCase());

        // Check if answer matches primary or any alternatives
        const alternatives = currentItem.alternatives?.map(a => wanakana.toHiragana(a.toLowerCase())) || [];
        const correct = normalizedAnswer === normalizedCorrect || alternatives.includes(normalizedAnswer);

        // Submit to server
        const result = await submitReviewResult(currentItem.progressId, correct);

        setIsCorrect(correct);
        setNewStage(result.newStage);
        setShowFeedback(true);
        setIsSubmitting(false);

        // Track result
        setResults(prev => [...prev, {
            progressId: currentItem.progressId,
            isCorrect: correct,
            newStage: result.newStage,
        }]);

        // If incorrect, queue for retry
        if (!correct) {
            setIncorrectQueue(prev => [...prev, {
                ...currentItem,
                srsStage: result.newStage,
            }]);
        }
    };

    const handleNext = () => {
        setShowFeedback(false);
        setUserAnswer('');

        // Check if we're at the end
        if (currentIndex + 1 >= items.length) {
            if (incorrectQueue.length > 0) {
                // Add incorrect items back to queue
                setItems(prev => [...prev, ...incorrectQueue]);
                setIncorrectQueue([]);
                setCurrentIndex(currentIndex + 1);
            } else {
                // Complete!
                setIsComplete(true);
            }
        } else {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handleComplete = async () => {
        setIsSubmitting(true);

        const correctCount = results.filter(r => r.isCorrect).length;
        await completeReviewSession(correctCount, totalItems);

        setTimeout(() => {
            router.push('/learn');
            router.refresh();
        }, 1500);
    };

    const handleExit = () => {
        if (confirm('Are you sure you want to exit? Your progress has been saved.')) {
            router.push('/learn');
        }
    };

    // Completion screen
    if (isComplete) {
        const correctCount = results.filter(r => r.isCorrect).length;
        const accuracy = Math.round((correctCount / totalItems) * 100);
        const xpEarned = totalItems * 5 + (accuracy === 100 ? 10 : 0);

        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center px-4"
            >
                <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-8 text-center shadow-xl">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring' }}
                        className="flex justify-center mb-6"
                    >
                        <div className="flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full">
                            <Trophy className="w-12 h-12 text-white" />
                        </div>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2"
                    >
                        Review Complete!
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.35 }}
                        className="text-gray-600 dark:text-gray-400 mb-8"
                    >
                        Great job reinforcing your knowledge
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="grid grid-cols-3 gap-4 mb-8"
                    >
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl p-4 border-2 border-green-200 dark:border-green-700">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Correct</p>
                            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{correctCount}</p>
                        </div>
                        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-xl p-4 border-2 border-indigo-200 dark:border-indigo-700">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Accuracy</p>
                            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{accuracy}%</p>
                        </div>
                        <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/30 dark:to-red-900/30 rounded-xl p-4 border-2 border-orange-200 dark:border-orange-700">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">XP Earned</p>
                            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">+{xpEarned}</p>
                        </div>
                    </motion.div>

                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        onClick={handleComplete}
                        disabled={isSubmitting}
                        className="w-full px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 active:scale-95"
                    >
                        {isSubmitting ? 'Saving...' : 'Back to Dashboard'}
                    </motion.button>
                </div>
            </motion.div>
        );
    }

    if (!currentItem) {
        return <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-gray-900 dark:text-gray-100">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
            {/* Header */}
            <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between mb-3">
                        <button
                            onClick={handleExit}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                            aria-label="Exit review"
                        >
                            <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                        </button>
                        <div className="flex items-center gap-2">
                            <RotateCcw className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                            <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                Review ({currentIndex + 1}/{items.length})
                            </span>
                        </div>
                        <div className="w-10" />
                    </div>

                    {/* Progress Bar */}
                    <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                        <motion.div
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 h-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                </div>
            </div>

            {/* Review Content */}
            <div className="max-w-2xl mx-auto px-4 py-12">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Question Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-12 mb-6 text-center shadow-lg">
                            <div className="flex items-center justify-center gap-2 mb-4">
                                <span className={`text-xs font-medium px-3 py-1 rounded-full ${currentItem.type === 'kanji'
                                        ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                                        : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                                    }`}>
                                    {currentItem.type === 'kanji' ? 'Kanji' : 'Vocabulary'}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    Stage {currentItem.srsStage}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">What is the reading?</p>
                            <div className="text-8xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                                {currentItem.question}
                            </div>
                            <p className="text-lg text-gray-500 dark:text-gray-400">
                                {currentItem.meaning}
                            </p>
                        </div>

                        {/* Answer Form */}
                        {!showFeedback ? (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={userAnswer}
                                    onChange={(e) => setUserAnswer(e.target.value)}
                                    placeholder="Type the reading in romaji..."
                                    autoFocus
                                    disabled={isSubmitting}
                                    className="w-full px-6 py-4 text-2xl text-center border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500 disabled:opacity-50"
                                />
                                <button
                                    type="submit"
                                    disabled={!userAnswer.trim() || isSubmitting}
                                    className="w-full px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                                >
                                    {isSubmitting ? 'Checking...' : 'Check Answer'}
                                </button>
                            </form>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`rounded-2xl p-8 border-2 ${isCorrect
                                    ? 'bg-green-50 dark:bg-green-900/30 border-green-300 dark:border-green-700'
                                    : 'bg-red-50 dark:bg-red-900/30 border-red-300 dark:border-red-700'
                                    }`}
                            >
                                <div className="flex items-center justify-center gap-3 mb-4">
                                    {isCorrect ? (
                                        <>
                                            <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                                            <p className="text-2xl font-bold text-green-900 dark:text-green-200">Correct!</p>
                                        </>
                                    ) : (
                                        <>
                                            <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                                            <p className="text-2xl font-bold text-red-900 dark:text-red-200">Incorrect</p>
                                        </>
                                    )}
                                </div>

                                {!isCorrect && (
                                    <p className="text-lg text-gray-700 dark:text-gray-300 mb-4 text-center">
                                        Correct answer: <span className="font-bold">{currentItem.answer}</span>
                                        {currentItem.alternatives && currentItem.alternatives.length > 0 && (
                                            <span className="text-sm text-gray-500 dark:text-gray-400 block mt-1">
                                                Also accepted: {currentItem.alternatives.join(', ')}
                                            </span>
                                        )}
                                    </p>
                                )}

                                <div className="text-center text-sm text-gray-600 dark:text-gray-400 mb-6">
                                    <p>
                                        {isCorrect ? 'SRS Stage increased to' : 'SRS Stage decreased to'}{' '}
                                        <span className="font-semibold">{newStage}</span>
                                        {' '}→ Next review in {getIntervalDescription(newStage)}
                                    </p>
                                </div>

                                <button
                                    onClick={handleNext}
                                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-lg font-semibold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-200 shadow-lg active:scale-95"
                                >
                                    Next
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </motion.div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
