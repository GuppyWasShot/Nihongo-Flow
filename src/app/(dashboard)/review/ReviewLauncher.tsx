'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Zap, BookOpen, Target, Filter, Clock, Sparkles, ChevronRight } from 'lucide-react';
import ReviewSession from './ReviewSession';
import { ReviewItem } from './actions';

interface ReviewLauncherProps {
    items: ReviewItem[];
}

type SessionMode = 'quick' | 'full' | 'custom';
type FilterType = 'all' | 'vocabulary' | 'kanji' | 'grammar';

export default function ReviewLauncher({ items }: ReviewLauncherProps) {
    const [sessionStarted, setSessionStarted] = useState(false);
    const [selectedMode, setSelectedMode] = useState<SessionMode | null>(null);
    const [filterType, setFilterType] = useState<FilterType>('all');
    const [selectedItems, setSelectedItems] = useState<ReviewItem[]>([]);

    // Filter items by type
    const filteredItems = items.filter(item => {
        if (filterType === 'all') return true;
        return item.type === filterType;
    });

    // Count by type
    const vocabCount = items.filter(i => i.type === 'vocabulary').length;
    const kanjiCount = items.filter(i => i.type === 'kanji').length;

    // Get queue color based on count
    const getQueueColor = (count: number) => {
        if (count <= 10) return 'text-emerald-500';
        if (count <= 50) return 'text-amber-500';
        return 'text-rose-500';
    };

    const getQueueBgColor = (count: number) => {
        if (count <= 10) return 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700/50';
        if (count <= 50) return 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700/50';
        return 'bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-700/50';
    };

    const handleStartSession = (mode: SessionMode) => {
        let itemsToReview: ReviewItem[];

        switch (mode) {
            case 'quick':
                itemsToReview = filteredItems.slice(0, 10);
                break;
            case 'full':
                itemsToReview = filteredItems;
                break;
            case 'custom':
                // For custom, we'd show a selection UI, but for now just use filtered
                itemsToReview = filteredItems;
                break;
            default:
                itemsToReview = filteredItems;
        }

        setSelectedMode(mode);
        setSelectedItems(itemsToReview);
        setSessionStarted(true);
    };

    if (sessionStarted && selectedItems.length > 0) {
        return <ReviewSession initialItems={selectedItems} />;
    }

    return (
        <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-4 mb-2">
                    <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl shadow-sm">
                        <RotateCcw className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">Review</h1>
                        <p className="text-slate-600 dark:text-slate-400">Strengthen your memory with spaced repetition</p>
                    </div>
                </div>
            </div>

            {/* Queue Status */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-2xl border p-6 mb-6 ${getQueueBgColor(items.length)}`}
            >
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Items Due for Review</p>
                        <p className={`text-4xl font-semibold ${getQueueColor(items.length)}`}>
                            {items.length}
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <div className="text-center">
                            <p className="text-2xl font-semibold text-purple-600 dark:text-purple-400">{kanjiCount}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Kanji</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-semibold text-emerald-600 dark:text-emerald-400">{vocabCount}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Vocab</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Filter Tabs */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-4 mb-6"
            >
                <div className="flex items-center gap-2 mb-3">
                    <Filter className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Filter by type</span>
                </div>
                <div className="flex gap-2">
                    {[
                        { key: 'all', label: 'All', count: items.length },
                        { key: 'vocabulary', label: 'Vocabulary', count: vocabCount },
                        { key: 'kanji', label: 'Kanji', count: kanjiCount },
                    ].map((filter) => (
                        <button
                            key={filter.key}
                            onClick={() => setFilterType(filter.key as FilterType)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filterType === filter.key
                                    ? 'bg-emerald-500 text-white shadow-sm'
                                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                                }`}
                        >
                            {filter.label} ({filter.count})
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* Session Modes */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid gap-4"
            >
                {/* Quick Review */}
                <button
                    onClick={() => handleStartSession('quick')}
                    disabled={filteredItems.length === 0}
                    className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-6 text-left hover:shadow-lg hover:border-emerald-300 dark:hover:border-emerald-600/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-400 rounded-xl">
                                <Zap className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">Quick Review</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Review {Math.min(10, filteredItems.length)} items • ~5 minutes
                                </p>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                    </div>
                </button>

                {/* Full Review */}
                <button
                    onClick={() => handleStartSession('full')}
                    disabled={filteredItems.length === 0}
                    className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-6 text-left hover:shadow-lg hover:border-emerald-300 dark:hover:border-emerald-600/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl">
                                <BookOpen className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">Full Review</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Review all {filteredItems.length} due items • ~{Math.ceil(filteredItems.length * 0.5)} minutes
                                </p>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                    </div>
                </button>

                {/* SRS Stage Filter - Troubled Items */}
                {items.some(i => i.srsStage <= 2) && (
                    <button
                        onClick={() => {
                            setSelectedItems(items.filter(i => i.srsStage <= 2));
                            setSessionStarted(true);
                        }}
                        className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-6 text-left hover:shadow-lg hover:border-rose-300 dark:hover:border-rose-600/50 transition-all"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-rose-400 to-pink-400 rounded-xl">
                                    <Target className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">Troubled Items</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        Focus on {items.filter(i => i.srsStage <= 2).length} items at SRS stage 0-2
                                    </p>
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-rose-500 group-hover:translate-x-1 transition-all" />
                        </div>
                    </button>
                )}
            </motion.div>

            {/* Tips */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-8 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-center"
            >
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    💡 <strong>Tip:</strong> Regular short reviews are more effective than occasional long sessions
                </p>
            </motion.div>
        </div>
    );
}
