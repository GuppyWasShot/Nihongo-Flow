'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import Link from 'next/link';
import type { Kanji, Vocabulary } from '../../../lib/db/schema';

interface LibraryTabsProps {
    kanji: (Kanji & { srsStage: number | null })[];
    vocabulary: (Vocabulary & { srsStage: number | null })[];
}

function getSRSBadge(srsStage: number | null) {
    if (srsStage === null) return null;

    if (srsStage <= 2) {
        return <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" title="Apprentice" />;
    } else if (srsStage <= 5) {
        return <div className="w-2.5 h-2.5 rounded-full bg-teal-500" title="Guru" />;
    } else {
        return <div className="w-2.5 h-2.5 rounded-full bg-amber-500" title="Master" />;
    }
}

export default function LibraryTabs({ kanji, vocabulary }: LibraryTabsProps) {
    const [activeTab, setActiveTab] = useState<'kanji' | 'vocabulary'>('kanji');
    const [searchQuery, setSearchQuery] = useState('');

    // Filter kanji by search query
    const filteredKanji = kanji.filter(k => {
        const query = searchQuery.toLowerCase();
        return (
            k.character.includes(query) ||
            k.meanings.some(m => m.toLowerCase().includes(query)) ||
            k.onyomi?.some(o => o.toLowerCase().includes(query)) ||
            k.kunyomi?.some(k => k.toLowerCase().includes(query))
        );
    });

    // Filter vocabulary by search query
    const filteredVocabulary = vocabulary.filter(v => {
        const query = searchQuery.toLowerCase();
        return (
            v.writing.toLowerCase().includes(query) ||
            v.reading.toLowerCase().includes(query) ||
            v.meaning.toLowerCase().includes(query)
        );
    });

    return (
        <div>
            {/* Tabs */}
            <div className="flex items-center gap-6 mb-8 border-b border-slate-200 dark:border-slate-700">
                <button
                    onClick={() => setActiveTab('kanji')}
                    className={`px-2 py-4 font-medium transition-all duration-200 ${activeTab === 'kanji'
                        ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-500 dark:border-emerald-400'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                        }`}
                >
                    Kanji ({kanji.length})
                </button>
                <button
                    onClick={() => setActiveTab('vocabulary')}
                    className={`px-2 py-4 font-medium transition-all duration-200 ${activeTab === 'vocabulary'
                        ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-500 dark:border-emerald-400'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                        }`}
                >
                    Vocabulary ({vocabulary.length})
                </button>
            </div>

            {/* Search Bar */}
            <div className="mb-8">
                <div className="relative">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
                    <input
                        type="text"
                        placeholder={`Search ${activeTab}...`}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-14 pr-5 py-4 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent transition-all duration-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-lg"
                    />
                </div>
            </div>

            {/* Content */}
            {activeTab === 'kanji' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {filteredKanji.map((k) => (
                        <Link
                            key={k.id}
                            href={`/library/kanji/${k.id}`}
                            className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-5 hover:border-emerald-400 dark:hover:border-emerald-500/50 hover:shadow-md transition-all duration-300 cursor-pointer group hover:translate-y-[-2px] active:scale-[0.98]"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <span className="text-4xl font-semibold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                    {k.character}
                                </span>
                                {getSRSBadge(k.srsStage)}
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">{k.jlptLevel}</p>
                                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-1">
                                    {k.meanings.join(', ')}
                                </p>
                                {k.onyomi && k.onyomi.length > 0 && (
                                    <p className="text-xs text-slate-500 dark:text-slate-500">
                                        音: {k.onyomi.join(', ')}
                                    </p>
                                )}
                                {k.kunyomi && k.kunyomi.length > 0 && (
                                    <p className="text-xs text-slate-500 dark:text-slate-500">
                                        訓: {k.kunyomi.join(', ')}
                                    </p>
                                )}
                            </div>
                        </Link>
                    ))}
                    {filteredKanji.length === 0 && (
                        <div className="col-span-full text-center py-16 text-slate-500 dark:text-slate-400">
                            <p>No kanji found matching "{searchQuery}"</p>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'vocabulary' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredVocabulary.map((v) => (
                        <Link
                            key={v.id}
                            href={`/library/vocabulary/${v.id}`}
                            className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-5 hover:border-emerald-400 dark:hover:border-emerald-500/50 hover:shadow-md transition-all duration-300 cursor-pointer group hover:translate-y-[-2px] active:scale-[0.98]"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                        {v.writing}
                                    </p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">{v.reading}</p>
                                </div>
                                {getSRSBadge(v.srsStage)}
                            </div>
                            <div className="space-y-2">
                                <p className="text-slate-600 dark:text-slate-400">{v.meaning}</p>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full">
                                        {v.jlptLevel}
                                    </span>
                                    {v.partOfSpeech && (
                                        <span className="text-xs px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-full">
                                            {v.partOfSpeech}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}
                    {filteredVocabulary.length === 0 && (
                        <div className="col-span-full text-center py-16 text-slate-500 dark:text-slate-400">
                            <p>No vocabulary found matching "{searchQuery}"</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
