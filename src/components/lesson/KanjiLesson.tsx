'use client';

import { motion } from 'framer-motion';
import { BookOpen, ChevronRight, Pencil } from 'lucide-react';

interface KanjiData {
    character: string;
    meanings: string[];
    onyomi?: string[];
    kunyomi?: string[];
    strokeCount?: number;
    mnemonic?: string;
}

interface KanjiLessonProps {
    lesson: {
        id: number;
        title: string;
        content: {
            instructions?: string;
            kanji?: string[];
            readings?: string[];
            kanjiData?: KanjiData[];
        };
    };
    onComplete: () => void;
}

export default function KanjiLesson({ lesson, onComplete }: KanjiLessonProps) {
    const { content } = lesson;

    // If we have detailed kanji data, use that; otherwise use simple arrays
    const kanjiList = content.kanjiData || (content.kanji?.map((char, idx) => ({
        character: char,
        meanings: [],
        onyomi: [],
        kunyomi: content.readings ? [content.readings[idx]] : [],
        strokeCount: undefined,
        mnemonic: undefined,
    })) || []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400 mb-2">
                        <BookOpen className="w-4 h-4" />
                        <span>Kanji Practice</span>
                    </div>
                    <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">
                        {lesson.title}
                    </h1>
                    {content.instructions && (
                        <p className="text-slate-600 dark:text-slate-400 mt-2">
                            {content.instructions}
                        </p>
                    )}
                </motion.div>

                {/* Kanji Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    {kanjiList.map((kanji, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-6 hover:shadow-lg hover:border-purple-300 dark:hover:border-purple-600/50 transition-all cursor-pointer group"
                        >
                            {/* Character Display */}
                            <div className="text-center mb-4">
                                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl mb-3 group-hover:scale-110 transition-transform">
                                    <span className="text-6xl font-semibold text-slate-900 dark:text-slate-100">
                                        {kanji.character}
                                    </span>
                                </div>
                                {kanji.strokeCount && (
                                    <div className="flex items-center justify-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                                        <Pencil className="w-3 h-3" />
                                        <span>{kanji.strokeCount} strokes</span>
                                    </div>
                                )}
                            </div>

                            {/* Meanings */}
                            {kanji.meanings && kanji.meanings.length > 0 && (
                                <div className="text-center mb-3">
                                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                        {kanji.meanings.join(', ')}
                                    </p>
                                </div>
                            )}

                            {/* Readings */}
                            <div className="space-y-2 text-sm">
                                {kanji.onyomi && kanji.onyomi.length > 0 && (
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-0.5 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 rounded text-xs">音</span>
                                        <span className="text-slate-600 dark:text-slate-400">{kanji.onyomi.join(', ')}</span>
                                    </div>
                                )}
                                {kanji.kunyomi && kanji.kunyomi.length > 0 && (
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-0.5 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded text-xs">訓</span>
                                        <span className="text-slate-600 dark:text-slate-400">{kanji.kunyomi.join(', ')}</span>
                                    </div>
                                )}
                            </div>

                            {/* Mnemonic */}
                            {kanji.mnemonic && (
                                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
                                    <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                                        💡 {kanji.mnemonic}
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>

                {/* Continue Button */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <button
                        onClick={onComplete}
                        className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg font-medium rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-md hover:shadow-lg active:scale-[0.98]"
                    >
                        Continue
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </motion.div>
            </div>
        </div>
    );
}
