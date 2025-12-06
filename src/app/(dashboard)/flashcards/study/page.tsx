'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import FlashcardViewer from '../../../../components/flashcard/FlashcardViewer';
import { motion } from 'framer-motion';
import { Layers, Check, RotateCcw, Home, TrendingUp, Clock } from 'lucide-react';
import Link from 'next/link';

type StudyMode = 'recognition' | 'production' | 'cram' | 'test';

export default function FlashcardStudyPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [mode, setMode] = useState<StudyMode>('recognition');
    const [sessionStarted, setSessionStarted] = useState(false);
    const [results, setResults] = useState<{ correct: number; incorrect: number } | null>(null);

    const type = searchParams.get('type') || 'kanji';
    const level = searchParams.get('level') || 'N5';

    useEffect(() => {
        async function loadItems() {
            try {
                const res = await fetch(`/api/flashcards?type=${type}&level=${level}`);
                const data = await res.json();
                setItems(data.items || []);
            } catch (e) {
                console.error('Failed to load items');
            }
            setLoading(false);
        }
        loadItems();
    }, [type, level]);

    const handleComplete = (res: { correct: number; incorrect: number }) => {
        setResults(res);
    };

    const handleRestart = () => {
        setResults(null);
        setSessionStarted(false);
    };

    // Loading state
    if (loading) {
        return (
            <div className="max-w-xl mx-auto flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-slate-500 dark:text-slate-400">Loading cards...</p>
                </div>
            </div>
        );
    }

    // Results screen
    if (results) {
        const accuracy = results.correct + results.incorrect > 0
            ? Math.round((results.correct / (results.correct + results.incorrect)) * 100)
            : 0;

        return (
            <div className="max-w-xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700/50 p-8 text-center"
                >
                    <div className="flex justify-center mb-6">
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center ${accuracy >= 80 ? 'bg-emerald-100 dark:bg-emerald-900/30' :
                            accuracy >= 60 ? 'bg-amber-100 dark:bg-amber-900/30' :
                                'bg-rose-100 dark:bg-rose-900/30'
                            }`}>
                            {accuracy >= 80 ? (
                                <Check className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                            ) : (
                                <TrendingUp className="w-10 h-10 text-amber-600 dark:text-amber-400" />
                            )}
                        </div>
                    </div>

                    <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                        Session Complete!
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-8">
                        {accuracy >= 80 ? 'Great job!' : accuracy >= 60 ? 'Good progress!' : 'Keep practicing!'}
                    </p>

                    <div className="text-5xl font-bold mb-8">
                        <span className={accuracy >= 60 ? 'text-emerald-600' : 'text-rose-600'}>{accuracy}%</span>
                    </div>

                    <div className="flex justify-center gap-8 mb-8 text-sm">
                        <div className="text-center">
                            <p className="text-2xl font-semibold text-emerald-600">{results.correct}</p>
                            <p className="text-slate-500">Correct</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-semibold text-rose-600">{results.incorrect}</p>
                            <p className="text-slate-500">Incorrect</p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <Link
                            href="/flashcards"
                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                        >
                            <Home className="w-4 h-4" />
                            Back
                        </Link>
                        <button
                            onClick={handleRestart}
                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-teal-600 transition-all"
                        >
                            <RotateCcw className="w-4 h-4" />
                            Again
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    // Mode selection
    if (!sessionStarted) {
        return (
            <div className="max-w-xl mx-auto">
                <div className="mb-8">
                    <Link href="/flashcards" className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline">
                        ← Back to Flashcards
                    </Link>
                    <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mt-4">
                        {level} {type === 'kanji' ? 'Kanji' : 'Vocabulary'}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">{items.length} cards</p>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-6 mb-6">
                    <h2 className="font-medium text-slate-900 dark:text-slate-100 mb-4">Study Mode</h2>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { key: 'recognition', label: 'Recognition', desc: 'See Japanese → recall meaning' },
                            { key: 'production', label: 'Production', desc: 'See English → recall Japanese' },
                            { key: 'cram', label: 'Cram', desc: 'Rapid review, no SRS' },
                            { key: 'test', label: 'Test', desc: 'Graded session' },
                        ].map((m) => (
                            <button
                                key={m.key}
                                onClick={() => setMode(m.key as StudyMode)}
                                className={`p-4 rounded-xl text-left transition-all ${mode === m.key
                                    ? 'bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-500'
                                    : 'bg-slate-50 dark:bg-slate-700/50 border-2 border-transparent hover:border-slate-300 dark:hover:border-slate-600'
                                    }`}
                            >
                                <p className="font-medium text-slate-900 dark:text-slate-100">{m.label}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{m.desc}</p>
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    onClick={() => setSessionStarted(true)}
                    disabled={items.length === 0}
                    className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-lg font-medium rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all shadow-md disabled:opacity-50"
                >
                    Start Study Session
                </button>
            </div>
        );
    }

    // Active session
    return (
        <div className="max-w-xl mx-auto py-8">
            <FlashcardViewer items={items} mode={mode} onComplete={handleComplete} />
        </div>
    );
}
