'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import type { Kanji, Vocabulary } from '../../../lib/db/schema';

interface LibraryTabsProps {
    kanji: (Kanji & { srsStage: number | null })[];
    vocabulary: (Vocabulary & { srsStage: number | null })[];
}

function getSRSBadge(srsStage: number | null) {
    if (srsStage === null) return null;

    if (srsStage <= 2) {
        return <div className="w-2 h-2 rounded-full bg-blue-500" title="Apprentice" />;
    } else if (srsStage <= 5) {
        return <div className="w-2 h-2 rounded-full bg-green-500" title="Guru" />;
    } else {
        return <div className="w-2 h-2 rounded-full bg-yellow-500" title="Master" />;
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
            <div className="flex items-center gap-4 mb-6 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('kanji')}
                    className={`px-6 py-3 font-semibold transition-all ${activeTab === 'kanji'
                            ? 'text-indigo-600 border-b-2 border-indigo-600'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    Kanji ({kanji.length})
                </button>
                <button
                    onClick={() => setActiveTab('vocabulary')}
                    className={`px-6 py-3 font-semibold transition-all ${activeTab === 'vocabulary'
                            ? 'text-indigo-600 border-b-2 border-indigo-600'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    Vocabulary ({vocabulary.length})
                </button>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder={`Search ${activeTab}...`}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    />
                </div>
            </div>

            {/* Content */}
            {activeTab === 'kanji' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {filteredKanji.map((k) => (
                        <div
                            key={k.id}
                            className="bg-white rounded-xl border-2 border-gray-200 p-4 hover:border-indigo-300 hover:shadow-lg transition-all duration-200 cursor-pointer group"
                        >
                            <div className="flex items-start justify-between mb-2">
                                <span className="text-4xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                    {k.character}
                                </span>
                                {getSRSBadge(k.srsStage)}
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-gray-500 font-medium">{k.jlptLevel}</p>
                                <p className="text-sm text-gray-700 line-clamp-1">
                                    {k.meanings.join(', ')}
                                </p>
                                {k.onyomi && k.onyomi.length > 0 && (
                                    <p className="text-xs text-gray-500">
                                        音: {k.onyomi.join(', ')}
                                    </p>
                                )}
                                {k.kunyomi && k.kunyomi.length > 0 && (
                                    <p className="text-xs text-gray-500">
                                        訓: {k.kunyomi.join(', ')}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                    {filteredKanji.length === 0 && (
                        <div className="col-span-full text-center py-12 text-gray-500">
                            <p>No kanji found matching "{searchQuery}"</p>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'vocabulary' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredVocabulary.map((v) => (
                        <div
                            key={v.id}
                            className="bg-white rounded-xl border-2 border-gray-200 p-4 hover:border-indigo-300 hover:shadow-lg transition-all duration-200 cursor-pointer group"
                        >
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <p className="text-2xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                        {v.writing}
                                    </p>
                                    <p className="text-sm text-gray-600">{v.reading}</p>
                                </div>
                                {getSRSBadge(v.srsStage)}
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-gray-700">{v.meaning}</p>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full">
                                        {v.jlptLevel}
                                    </span>
                                    {v.partOfSpeech && (
                                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                                            {v.partOfSpeech}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    {filteredVocabulary.length === 0 && (
                        <div className="col-span-full text-center py-12 text-gray-500">
                            <p>No vocabulary found matching "{searchQuery}"</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
