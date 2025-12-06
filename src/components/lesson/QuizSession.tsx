'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, CheckCircle2, XCircle, Trophy, Lightbulb } from 'lucide-react';
import { useRouter } from 'next/navigation';
import * as wanakana from 'wanakana';
import { completeLesson } from '../../app/(dashboard)/learn/[courseId]/unit/[unitId]/lesson/[lessonId]/actions';

interface QuizSessionProps {
    lesson: {
        id: number;
        title: string;
        type: string;
        content: {
            instructions?: string;
            characters?: string[];
            romaji?: string[];
            sentences?: Array<{ q: string; a: string; hint?: string }>;
        };
    };
    courseId: string;
    unitId: number;
}

interface QuizItem {
    id: number;
    question: string;
    answer: string;
    type: 'vocabulary' | 'kanji' | 'grammar';
    hint?: string;
}

interface QuizResult {
    itemType: 'vocabulary' | 'kanji';
    itemId: number;
    correct: boolean;
}

export default function QuizSession({ lesson, courseId, unitId }: QuizSessionProps) {
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);

    const [quizItems, setQuizItems] = useState<QuizItem[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [showFeedback, setShowFeedback] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [results, setResults] = useState<QuizResult[]>([]);
    const [incorrectQueue, setIncorrectQueue] = useState<QuizItem[]>([]);
    const [isComplete, setIsComplete] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [failureCount, setFailureCount] = useState<Map<number, number>>(new Map());
    const [showHint, setShowHint] = useState(false);

    // Initialize quiz items from lesson content
    useEffect(() => {
        if (lesson.type === 'vocab_drill' && lesson.content.characters && lesson.content.romaji) {
            const items: QuizItem[] = lesson.content.characters.map((char, idx) => ({
                id: idx + 1,
                question: char,
                answer: lesson.content.romaji![idx],
                type: 'vocabulary' as const,
            }));
            setQuizItems(items);
        } else if (lesson.type === 'grammar' && lesson.content.sentences) {
            const items: QuizItem[] = lesson.content.sentences.map((sentence, idx) => ({
                id: idx + 1,
                question: sentence.q,
                answer: sentence.a,
                type: 'grammar' as const,
                hint: sentence.hint,
            }));
            setQuizItems(items);
        }
    }, [lesson]);

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

    const currentItem = quizItems[currentIndex];
    const progress = ((currentIndex + 1) / quizItems.length) * 100;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!currentItem || showFeedback) return;

        // Convert user answer to hiragana for comparison
        const normalizedAnswer = wanakana.toHiragana(userAnswer.trim().toLowerCase());
        const normalizedCorrect = wanakana.toHiragana(currentItem.answer.trim().toLowerCase());
        const correct = normalizedAnswer === normalizedCorrect;

        setIsCorrect(correct);
        setShowFeedback(true);

        // Track failure count for hint system
        if (!correct) {
            const currentFailures = failureCount.get(currentItem.id) || 0;
            const newFailures = currentFailures + 1;
            setFailureCount(new Map(failureCount.set(currentItem.id, newFailures)));

            // Show hint after 3 failures on grammar questions
            if (newFailures >= 3 && currentItem.type === 'grammar' && currentItem.hint) {
                setShowHint(true);
            }
        }

        // Track result
        const result: QuizResult = {
            itemType: currentItem.type === 'grammar' ? 'vocabulary' : currentItem.type,
            itemId: currentItem.id,
            correct,
        };
        setResults(prev => [...prev, result]);

        // If incorrect, queue for retry at the end
        if (!correct) {
            setIncorrectQueue(prev => [...prev, currentItem]);
        }
    };

    const handleNext = () => {
        setShowFeedback(false);
        setShowHint(false);
        setUserAnswer('');

        // Check if we're at the end of the main quiz
        if (currentIndex + 1 >= quizItems.length) {
            // If there are items in incorrect queue, add them back
            if (incorrectQueue.length > 0) {
                setQuizItems(prev => [...prev, ...incorrectQueue]);
                setIncorrectQueue([]);
                setCurrentIndex(currentIndex + 1);
            } else {
                // Quiz complete!
                setIsComplete(true);
            }
        } else {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handleComplete = async () => {
        setIsSubmitting(true);

        const correctCount = results.filter(r => r.correct).length;
        const accuracy = Math.round((correctCount / results.length) * 100);

        const result = await completeLesson({
            lessonId: lesson.id,
            results,
            accuracy,
        });

        if ('success' in result && result.success) {
            setTimeout(() => {
                router.push(`/learn/${courseId}`);
            }, 2000);
        }
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
        const xpEarned = results.length * 2 + (accuracy === 100 ? 10 : 0);

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
                        className="text-4xl font-semibold text-slate-900 dark:text-slate-100 mb-5"
                    >
                        Lesson Complete!
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="grid grid-cols-2 gap-5 mb-10"
                    >
                        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl p-6 border border-emerald-200/50 dark:border-emerald-700/50">
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Accuracy</p>
                            <p className="text-4xl font-semibold text-emerald-600 dark:text-emerald-400">{accuracy}%</p>
                        </div>
                        <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-2xl p-6 border border-teal-200/50 dark:border-teal-700/50">
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">XP Earned</p>
                            <p className="text-4xl font-semibold text-teal-600 dark:text-teal-400">+{xpEarned}</p>
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
                        {isSubmitting ? 'Saving...' : 'Continue'}
                    </motion.button>
                </div>
            </motion.div>
        );
    }

    if (!currentItem) {
        return <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-900 dark:text-slate-100">Loading...</div>;
    }

    // Render grammar question with sentence completion
    const renderGrammarQuestion = () => {
        const parts = currentItem.question.split('_');

        return (
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700/50 p-14 mb-8 text-center shadow-sm">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">Fill in the blank</p>
                <div className="text-4xl font-medium text-slate-900 dark:text-slate-100 mb-8 flex items-center justify-center gap-4 flex-wrap leading-relaxed">
                    <span>{parts[0]}</span>
                    <div className="inline-flex items-center justify-center px-8 py-4 bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-300 dark:border-emerald-600 border-dashed rounded-xl min-w-[140px]">
                        <span className="text-emerald-600 dark:text-emerald-400">?</span>
                    </div>
                    {parts[1] && <span>{parts[1]}</span>}
                </div>
            </div>
        );
    };

    // Render vocabulary question as flashcard
    const renderVocabQuestion = () => {
        return (
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700/50 p-14 mb-8 text-center shadow-sm">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">What is the reading?</p>
                <div className="text-9xl font-semibold text-slate-900 dark:text-slate-100 mb-8">
                    {currentItem.question}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
            {/* Header */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200/80 dark:border-slate-800">
                <div className="max-w-4xl mx-auto px-4 py-5">
                    <div className="flex items-center justify-between mb-4">
                        <button
                            onClick={handleExit}
                            className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                            aria-label="Exit lesson"
                        >
                            <X className="w-6 h-6 text-slate-500 dark:text-slate-400" />
                        </button>
                        <h2 className="text-lg font-medium text-slate-900 dark:text-slate-100">{lesson.title}</h2>
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

            {/* Quiz Content */}
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
                        {currentItem.type === 'grammar' ? renderGrammarQuestion() : renderVocabQuestion()}

                        {/* Hint Modal */}
                        <AnimatePresence>
                            {showHint && currentItem.hint && (
                                <motion.div
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 rounded-2xl p-6 mb-8"
                                >
                                    <div className="flex items-start gap-3">
                                        <Lightbulb className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-1" />
                                        <div>
                                            <p className="font-medium text-amber-900 dark:text-amber-200 mb-2">Grammar Tip</p>
                                            <p className="text-sm text-amber-800 dark:text-amber-300 leading-relaxed">{currentItem.hint}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Answer Form */}
                        {!showFeedback ? (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={userAnswer}
                                    onChange={(e) => setUserAnswer(e.target.value)}
                                    placeholder={currentItem.type === 'grammar' ? "Type the particle (e.g., 'wa', 'wo')" : "Type in romaji (e.g., 'a', 'ka')"}
                                    autoFocus
                                    className="w-full px-8 py-5 text-3xl text-center border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                />
                                <button
                                    type="submit"
                                    disabled={!userAnswer.trim()}
                                    className="w-full px-8 py-5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xl font-medium rounded-2xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                                >
                                    Check Answer
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
                                    <p className="text-lg text-slate-700 dark:text-slate-300 mb-6 text-center">
                                        The correct answer is: <span className="font-semibold">{currentItem.answer}</span>
                                    </p>
                                )}

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
