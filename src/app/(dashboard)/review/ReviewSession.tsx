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
                className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center px-4"
            >
                <div className="max-w-2xl w-full bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700/50 p-10 text-center shadow-lg">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring' }}
                        className="flex justify-center mb-8"
                    >
                        <div className="flex items-center justify-center w-28 h-28 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full shadow-lg">
                            <Trophy className="w-14 h-14 text-white" />
                        </div>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-4xl font-semibold text-slate-900 dark:text-slate-100 mb-3"
                    >
                        Review Complete!
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.35 }}
                        className="text-slate-600 dark:text-slate-400 mb-10"
                    >
                        Great job reinforcing your knowledge
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="grid grid-cols-3 gap-4 mb-10"
                    >
                        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl p-5 border border-emerald-200/50 dark:border-emerald-700/50">
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Correct</p>
                            <p className="text-3xl font-semibold text-emerald-600 dark:text-emerald-400">{correctCount}</p>
                        </div>
                        <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-2xl p-5 border border-teal-200/50 dark:border-teal-700/50">
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Accuracy</p>
                            <p className="text-3xl font-semibold text-teal-600 dark:text-teal-400">{accuracy}%</p>
                        </div>
                        <div className="bg-gradient-to-br from-rose-50 to-orange-50 dark:from-rose-900/20 dark:to-orange-900/20 rounded-2xl p-5 border border-rose-200/50 dark:border-rose-700/50">
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">XP Earned</p>
                            <p className="text-3xl font-semibold text-rose-500 dark:text-rose-400">+{xpEarned}</p>
                        </div>
                    </motion.div>

                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        onClick={handleComplete}
                        disabled={isSubmitting}
                        className="w-full px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl font-medium text-lg hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 active:scale-[0.98]"
                    >
                        {isSubmitting ? 'Saving...' : 'Back to Dashboard'}
                    </motion.button>
                </div>
            </motion.div>
        );
    }

    if (!currentItem) {
        return <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-900 dark:text-slate-100">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
            {/* Header */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200/80 dark:border-slate-800">
                <div className="max-w-4xl mx-auto px-4 py-5">
                    <div className="flex items-center justify-between mb-4">
                        <button
                            onClick={handleExit}
                            className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                            aria-label="Exit review"
                        >
                            <X className="w-6 h-6 text-slate-500 dark:text-slate-400" />
                        </button>
                        <div className="flex items-center gap-2">
                            <RotateCcw className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                            <span className="text-lg font-medium text-slate-900 dark:text-slate-100">
                                Review ({currentIndex + 1}/{items.length})
                            </span>
                        </div>
                        <div className="w-10" />
                    </div>

                    {/* Progress Bar */}
                    <div className="bg-slate-100 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                        <motion.div
                            className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                </div>
            </div>

            {/* Review Content */}
            <div className="max-w-2xl mx-auto px-4 py-14">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Question Card */}
                        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700/50 p-14 mb-8 text-center shadow-sm">
                            <div className="flex items-center justify-center gap-2 mb-5">
                                <span className={`text-xs font-medium px-3 py-1.5 rounded-full ${currentItem.type === 'kanji'
                                        ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                                        : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                                    }`}>
                                    {currentItem.type === 'kanji' ? 'Kanji' : 'Vocabulary'}
                                </span>
                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                    Stage {currentItem.srsStage}
                                </span>
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">What is the reading?</p>
                            <div className="text-9xl font-semibold text-slate-900 dark:text-slate-100 mb-5">
                                {currentItem.question}
                            </div>
                            <p className="text-lg text-slate-500 dark:text-slate-400">
                                {currentItem.meaning}
                            </p>
                        </div>

                        {/* Answer Form */}
                        {!showFeedback ? (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={userAnswer}
                                    onChange={(e) => setUserAnswer(e.target.value)}
                                    placeholder="Type the reading in romaji..."
                                    autoFocus
                                    disabled={isSubmitting}
                                    className="w-full px-8 py-5 text-3xl text-center border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 disabled:opacity-50"
                                />
                                <button
                                    type="submit"
                                    disabled={!userAnswer.trim() || isSubmitting}
                                    className="w-full px-8 py-5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xl font-medium rounded-2xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                                >
                                    {isSubmitting ? 'Checking...' : 'Check Answer'}
                                </button>
                            </form>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`rounded-2xl p-8 border ${isCorrect
                                    ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700/50'
                                    : 'bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-700/50'
                                    }`}
                            >
                                <div className="flex items-center justify-center gap-3 mb-5">
                                    {isCorrect ? (
                                        <>
                                            <CheckCircle2 className="w-9 h-9 text-emerald-600 dark:text-emerald-400" />
                                            <p className="text-2xl font-semibold text-emerald-900 dark:text-emerald-200">Correct!</p>
                                        </>
                                    ) : (
                                        <>
                                            <XCircle className="w-9 h-9 text-rose-600 dark:text-rose-400" />
                                            <p className="text-2xl font-semibold text-rose-900 dark:text-rose-200">Incorrect</p>
                                        </>
                                    )}
                                </div>

                                {!isCorrect && (
                                    <p className="text-lg text-slate-700 dark:text-slate-300 mb-4 text-center">
                                        Correct answer: <span className="font-semibold">{currentItem.answer}</span>
                                        {currentItem.alternatives && currentItem.alternatives.length > 0 && (
                                            <span className="text-sm text-slate-500 dark:text-slate-400 block mt-1">
                                                Also accepted: {currentItem.alternatives.join(', ')}
                                            </span>
                                        )}
                                    </p>
                                )}

                                <div className="text-center text-sm text-slate-600 dark:text-slate-400 mb-6">
                                    <p>
                                        {isCorrect ? 'SRS Stage increased to' : 'SRS Stage decreased to'}{' '}
                                        <span className="font-medium">{newStage}</span>
                                        {' '}→ Next review in {getIntervalDescription(newStage)}
                                    </p>
                                </div>

                                <button
                                    onClick={handleNext}
                                    className="w-full flex items-center justify-center gap-2 px-8 py-5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-lg font-medium rounded-2xl hover:bg-slate-800 dark:hover:bg-slate-200 transition-all duration-300 shadow-md active:scale-[0.98]"
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
