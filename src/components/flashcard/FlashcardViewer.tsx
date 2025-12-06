'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Check, X, ChevronRight, Volume2 } from 'lucide-react';

interface FlashcardItem {
    id: number;
    // Kanji fields
    character?: string;
    meanings?: string[];
    onyomi?: string[];
    kunyomi?: string[];
    // Vocabulary fields
    writing?: string;
    reading?: string;
    meaning?: string;
}

interface FlashcardViewerProps {
    items: FlashcardItem[];
    mode: 'recognition' | 'production' | 'cram' | 'test';
    onComplete: (results: { correct: number; incorrect: number }) => void;
}

export default function FlashcardViewer({ items, mode, onComplete }: FlashcardViewerProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [results, setResults] = useState<{ id: number; correct: boolean }[]>([]);
    const [shuffledItems] = useState(() => [...items].sort(() => Math.random() - 0.5));

    const currentCard = shuffledItems[currentIndex];
    const progress = ((currentIndex + 1) / shuffledItems.length) * 100;
    const isKanji = !!currentCard?.character;

    const handleFlip = () => setIsFlipped(!isFlipped);

    const handleGrade = (wasCorrect: boolean) => {
        setResults([...results, { id: currentCard.id, correct: wasCorrect }]);

        if (currentIndex + 1 >= shuffledItems.length) {
            const correctCount = results.filter(r => r.correct).length + (wasCorrect ? 1 : 0);
            const incorrectCount = results.filter(r => !r.correct).length + (wasCorrect ? 0 : 1);
            onComplete({ correct: correctCount, incorrect: incorrectCount });
        } else {
            setCurrentIndex(currentIndex + 1);
            setIsFlipped(false);
        }
    };

    // Front content (question)
    const renderFront = () => {
        if (isKanji) {
            return (
                <div className="text-center">
                    <span className="text-8xl font-semibold text-slate-900 dark:text-slate-100">
                        {currentCard.character}
                    </span>
                    <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
                        {mode === 'production' ? 'Write the readings' : 'What does this kanji mean?'}
                    </p>
                </div>
            );
        } else {
            return (
                <div className="text-center">
                    <span className="text-4xl font-semibold text-slate-900 dark:text-slate-100">
                        {mode === 'production' ? currentCard.meaning : currentCard.writing}
                    </span>
                    {mode !== 'production' && currentCard.reading !== currentCard.writing && (
                        <p className="mt-2 text-xl text-slate-500 dark:text-slate-400">
                            {currentCard.reading}
                        </p>
                    )}
                    <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
                        {mode === 'production' ? 'Write in Japanese' : "What's the meaning?"}
                    </p>
                </div>
            );
        }
    };

    // Back content (answer)
    const renderBack = () => {
        if (isKanji) {
            return (
                <div className="text-center space-y-4">
                    <span className="text-6xl font-semibold text-slate-900 dark:text-slate-100">
                        {currentCard.character}
                    </span>
                    <div>
                        <p className="text-xl font-medium text-emerald-600 dark:text-emerald-400">
                            {currentCard.meanings?.join(', ')}
                        </p>
                    </div>
                    <div className="flex justify-center gap-6 text-sm">
                        {currentCard.onyomi && currentCard.onyomi.length > 0 && (
                            <div>
                                <span className="px-2 py-0.5 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 rounded text-xs">音</span>
                                <span className="ml-2 text-slate-600 dark:text-slate-400">{currentCard.onyomi.join(', ')}</span>
                            </div>
                        )}
                        {currentCard.kunyomi && currentCard.kunyomi.length > 0 && (
                            <div>
                                <span className="px-2 py-0.5 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded text-xs">訓</span>
                                <span className="ml-2 text-slate-600 dark:text-slate-400">{currentCard.kunyomi.join(', ')}</span>
                            </div>
                        )}
                    </div>
                </div>
            );
        } else {
            return (
                <div className="text-center space-y-4">
                    <span className="text-3xl font-semibold text-slate-900 dark:text-slate-100">
                        {currentCard.writing}
                    </span>
                    {currentCard.reading !== currentCard.writing && (
                        <p className="text-xl text-slate-600 dark:text-slate-400">
                            {currentCard.reading}
                        </p>
                    )}
                    <p className="text-xl font-medium text-emerald-600 dark:text-emerald-400">
                        {currentCard.meaning}
                    </p>
                </div>
            );
        }
    };

    return (
        <div className="max-w-xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-6">
                <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400 mb-2">
                    <span>{currentIndex + 1} / {shuffledItems.length}</span>
                    <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
            </div>

            {/* Flashcard */}
            <div className="perspective-1000 mb-8">
                <motion.div
                    className="relative w-full aspect-[3/2] cursor-pointer preserve-3d"
                    onClick={handleFlip}
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.5, type: 'spring', stiffness: 300, damping: 30 }}
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    {/* Front */}
                    <div
                        className="absolute inset-0 backface-hidden bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700/50 shadow-lg flex items-center justify-center p-8"
                        style={{ backfaceVisibility: 'hidden' }}
                    >
                        {renderFront()}
                    </div>

                    {/* Back */}
                    <div
                        className="absolute inset-0 backface-hidden bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-3xl border border-emerald-200 dark:border-emerald-700/50 shadow-lg flex items-center justify-center p-8"
                        style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                    >
                        {renderBack()}
                    </div>
                </motion.div>
            </div>

            {/* Actions */}
            <div className="text-center">
                {!isFlipped ? (
                    <button
                        onClick={handleFlip}
                        className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all shadow-md"
                    >
                        Show Answer
                    </button>
                ) : (
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={() => handleGrade(false)}
                            className="flex items-center gap-2 px-6 py-3 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 rounded-xl font-medium hover:bg-rose-200 dark:hover:bg-rose-900/50 transition-colors"
                        >
                            <X className="w-5 h-5" />
                            Again
                        </button>
                        <button
                            onClick={() => handleGrade(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-xl font-medium hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors"
                        >
                            <Check className="w-5 h-5" />
                            Got it
                        </button>
                    </div>
                )}
            </div>

            {/* Tap hint */}
            <p className="text-center text-sm text-slate-400 dark:text-slate-500 mt-4">
                Tap the card to flip
            </p>
        </div>
    );
}
