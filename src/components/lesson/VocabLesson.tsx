'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle2, XCircle, RotateCcw, BookOpen, Target, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { completeLesson } from '../../app/(dashboard)/learn/[courseId]/unit/[unitId]/lesson/[lessonId]/actions';

interface VocabItem {
    japanese: string;
    reading: string;
    english: string;
}

interface VocabLessonProps {
    lesson: {
        id: number;
        title: string;
        content: {
            vocabulary: VocabItem[];
            instructions?: string;
        };
    };
    courseId: string;
    unitId: number;
}

type Phase = 'learn' | 'practice' | 'complete';

interface QuizQuestion {
    vocabItem: VocabItem;
    options: string[];
    correctIndex: number;
}

/**
 * VocabLesson - Two-phase vocabulary learning component
 * 
 * Phase 1 (Learn): Flashcard-style presentation of vocabulary
 * Phase 2 (Practice): Multiple choice quiz on meanings
 */
export default function VocabLesson({ lesson, courseId, unitId }: VocabLessonProps) {
    const router = useRouter();
    const vocabulary = lesson.content.vocabulary || [];

    // Phase state
    const [phase, setPhase] = useState<Phase>('learn');

    // Learn phase state
    const [currentLearnIndex, setCurrentLearnIndex] = useState(0);
    const [showReading, setShowReading] = useState(true);

    // Practice phase state
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [correctCount, setCorrectCount] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Generate practice questions when entering practice phase
    useEffect(() => {
        if (phase === 'practice' && questions.length === 0) {
            const shuffledVocab = [...vocabulary].sort(() => Math.random() - 0.5);
            const generatedQuestions: QuizQuestion[] = shuffledVocab.map(item => {
                // Get 3 wrong answers from other vocab items
                const otherItems = vocabulary.filter(v => v.japanese !== item.japanese);
                const wrongAnswers = otherItems
                    .sort(() => Math.random() - 0.5)
                    .slice(0, 3)
                    .map(v => v.english);

                // Create options array with correct answer
                const allOptions = [item.english, ...wrongAnswers];
                const shuffledOptions = allOptions.sort(() => Math.random() - 0.5);
                const correctIndex = shuffledOptions.indexOf(item.english);

                return {
                    vocabItem: item,
                    options: shuffledOptions,
                    correctIndex
                };
            });
            setQuestions(generatedQuestions);
        }
    }, [phase, vocabulary, questions.length]);

    const handleLearnNext = () => {
        if (currentLearnIndex < vocabulary.length - 1) {
            setCurrentLearnIndex(prev => prev + 1);
        } else {
            // Move to practice phase
            setPhase('practice');
        }
    };

    const handleLearnPrev = () => {
        if (currentLearnIndex > 0) {
            setCurrentLearnIndex(prev => prev - 1);
        }
    };

    const handleSelectAnswer = (index: number) => {
        if (showFeedback) return;
        setSelectedAnswer(index);
    };

    const handleSubmitAnswer = () => {
        if (selectedAnswer === null) return;

        const isCorrect = selectedAnswer === questions[currentQuestionIndex].correctIndex;
        if (isCorrect) {
            setCorrectCount(prev => prev + 1);
        }
        setShowFeedback(true);
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedAnswer(null);
            setShowFeedback(false);
        } else {
            // Complete the lesson
            setPhase('complete');
        }
    };

    const handleComplete = async () => {
        setIsSubmitting(true);
        try {
            const accuracy = Math.round((correctCount / questions.length) * 100);
            await completeLesson({
                lessonId: lesson.id,
                accuracy,
                results: [] // Vocab lessons don't track individual item progress
            });
            router.push(`/learn/${courseId}`);
        } catch (error) {
            console.error('Failed to complete lesson:', error);
        }
        setIsSubmitting(false);
    };

    const handleExit = () => {
        router.push(`/learn/${courseId}`);
    };

    // ============ LEARN PHASE ============
    if (phase === 'learn') {
        const currentVocab = vocabulary[currentLearnIndex];
        const progress = ((currentLearnIndex + 1) / vocabulary.length) * 100;

        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
                {/* Header */}
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200/80 dark:border-slate-800">
                    <div className="max-w-4xl mx-auto px-4 py-5">
                        <div className="flex items-center justify-between mb-4">
                            <button
                                onClick={handleExit}
                                className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                            >
                                <ChevronLeft className="w-6 h-6 text-slate-500 dark:text-slate-400" />
                            </button>
                            <div className="flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-blue-500" />
                                <h2 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                                    Learn: {lesson.title}
                                </h2>
                            </div>
                            <div className="text-sm text-slate-500">
                                {currentLearnIndex + 1} / {vocabulary.length}
                            </div>
                        </div>
                        {/* Progress Bar */}
                        <div className="bg-slate-100 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                            <motion.div
                                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.3 }}
                            />
                        </div>
                    </div>
                </div>

                {/* Vocab Card */}
                <div className="max-w-xl mx-auto px-4 py-14">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentLearnIndex}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700/50 p-12 shadow-lg text-center"
                        >
                            {/* Japanese with furigana */}
                            <div className="mb-6">
                                <ruby className="text-7xl font-bold text-slate-900 dark:text-slate-100">
                                    {currentVocab.japanese}
                                    {showReading && (
                                        <>
                                            <rp>(</rp>
                                            <rt className="text-2xl text-blue-500 dark:text-blue-400 font-normal">
                                                {currentVocab.reading}
                                            </rt>
                                            <rp>)</rp>
                                        </>
                                    )}
                                </ruby>
                            </div>

                            {/* English meaning */}
                            <p className="text-2xl text-slate-600 dark:text-slate-400 mb-8">
                                {currentVocab.english}
                            </p>

                            {/* Toggle reading button */}
                            <button
                                onClick={() => setShowReading(!showReading)}
                                className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 underline mb-8"
                            >
                                {showReading ? 'Hide reading' : 'Show reading'}
                            </button>
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation */}
                    <div className="flex gap-4 mt-8">
                        <button
                            onClick={handleLearnPrev}
                            disabled={currentLearnIndex === 0}
                            className="flex-1 py-4 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                        >
                            Previous
                        </button>
                        <button
                            onClick={handleLearnNext}
                            className="flex-1 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-medium hover:from-blue-600 hover:to-indigo-600 transition-all shadow-md"
                        >
                            {currentLearnIndex === vocabulary.length - 1 ? 'Start Practice' : 'Next'}
                            <ArrowRight className="inline-block w-5 h-5 ml-2" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ============ PRACTICE PHASE ============
    if (phase === 'practice' && questions.length > 0) {
        const currentQuestion = questions[currentQuestionIndex];
        const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
        const isCorrect = selectedAnswer === currentQuestion.correctIndex;

        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
                {/* Header */}
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200/80 dark:border-slate-800">
                    <div className="max-w-4xl mx-auto px-4 py-5">
                        <div className="flex items-center justify-between mb-4">
                            <button
                                onClick={handleExit}
                                className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                            >
                                <ChevronLeft className="w-6 h-6 text-slate-500 dark:text-slate-400" />
                            </button>
                            <div className="flex items-center gap-2">
                                <Target className="w-5 h-5 text-emerald-500" />
                                <h2 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                                    Practice: {lesson.title}
                                </h2>
                            </div>
                            <div className="text-sm text-slate-500">
                                {currentQuestionIndex + 1} / {questions.length}
                            </div>
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

                {/* Question */}
                <div className="max-w-xl mx-auto px-4 py-14">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentQuestionIndex}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                        >
                            {/* Question Card */}
                            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700/50 p-10 mb-6 text-center shadow-sm">
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                                    What does this mean?
                                </p>
                                <ruby className="text-6xl font-bold text-slate-900 dark:text-slate-100">
                                    {currentQuestion.vocabItem.japanese}
                                    <rp>(</rp>
                                    <rt className="text-xl text-emerald-500 dark:text-emerald-400 font-normal">
                                        {currentQuestion.vocabItem.reading}
                                    </rt>
                                    <rp>)</rp>
                                </ruby>
                            </div>

                            {/* Answer Options */}
                            <div className="space-y-3 mb-6">
                                {currentQuestion.options.map((option, idx) => {
                                    let optionStyle = 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-emerald-400 dark:hover:border-emerald-500';

                                    if (showFeedback) {
                                        if (idx === currentQuestion.correctIndex) {
                                            optionStyle = 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 dark:border-emerald-400';
                                        } else if (idx === selectedAnswer && !isCorrect) {
                                            optionStyle = 'bg-rose-50 dark:bg-rose-900/20 border-rose-500 dark:border-rose-400';
                                        }
                                    } else if (selectedAnswer === idx) {
                                        optionStyle = 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 dark:border-emerald-400';
                                    }

                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => handleSelectAnswer(idx)}
                                            disabled={showFeedback}
                                            className={`w-full p-5 text-left text-lg rounded-2xl border-2 transition-all ${optionStyle}`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-900 dark:text-slate-100">{option}</span>
                                                {showFeedback && idx === currentQuestion.correctIndex && (
                                                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                                                )}
                                                {showFeedback && idx === selectedAnswer && !isCorrect && (
                                                    <XCircle className="w-6 h-6 text-rose-500" />
                                                )}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Submit / Next Button */}
                            {!showFeedback ? (
                                <button
                                    onClick={handleSubmitAnswer}
                                    disabled={selectedAnswer === null}
                                    className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-lg font-medium rounded-2xl hover:from-emerald-600 hover:to-teal-600 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Check Answer
                                </button>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <div className={`rounded-2xl p-4 mb-4 text-center ${isCorrect
                                        ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300'
                                        : 'bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300'
                                        }`}>
                                        {isCorrect ? '✓ Correct!' : `✗ The answer is: ${currentQuestion.vocabItem.english}`}
                                    </div>
                                    <button
                                        onClick={handleNextQuestion}
                                        className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-lg font-medium rounded-2xl hover:from-emerald-600 hover:to-teal-600 transition-all shadow-md"
                                    >
                                        {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}
                                        <ArrowRight className="inline-block w-5 h-5 ml-2" />
                                    </button>
                                </motion.div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        );
    }

    // ============ COMPLETE PHASE ============
    if (phase === 'complete') {
        const accuracy = Math.round((correctCount / questions.length) * 100);
        const xpEarned = 10 + Math.floor(accuracy / 10);

        return (
            <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full mx-4"
                >
                    <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700/50 p-10 text-center shadow-lg">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                            <CheckCircle2 className="w-10 h-10 text-white" />
                        </div>

                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                            Lesson Complete!
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 mb-6">
                            {lesson.title}
                        </p>

                        <div className="flex justify-center gap-8 mb-8">
                            <div className="text-center">
                                <p className="text-4xl font-bold text-emerald-600">{accuracy}%</p>
                                <p className="text-sm text-slate-500">Accuracy</p>
                            </div>
                            <div className="text-center">
                                <p className="text-4xl font-bold text-amber-600">+{xpEarned}</p>
                                <p className="text-sm text-slate-500">XP</p>
                            </div>
                        </div>

                        <div className="text-sm text-slate-500 mb-6">
                            {correctCount} / {questions.length} correct
                        </div>

                        <button
                            onClick={handleComplete}
                            disabled={isSubmitting}
                            className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-lg font-medium rounded-2xl hover:from-amber-600 hover:to-orange-600 transition-all shadow-md disabled:opacity-50"
                        >
                            {isSubmitting ? 'Saving...' : 'Continue'}
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    // Loading state
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );
}
