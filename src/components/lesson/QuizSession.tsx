'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, CheckCircle2, XCircle, Trophy, Lightbulb, Settings, RotateCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import * as wanakana from 'wanakana';
import { completeLesson } from '../../app/(dashboard)/learn/[courseId]/unit/[unitId]/lesson/[lessonId]/actions';
import { FuriganaToggle, useFurigana } from './FuriganaToggle';

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
            grammarPoint?: string;
            explanation?: string;
            questionType?: 'fill_blank' | 'word_bank' | 'multiple_choice';
            questions?: any[];
            kanjiIds?: number[];
            text?: string;
        };
    };
    courseId: string;
    unitId: number;
}

interface QuizItem {
    id: number;
    question: string;
    answer: string;
    type: 'vocabulary' | 'kanji' | 'grammar' | 'fill_blank' | 'word_bank' | 'multiple_choice';
    hint?: string;
    options?: string[];
    correctAnswer?: number;
    sentence?: string;
    sentenceReading?: string;
    sentenceEnglish?: string;
    // Word bank specific
    words?: string[];
    wordsReading?: string[];
    correctOrder?: number[];
    targetSentence?: string;
    targetReading?: string;
    targetEnglish?: string;
}

interface QuizResult {
    itemType: 'vocabulary' | 'kanji';
    itemId: number;
    correct: boolean;
}

/**
 * Furigana text component - renders text with optional reading
 */
