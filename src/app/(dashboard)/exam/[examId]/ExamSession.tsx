'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, AlertTriangle, ChevronRight, ChevronLeft, Check, X, Award, TrendingUp, BarChart3 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { submitExamResults } from '../actions';
import { MockExam } from '../../../../lib/db/schema';

interface ExamSessionProps {
    exam: MockExam;
}

interface Question {
    id: number;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation?: string;
    passage?: string;
}

type ExamState = 'intro' | 'active' | 'completed';

export default function ExamSession({ exam }: ExamSessionProps) {
    const router = useRouter();
    const [examState, setExamState] = useState<ExamState>('intro');
    const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [timeLeft, setTimeLeft] = useState(exam.totalTimeLimit * 60); // Convert to seconds
    const [startTime, setStartTime] = useState<Date | null>(null);
    const [results, setResults] = useState<{
        score: number;
        passed: boolean;
        sectionScores: { type: string; score: number; correct: number; total: number }[];
    } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // All questions flattened
    const allQuestions = exam.sections.flatMap((section, sIdx) =>
        section.questions.map((q, qIdx) => ({
            ...q,
            sectionType: section.type,
            sectionIndex: sIdx,
            globalIndex: `${sIdx}-${qIdx}`,
        }))
    );

    const currentSection = exam.sections[currentSectionIndex];
    const currentQuestion = currentSection?.questions[currentQuestionIndex];
    const totalQuestions = allQuestions.length;
    const answeredCount = Object.keys(answers).length;

    // Timer effect
    useEffect(() => {
        if (examState !== 'active') return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [examState]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getTimeColor = () => {
        const percent = timeLeft / (exam.totalTimeLimit * 60);
        if (percent > 0.5) return 'text-emerald-600 dark:text-emerald-400';
        if (percent > 0.25) return 'text-amber-600 dark:text-amber-400';
        return 'text-rose-600 dark:text-rose-400';
    };

    const handleStartExam = () => {
        setExamState('active');
        setStartTime(new Date());
    };

    const handleAnswer = (optionIndex: number) => {
        const key = `${currentSectionIndex}-${currentQuestionIndex}`;
        setAnswers((prev) => ({ ...prev, [key]: optionIndex }));
    };

    const handleNext = () => {
        if (currentQuestionIndex < currentSection.questions.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
        } else if (currentSectionIndex < exam.sections.length - 1) {
            setCurrentSectionIndex((prev) => prev + 1);
            setCurrentQuestionIndex(0);
        }
    };

    const handlePrev = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex((prev) => prev - 1);
        } else if (currentSectionIndex > 0) {
            setCurrentSectionIndex((prev) => prev - 1);
            const prevSection = exam.sections[currentSectionIndex - 1];
            setCurrentQuestionIndex(prevSection.questions.length - 1);
        }
    };

    const handleSubmit = useCallback(async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        const timeTaken = startTime ? Math.floor((new Date().getTime() - startTime.getTime()) / 1000) : 0;

        // Format answers for submission
        const formattedAnswers = allQuestions.map((q) => {
            const key = `${q.sectionIndex}-${exam.sections[q.sectionIndex].questions.indexOf(q)}`;
            const selectedAnswer = answers[key] ?? -1;
            return {
                questionId: q.id,
                selectedAnswer,
                isCorrect: selectedAnswer === q.correctAnswer,
            };
        });

        const result = await submitExamResults(exam.id, formattedAnswers, timeTaken);

        if (result.success) {
            setResults({
                score: result.score!,
                passed: result.passed!,
                sectionScores: result.sectionScores!,
            });
            setExamState('completed');
        }

        setIsSubmitting(false);
    }, [answers, allQuestions, exam, startTime, isSubmitting]);

    // Intro Screen
    if (examState === 'intro') {
        return (
            <div className="max-w-2xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-8"
                >
                    <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                        {exam.title}
                    </h1>
                    {exam.description && (
                        <p className="text-slate-600 dark:text-slate-400 mb-6">
                            {exam.description}
                        </p>
                    )}

                    <div className="space-y-4 mb-8">
                        <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                            <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                            <div>
                                <p className="font-medium text-slate-900 dark:text-slate-100">Time Limit</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{exam.totalTimeLimit} minutes</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                            <BarChart3 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            <div>
                                <p className="font-medium text-slate-900 dark:text-slate-100">Questions</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    {totalQuestions} questions in {exam.sections.length} sections
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                            <Award className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                            <div>
                                <p className="font-medium text-slate-900 dark:text-slate-100">Passing Score</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{exam.passingScore}%</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 rounded-xl p-4 mb-8">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-amber-800 dark:text-amber-200">
                                <p className="font-medium mb-1">Before you begin:</p>
                                <ul className="list-disc list-inside space-y-1 text-amber-700 dark:text-amber-300">
                                    <li>Make sure you have a stable internet connection</li>
                                    <li>Find a quiet place to focus</li>
                                    <li>The timer will start immediately</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleStartExam}
                        className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-lg font-medium rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all shadow-md hover:shadow-lg"
                    >
                        Start Exam
                    </button>
                </motion.div>
            </div>
        );
    }

    // Results Screen
    if (examState === 'completed' && results) {
        return (
            <div className="max-w-2xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-8 text-center"
                >
                    <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 ${results.passed
                            ? 'bg-gradient-to-br from-emerald-400 to-teal-400'
                            : 'bg-gradient-to-br from-rose-400 to-pink-400'
                        }`}>
                        {results.passed ? (
                            <Award className="w-10 h-10 text-white" />
                        ) : (
                            <TrendingUp className="w-10 h-10 text-white" />
                        )}
                    </div>

                    <h2 className={`text-3xl font-bold mb-2 ${results.passed ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                        }`}>
                        {results.passed ? 'Congratulations!' : 'Keep Practicing!'}
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-8">
                        {results.passed
                            ? 'You passed the exam!'
                            : `You scored ${results.score}%. The passing score is ${exam.passingScore}%.`}
                    </p>

                    <div className="text-6xl font-bold mb-8">
                        <span className={results.passed ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}>
                            {results.score}%
                        </span>
                    </div>

                    <div className="space-y-3 mb-8">
                        {results.sectionScores.map((section, idx) => (
                            <div key={idx} className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-medium text-slate-700 dark:text-slate-300 capitalize">
                                        {section.type}
                                    </span>
                                    <span className={`font-semibold ${section.score >= exam.passingScore ? 'text-emerald-600' : 'text-rose-600'
                                        }`}>
                                        {section.correct}/{section.total} ({section.score}%)
                                    </span>
                                </div>
                                <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full ${section.score >= exam.passingScore ? 'bg-emerald-500' : 'bg-rose-500'
                                            }`}
                                        style={{ width: `${section.score}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => router.push('/exam')}
                            className="flex-1 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                        >
                            Back to Exams
                        </button>
                        <button
                            onClick={() => window.location.reload()}
                            className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all"
                        >
                            Try Again
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    // Active Exam Screen
    const currentKey = `${currentSectionIndex}-${currentQuestionIndex}`;
    const selectedAnswer = answers[currentKey];
    const isLastQuestion = currentSectionIndex === exam.sections.length - 1 &&
        currentQuestionIndex === currentSection.questions.length - 1;

    return (
        <div className="max-w-3xl mx-auto">
            {/* Timer and Progress */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <div className={`flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 ${getTimeColor()}`}>
                        <Clock className="w-5 h-5" />
                        <span className="font-mono text-lg font-semibold">{formatTime(timeLeft)}</span>
                    </div>
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                        {answeredCount}/{totalQuestions} answered
                    </span>
                </div>
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300 capitalize">
                    {currentSection.type}
                </span>
            </div>

            {/* Progress Bar */}
            <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full mb-8 overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300"
                    style={{
                        width: `${((currentSectionIndex * 100 + currentQuestionIndex + 1) / totalQuestions) * 100}%`
                    }}
                />
            </div>

            {/* Question */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentKey}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-8 mb-6"
                >
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                        Question {currentQuestionIndex + 1} of {currentSection.questions.length}
                    </p>
                    <h2 className="text-xl font-medium text-slate-900 dark:text-slate-100 mb-6">
                        {currentQuestion?.question}
                    </h2>

                    <div className="space-y-3">
                        {currentQuestion?.options.map((option, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleAnswer(idx)}
                                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${selectedAnswer === idx
                                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${selectedAnswer === idx
                                            ? 'bg-emerald-500 text-white'
                                            : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                                        }`}>
                                        {String.fromCharCode(65 + idx)}
                                    </div>
                                    <span className="text-slate-700 dark:text-slate-200">{option}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between">
                <button
                    onClick={handlePrev}
                    disabled={currentSectionIndex === 0 && currentQuestionIndex === 0}
                    className="flex items-center gap-2 px-6 py-3 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronLeft className="w-5 h-5" />
                    Previous
                </button>

                {isLastQuestion ? (
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all shadow-md disabled:opacity-50"
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Exam'}
                        <Check className="w-5 h-5" />
                    </button>
                ) : (
                    <button
                        onClick={handleNext}
                        className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all shadow-md"
                    >
                        Next
                        <ChevronRight className="w-5 h-5" />
                    </button>
                )}
            </div>
        </div>
    );
}
