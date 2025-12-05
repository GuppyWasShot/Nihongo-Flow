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
                className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4"
            >
                <div className="max-w-2xl w-full bg-white rounded-2xl border-2 border-gray-200 p-8 text-center shadow-xl">
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
                        className="text-4xl font-bold text-gray-900 mb-4"
                    >
                        Lesson Complete!
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="grid grid-cols-2 gap-4 mb-8"
                    >
                        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-200">
                            <p className="text-sm text-gray-600 mb-1">Accuracy</p>
                            <p className="text-3xl font-bold text-indigo-600">{accuracy}%</p>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                            <p className="text-sm text-gray-600 mb-1">XP Earned</p>
                            <p className="text-3xl font-bold text-green-600">+{xpEarned}</p>
                        </div>
                    </motion.div>

                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        onClick={handleComplete}
                        disabled={isSubmitting}
                        className="w-full px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
                    >
                        {isSubmitting ? 'Saving...' : 'Continue'}
                    </motion.button>
                </div>
            </motion.div>
        );
    }

    if (!currentItem) {
        return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
    }

    // Render grammar question with sentence completion
    const renderGrammarQuestion = () => {
        const parts = currentItem.question.split('_');

        return (
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-12 mb-6 text-center shadow-lg">
                <p className="text-sm text-gray-600 mb-6">Fill in the blank</p>
                <div className="text-4xl font-bold text-gray-900 mb-8 flex items-center justify-center gap-4 flex-wrap">
                    <span>{parts[0]}</span>
                    <div className="inline-flex items-center justify-center px-6 py-3 bg-indigo-50 border-2 border-indigo-300 border-dashed rounded-xl min-w-[120px]">
                        <span className="text-indigo-600">?</span>
                    </div>
                    {parts[1] && <span>{parts[1]}</span>}
                </div>
            </div>
        );
    };

    // Render vocabulary question as flashcard
    const renderVocabQuestion = () => {
        return (
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-12 mb-6 text-center shadow-lg">
                <p className="text-sm text-gray-600 mb-4">What is the reading?</p>
                <div className="text-8xl font-bold text-gray-900 mb-8">
                    {currentItem.question}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between mb-3">
                        <button
                            onClick={handleExit}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            aria-label="Exit lesson"
                        >
                            <X className="w-6 h-6 text-gray-600" />
                        </button>
                        <h2 className="text-lg font-semibold text-gray-900">{lesson.title}</h2>
                        <div className="w-10" />
                    </div>

                    {/* Progress Bar */}
                    <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                        <motion.div
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 h-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                </div>
            </div>

            {/* Quiz Content */}
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
                        {currentItem.type === 'grammar' ? renderGrammarQuestion() : renderVocabQuestion()}

                        {/* Hint Modal */}
                        <AnimatePresence>
                            {showHint && currentItem.hint && (
                                <motion.div
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-6 mb-6"
                                >
                                    <div className="flex items-start gap-3">
                                        <Lightbulb className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                                        <div>
                                            <p className="font-semibold text-yellow-900 mb-2">Grammar Tip</p>
                                            <p className="text-sm text-yellow-800">{currentItem.hint}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Answer Form */}
                        {!showFeedback ? (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={userAnswer}
                                    onChange={(e) => setUserAnswer(e.target.value)}
                                    placeholder={currentItem.type === 'grammar' ? "Type the particle (e.g., 'wa', 'wo')" : "Type in romaji (e.g., 'a', 'ka')"}
                                    autoFocus
                                    className="w-full px-6 py-4 text-2xl text-center border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                />
                                <button
                                    type="submit"
                                    disabled={!userAnswer.trim()}
                                    className="w-full px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Check Answer
                                </button>
                            </form>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`rounded-2xl p-8 border-2 ${isCorrect
                                        ? 'bg-green-50 border-green-300'
                                        : 'bg-red-50 border-red-300'
                                    }`}
                            >
                                <div className="flex items-center justify-center gap-3 mb-4">
                                    {isCorrect ? (
                                        <>
                                            <CheckCircle2 className="w-8 h-8 text-green-600" />
                                            <p className="text-2xl font-bold text-green-900">Correct!</p>
                                        </>
                                    ) : (
                                        <>
                                            <XCircle className="w-8 h-8 text-red-600" />
                                            <p className="text-2xl font-bold text-red-900">Incorrect</p>
                                        </>
                                    )}
                                </div>

                                {!isCorrect && (
                                    <p className="text-lg text-gray-700 mb-6 text-center">
                                        The correct answer is: <span className="font-bold">{currentItem.answer}</span>
                                    </p>
                                )}

                                <button
                                    onClick={handleNext}
                                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gray-900 text-white text-lg font-semibold rounded-xl hover:bg-gray-800 transition-all duration-200 shadow-lg"
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