function FuriganaText({ text, reading }: { text: string; reading?: string }) {
    const { showFurigana } = useFurigana();

    if (!showFurigana || !reading) {
        return <span>{text}</span>;
    }

    // Simple furigana rendering using ruby tags
    return (
        <ruby className="ruby-text">
            {text}
            <rp>(</rp>
            <rt className="text-sm text-slate-500 dark:text-slate-400">{reading}</rt>
            <rp>)</rp>
        </ruby>
    );
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
    const [showSettings, setShowSettings] = useState(false);

    // Theory lesson flag - no quiz, just read and continue
    const [isTheoryLesson, setIsTheoryLesson] = useState(false);

    // Word bank state
    const [selectedWords, setSelectedWords] = useState<number[]>([]);

    // Multiple choice state
    const [selectedOption, setSelectedOption] = useState<number | null>(null);

    // Initialize quiz items from lesson content
    useEffect(() => {
        const content = lesson.content;

        // Handle new question types
        if (lesson.type === 'grammar' && content.questionType && content.questions) {
            const items: QuizItem[] = content.questions.map((q: any, idx: number) => {
                if (content.questionType === 'fill_blank') {
                    return {
                        id: idx + 1,
                        question: q.sentence,
                        answer: q.answer,
                        type: 'fill_blank' as const,
                        hint: q.hint,
                        sentence: q.sentence,
                        sentenceReading: q.sentenceReading,
                        sentenceEnglish: q.sentenceEnglish,
                    };
                } else if (content.questionType === 'word_bank') {
                    return {
                        id: idx + 1,
                        question: q.targetSentence,
                        answer: q.targetSentence,
                        type: 'word_bank' as const,
                        words: q.words,
                        wordsReading: q.wordsReading,
                        correctOrder: q.correctOrder,
                        targetSentence: q.targetSentence,
                        targetReading: q.targetReading,
                        targetEnglish: q.targetEnglish,
                    };
                } else if (content.questionType === 'multiple_choice') {
                    return {
                        id: idx + 1,
                        question: q.sentence,
                        answer: q.options[q.correctAnswer],
                        type: 'multiple_choice' as const,
                        options: q.options,
                        correctAnswer: q.correctAnswer,
                        sentence: q.sentence,
                        sentenceReading: q.sentenceReading,
                        sentenceEnglish: q.sentenceEnglish,
                        hint: q.explanation,
                    };
                }
                return null;
            }).filter(Boolean) as QuizItem[];
            setQuizItems(items);
        }
        // Legacy vocab_drill format
        else if (lesson.type === 'vocab_drill' && content.characters && content.romaji) {
            const items: QuizItem[] = content.characters.map((char, idx) => ({
                id: idx + 1,
                question: char,
                answer: content.romaji![idx],
                type: 'vocabulary' as const,
            }));
            setQuizItems(items);
        }
        // Legacy grammar_drill format
        else if (lesson.type === 'grammar_drill' && content.sentences) {
            const items: QuizItem[] = content.sentences.map((sentence, idx) => ({
                id: idx + 1,
                question: sentence.q,
                answer: sentence.a,
                type: 'grammar' as const,
                hint: sentence.hint,
            }));
            setQuizItems(items);
        }
        // Theory lessons - mark as theory type (no quiz)
        else if (lesson.type === 'theory') {
            setIsTheoryLesson(true);
        }
        // Kanji practice - create quiz items from kanji IDs
        else if (lesson.type === 'kanji_practice' && content.kanjiIds) {
            // For now, just mark as theory until we have kanji data
            // TODO: Fetch kanji data and create quiz items
            setIsTheoryLesson(true);
        }
        // Fallback - treat as theory lesson if no recognized quiz format
        else {
            console.warn('Unknown lesson type or missing content:', lesson.type, content);
            setIsTheoryLesson(true);
        }
    }, [lesson]);

    // Bind wanakana to input for hiragana conversion
    useEffect(() => {
        if (inputRef.current && currentItem?.type !== 'multiple_choice' && currentItem?.type !== 'word_bank') {
            wanakana.bind(inputRef.current);
        }
        return () => {
            if (inputRef.current) {
                wanakana.unbind(inputRef.current);
            }
        };
    }, [currentIndex]);

    const currentItem = quizItems[currentIndex];
    const progress = quizItems.length > 0 ? ((currentIndex + 1) / quizItems.length) * 100 : 0;

    // Reset state when moving to next question
    const resetQuestionState = useCallback(() => {
        setSelectedWords([]);
        setSelectedOption(null);
        setUserAnswer('');
        setShowFeedback(false);
        setShowHint(false);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentItem || showFeedback) return;

        let correct = false;

        if (currentItem.type === 'word_bank') {
            // Check if word order matches
            const userOrder = selectedWords;
            const correctOrder = currentItem.correctOrder || [];
            correct = JSON.stringify(userOrder) === JSON.stringify(correctOrder);
        } else if (currentItem.type === 'multiple_choice') {
            correct = selectedOption === currentItem.correctAnswer;
        } else {
            // Fill-blank or legacy types
            const normalizedAnswer = wanakana.toHiragana(userAnswer.trim().toLowerCase());
            const normalizedCorrect = wanakana.toHiragana(currentItem.answer.trim().toLowerCase());
            correct = normalizedAnswer === normalizedCorrect;
        }

        setIsCorrect(correct);
        setShowFeedback(true);

        // Track failure count for hint system
        if (!correct) {
            const currentFailures = failureCount.get(currentItem.id) || 0;
            const newFailures = currentFailures + 1;
            setFailureCount(new Map(failureCount.set(currentItem.id, newFailures)));

            if (newFailures >= 3 && currentItem.hint) {
                setShowHint(true);
            }
        }

        // Track result
        const result: QuizResult = {
            itemType: currentItem.type === 'grammar' || currentItem.type === 'fill_blank' ||
                currentItem.type === 'word_bank' || currentItem.type === 'multiple_choice'
                ? 'vocabulary' : currentItem.type as 'vocabulary' | 'kanji',
            itemId: currentItem.id,
            correct,
        };
        setResults(prev => [...prev, result]);

        // If incorrect, queue for retry
        if (!correct) {
            setIncorrectQueue(prev => [...prev, currentItem]);
        }
    };

    const handleNext = () => {
        resetQuestionState();

        if (currentIndex + 1 >= quizItems.length) {
            if (incorrectQueue.length > 0) {
                setQuizItems(prev => [...prev, ...incorrectQueue]);
                setIncorrectQueue([]);
                setCurrentIndex(currentIndex + 1);
            } else {
                setIsComplete(true);
            }
        } else {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handleComplete = async () => {
        setIsSubmitting(true);

        // Calculate accuracy - handle empty results (theory lessons)
        const correctCount = results.filter(r => r.correct).length;
        const accuracy = results.length > 0
            ? Math.round((correctCount / results.length) * 100)
            : 100; // Theory lessons get 100% since there's no quiz

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

    // Complete theory lesson (no quiz)
    const handleTheoryComplete = async () => {
        setIsSubmitting(true);

        const result = await completeLesson({
            lessonId: lesson.id,
            results: [],
            accuracy: 100,
        });

        if ('success' in result && result.success) {
            setTimeout(() => {
                router.push(`/learn/${courseId}`);
            }, 1500);
        }
    };

    const handleExit = () => {
        if (confirm('Are you sure you want to exit? Your progress will not be saved.')) {
            router.push(`/learn/${courseId}`);
        }
    };

    // Word bank handlers
    const handleWordClick = (index: number) => {
        if (showFeedback) return;
        if (selectedWords.includes(index)) {
            setSelectedWords(selectedWords.filter(i => i !== index));
        } else {
            setSelectedWords([...selectedWords, index]);
        }
    };

    const handleWordBankReset = () => {
        setSelectedWords([]);
    };

    // Multiple choice handler
    const handleOptionSelect = (index: number) => {
        if (showFeedback) return;
        setSelectedOption(index);
    };

    // ============ RENDER COMPLETION SCREEN ============
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

    // ============ RENDER THEORY LESSON (NO QUIZ) ============
    if (isTheoryLesson) {
        const content = lesson.content;
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
                {/* Header */}
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200/80 dark:border-slate-800">
                    <div className="max-w-4xl mx-auto px-4 py-5">
                        <div className="flex items-center justify-between">
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
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-2xl mx-auto px-4 py-14">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700/50 p-10 shadow-sm"
                    >
                        {content.instructions && (
                            <p className="text-slate-600 dark:text-slate-400 text-center mb-8">
                                {content.instructions}
                            </p>
                        )}

                        {content.grammarPoint && (
                            <div className="text-center mb-8">
                                <h3 className="text-2xl font-semibold text-emerald-600 dark:text-emerald-400 mb-2">
                                    {content.grammarPoint}
                                </h3>
                            </div>
                        )}

                        {content.explanation && (
                            <div className="prose dark:prose-invert max-w-none mb-8">
                                <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg">
                                    {content.explanation}
                                </p>
                            </div>
                        )}

                        {content.text && (
                            <div className="prose dark:prose-invert max-w-none mb-8">
                                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                    {content.text}
                                </p>
                            </div>
                        )}

                        {/* Continue button */}
                        <button
                            onClick={handleTheoryComplete}
                            disabled={isSubmitting}
                            className="w-full px-8 py-5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xl font-medium rounded-2xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 active:scale-[0.98]"
                        >
                            {isSubmitting ? 'Saving...' : 'Continue'}
                        </button>
                    </motion.div>
                </div>
            </div>
        );
    }

    // Show loading only when initializing quiz items (not for theory)
    if (!currentItem && !isTheoryLesson) {
        return <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-900 dark:text-slate-100">Loading...</div>;
    }

    // Guard for currentItem being null (shouldn't happen after loading)
    if (!currentItem) {
        return <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-900 dark:text-slate-100">No questions available</div>;
    }

    // ============ RENDER FILL-IN-THE-BLANK QUESTION ============
    const renderFillBlankQuestion = () => {
        const parts = currentItem.sentence?.split('{_}') || currentItem.question.split('_');

        return (
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700/50 p-10 mb-8 shadow-sm">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 text-center">Fill in the blank</p>

                {/* Sentence with blank */}
                <div className="text-3xl font-medium text-slate-900 dark:text-slate-100 mb-6 flex items-center justify-center gap-2 flex-wrap text-center leading-relaxed">
                    <FuriganaText text={parts[0]} reading={currentItem.sentenceReading?.split('{_}')[0]} />
                    <span className="inline-flex items-center justify-center px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-300 dark:border-emerald-600 border-dashed rounded-xl min-w-[80px]">
                        <span className="text-emerald-600 dark:text-emerald-400 text-2xl">?</span>
                    </span>
                    {parts[1] && <FuriganaText text={parts[1]} reading={currentItem.sentenceReading?.split('{_}')[1]} />}
                </div>

                {/* English translation */}
                {currentItem.sentenceEnglish && (
                    <p className="text-slate-500 dark:text-slate-400 text-center">{currentItem.sentenceEnglish}</p>
                )}
            </div>
        );
    };

    // ============ RENDER WORD BANK QUESTION ============
    const renderWordBankQuestion = () => {
        const words = currentItem.words || [];
        const wordsReading = currentItem.wordsReading || [];

        // Build the sentence from selected words
        const builtSentence = selectedWords.map(i => words[i]).join('');

        return (
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700/50 p-10 mb-8 shadow-sm">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 text-center">Build the sentence</p>

                {/* Target translation */}
                <p className="text-lg text-slate-600 dark:text-slate-300 text-center mb-6">
                    &ldquo;{currentItem.targetEnglish}&rdquo;
                </p>

                {/* Built sentence area */}
                <div className="min-h-[80px] bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-4 mb-6 flex items-center justify-center flex-wrap gap-2 border-2 border-dashed border-slate-200 dark:border-slate-600">
                    {selectedWords.length === 0 ? (
                        <span className="text-slate-400 dark:text-slate-500">Tap words below to build the sentence</span>
                    ) : (
                        <span className="text-2xl font-medium text-slate-900 dark:text-slate-100">{builtSentence}</span>
                    )}
                </div>

                {/* Word pills */}
                <div className="flex flex-wrap justify-center gap-3 mb-4">
                    {words.map((word, idx) => {
                        const isSelected = selectedWords.includes(idx);
                        return (
                            <button
                                key={idx}
                                onClick={() => handleWordClick(idx)}
                                disabled={showFeedback}
                                className={`
                                    px-5 py-3 rounded-xl text-lg font-medium transition-all duration-200
                                    ${isSelected
                                        ? 'bg-emerald-500 text-white scale-95 opacity-50'
                                        : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 hover:scale-105 active:scale-95'
                                    }
                                    disabled:cursor-not-allowed
                                `}
                            >
                                <FuriganaText text={word} reading={wordsReading[idx]} />
                            </button>
                        );
                    })}
                </div>

                {/* Reset button */}
                {selectedWords.length > 0 && !showFeedback && (
                    <div className="flex justify-center">
                        <button
                            onClick={handleWordBankReset}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                        >
                            <RotateCcw className="w-4 h-4" />
                            Reset
                        </button>
                    </div>
                )}
            </div>
        );
    };

    // ============ RENDER MULTIPLE CHOICE QUESTION ============
    const renderMultipleChoiceQuestion = () => {
        const parts = currentItem.sentence?.split('___') || [];
        const options = currentItem.options || [];

        return (
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700/50 p-10 mb-8 shadow-sm">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 text-center">Choose the correct particle</p>

                {/* Sentence */}
                <div className="text-3xl font-medium text-slate-900 dark:text-slate-100 mb-6 text-center">
                    <FuriganaText text={parts[0]} reading={currentItem.sentenceReading?.split('___')[0]} />
                    <span className="inline-block mx-2 px-4 py-1 bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-300 dark:border-emerald-600 rounded-lg">
                        {selectedOption !== null ? options[selectedOption] : '___'}
                    </span>
                    {parts[1] && <FuriganaText text={parts[1]} reading={currentItem.sentenceReading?.split('___')[1]} />}
                </div>

                {/* English translation */}
                {currentItem.sentenceEnglish && (
                    <p className="text-slate-500 dark:text-slate-400 text-center mb-8">{currentItem.sentenceEnglish}</p>
                )}

                {/* Options */}
                <div className="grid grid-cols-2 gap-4">
                    {options.map((option, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleOptionSelect(idx)}
                            disabled={showFeedback}
                            className={`
                                px-6 py-4 rounded-2xl text-xl font-medium transition-all duration-200
                                ${selectedOption === idx
                                    ? 'bg-emerald-500 text-white ring-4 ring-emerald-200 dark:ring-emerald-800'
                                    : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-emerald-100 dark:hover:bg-emerald-900/30'
                                }
                                ${showFeedback && idx === currentItem.correctAnswer
                                    ? 'bg-emerald-500 text-white'
                                    : ''
                                }
                                ${showFeedback && selectedOption === idx && idx !== currentItem.correctAnswer
                                    ? 'bg-rose-500 text-white'
                                    : ''
                                }
                                disabled:cursor-not-allowed
                            `}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </div>
        );
    };

    // ============ RENDER LEGACY GRAMMAR QUESTION ============
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

    // ============ RENDER VOCABULARY QUESTION ============
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

    // Determine which renderer to use
    const renderQuestion = () => {
        switch (currentItem.type) {
            case 'fill_blank':
                return renderFillBlankQuestion();
            case 'word_bank':
                return renderWordBankQuestion();
            case 'multiple_choice':
                return renderMultipleChoiceQuestion();
            case 'grammar':
                return renderGrammarQuestion();
            default:
                return renderVocabQuestion();
        }
    };

    // Check if submit should be enabled
    const canSubmit = () => {
        if (currentItem.type === 'word_bank') {
            return selectedWords.length > 0;
        }
        if (currentItem.type === 'multiple_choice') {
            return selectedOption !== null;
        }
        return userAnswer.trim().length > 0;
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

                        {/* Furigana Toggle - hide for kanji practice */}
                        {lesson.type !== 'kanji_practice' && (
                            <FuriganaToggle lessonType={lesson.type} jlptLevel="N5" />
                        )}
                        {lesson.type === 'kanji_practice' && <div className="w-10" />}
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
                        {renderQuestion()}

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
                                            <p className="font-medium text-amber-900 dark:text-amber-200 mb-2">Hint</p>
                                            <p className="text-sm text-amber-800 dark:text-amber-300 leading-relaxed">{currentItem.hint}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Answer Form / Feedback */}
                        {!showFeedback ? (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Show input for fill_blank and legacy types */}
                                {currentItem.type !== 'word_bank' && currentItem.type !== 'multiple_choice' && (
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={userAnswer}
                                        onChange={(e) => setUserAnswer(e.target.value)}
                                        placeholder={currentItem.type === 'fill_blank' ? "Type the particle" : "Type in romaji"}
                                        autoFocus
                                        className="w-full px-8 py-5 text-3xl text-center border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                    />
                                )}
                                <button
                                    type="submit"
                                    disabled={!canSubmit()}
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
                                        {currentItem.type === 'word_bank' ? (
                                            <>Correct sentence: <span className="font-semibold">{currentItem.targetSentence}</span></>
                                        ) : (
                                            <>The correct answer is: <span className="font-semibold">{currentItem.answer}</span></>
                                        )}
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
