'use client';

import { useState, useMemo } from 'react';
import { Search, Filter } from 'lucide-react';
import Link from 'next/link';
import * as wanakana from 'wanakana';
import type { Kanji, Vocabulary, KanaCharacter } from '../../../lib/db/schema';

interface LibraryTabsProps {
    kanji: (Kanji & { srsStage: number | null })[];
    vocabulary: (Vocabulary & { srsStage: number | null })[];
    hiragana: KanaCharacter[];
    katakana: KanaCharacter[];
}

type SRSFilter = 'all' | 'new' | 'learning' | 'mastered';
type JLPTFilter = 'all' | 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
type POSFilter = 'all' | 'noun' | 'verb' | 'adjective' | 'adverb' | 'particle' | 'expression';

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

export default function LibraryTabs({ kanji, vocabulary, hiragana, katakana }: LibraryTabsProps) {
    const [activeTab, setActiveTab] = useState<'hiragana' | 'katakana' | 'kanji' | 'vocabulary'>('hiragana');
    const [searchQuery, setSearchQuery] = useState('');
    const [srsFilter, setSrsFilter] = useState<SRSFilter>('all');
    const [jlptFilter, setJlptFilter] = useState<JLPTFilter>('all');
    const [posFilter, setPosFilter] = useState<POSFilter>('all');
    const [showFilters, setShowFilters] = useState(false);

    // Get unique JLPT levels from data
    const jlptLevels = useMemo(() => {
        const levels = new Set<string>();
        kanji.forEach(k => levels.add(k.jlptLevel));
        vocabulary.forEach(v => levels.add(v.jlptLevel));
        return ['all', ...Array.from(levels).sort()] as JLPTFilter[];
    }, [kanji, vocabulary]);

    // Get unique parts of speech from vocabulary
    const partsOfSpeech = useMemo(() => {
        const pos = new Set<string>();
        vocabulary.forEach(v => {
            if (v.partOfSpeech) pos.add(v.partOfSpeech.toLowerCase());
        });
        return ['all', ...Array.from(pos).sort()] as POSFilter[];
    }, [vocabulary]);

    // Filter function for SRS
    const filterBySRS = <T extends { srsStage: number | null }>(items: T[]): T[] => {
        if (srsFilter === 'all') return items;
        return items.filter(item => {
            if (srsFilter === 'new') return item.srsStage === null;
            if (srsFilter === 'learning') return item.srsStage !== null && item.srsStage <= 4;
            if (srsFilter === 'mastered') return item.srsStage !== null && item.srsStage >= 5;
            return true;
        });
    };

    // Filter function for JLPT level
    const filterByJLPT = <T extends { jlptLevel: string }>(items: T[]): T[] => {
        if (jlptFilter === 'all') return items;
        return items.filter(item => item.jlptLevel === jlptFilter);
    };

    // Filter function for part of speech (vocabulary only)
    const filterByPOS = (items: (Vocabulary & { srsStage: number | null })[]): typeof items => {
        if (posFilter === 'all') return items;
        return items.filter(item => item.partOfSpeech?.toLowerCase() === posFilter);
    };

    // Filter kanji by search query and filters
    const filteredKanji = useMemo(() => {
        let result = kanji.filter(k => {
            if (!searchQuery) return true;
            const query = searchQuery.toLowerCase();
            // Convert romaji to kana for searching
            const hiraganaQuery = wanakana.isRomaji(query) ? wanakana.toHiragana(query) : query;
            const katakanaQuery = wanakana.isRomaji(query) ? wanakana.toKatakana(query) : query;

            return (
                k.character.includes(query) ||
                k.meanings.some(m => m.toLowerCase().includes(query)) ||
                k.onyomi?.some(o => o.toLowerCase().includes(query)) ||
                k.kunyomi?.some(ku => ku.toLowerCase().includes(query)) ||
                // Search with romaji converted to kana
                k.onyomi?.some(o => o.includes(hiraganaQuery) || o.includes(katakanaQuery)) ||
                k.kunyomi?.some(ku => ku.includes(hiraganaQuery))
            );
        });
        result = filterBySRS(result);
        result = filterByJLPT(result);
        return result;
    }, [kanji, searchQuery, srsFilter, jlptFilter]);

    // Filter vocabulary by search query and filters
    const filteredVocabulary = useMemo(() => {
        let result = vocabulary.filter(v => {
            if (!searchQuery) return true;
            const query = searchQuery.toLowerCase();
            // Convert romaji to kana for searching
            const hiraganaQuery = wanakana.isRomaji(query) ? wanakana.toHiragana(query) : query;
            const katakanaQuery = wanakana.isRomaji(query) ? wanakana.toKatakana(query) : query;

            return (
                v.writing.toLowerCase().includes(query) ||
                v.reading.toLowerCase().includes(query) ||
                v.meaning.toLowerCase().includes(query) ||
                // Search with romaji converted to kana
                v.writing.includes(hiraganaQuery) ||
                v.reading.includes(hiraganaQuery) ||
                v.writing.includes(katakanaQuery) ||
                v.reading.includes(katakanaQuery)
            );
        });
        result = filterBySRS(result);
        result = filterByJLPT(result);
        result = filterByPOS(result);
        return result;
    }, [vocabulary, searchQuery, srsFilter, jlptFilter, posFilter]);

    // Count active filters
    const activeFilters = [srsFilter !== 'all', jlptFilter !== 'all', posFilter !== 'all'].filter(Boolean).length;

    // Clear all filters
    const clearFilters = () => {
        setSrsFilter('all');
        setJlptFilter('all');
        setPosFilter('all');
    };

    return (
        <div>
            {/* Tabs */}
            <div className="flex items-center gap-4 mb-6 border-b border-slate-200 dark:border-slate-700 overflow-x-auto">
                <button
                    onClick={() => setActiveTab('hiragana')}
                    className={`px-2 py-4 font-medium transition-all duration-200 whitespace-nowrap ${activeTab === 'hiragana'
                        ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-500 dark:border-emerald-400'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                        }`}
                >
                    Hiragana ({hiragana.length})
                </button>
                <button
                    onClick={() => setActiveTab('katakana')}
                    className={`px-2 py-4 font-medium transition-all duration-200 whitespace-nowrap ${activeTab === 'katakana'
                        ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-500 dark:border-emerald-400'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                        }`}
                >
                    Katakana ({katakana.length})
                </button>
                <button
                    onClick={() => setActiveTab('kanji')}
                    className={`px-2 py-4 font-medium transition-all duration-200 whitespace-nowrap ${activeTab === 'kanji'
                        ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-500 dark:border-emerald-400'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                        }`}
                >
                    Kanji ({filteredKanji.length})
                </button>
                <button
                    onClick={() => setActiveTab('vocabulary')}
                    className={`px-2 py-4 font-medium transition-all duration-200 whitespace-nowrap ${activeTab === 'vocabulary'
                        ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-500 dark:border-emerald-400'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                        }`}
                >
                    Vocabulary ({filteredVocabulary.length})
                </button>
            </div>

            {/* Search & Filter Bar */}
            <div className="flex gap-3 mb-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
                    <input
                        type="text"
                        placeholder={`Search ${activeTab}...`}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-5 py-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent transition-all duration-200 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    />
                </div>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-2 px-4 py-3 border rounded-xl font-medium transition-all ${activeFilters > 0
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                        }`}
                >
                    <Filter className="w-4 h-4" />
                    Filter
                    {activeFilters > 0 && (
                        <span className="flex items-center justify-center w-5 h-5 bg-emerald-500 text-white text-xs rounded-full">
                            {activeFilters}
                        </span>
                    )}
                </button>
            </div>

            {/* Filter Panel */}
            {showFilters && (
                <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-slate-900 dark:text-slate-100">Filters</h3>
                        {activeFilters > 0 && (
                            <button
                                onClick={clearFilters}
                                className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                            >
                                Clear all
                            </button>
                        )}
                    </div>
                    <div className="space-y-4">
                        {/* JLPT Level Filter */}
                        <div>
                            <label className="text-sm text-slate-600 dark:text-slate-400 mb-2 block">JLPT Level</label>
                            <div className="flex flex-wrap gap-2">
                                {jlptLevels.map((level) => (
                                    <button
                                        key={level}
                                        onClick={() => setJlptFilter(level)}
                                        className={`px-3 py-1.5 text-sm rounded-lg transition-all ${jlptFilter === level
                                            ? 'bg-emerald-500 text-white'
                                            : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:border-emerald-300'
                                            }`}
                                    >
                                        {level === 'all' ? 'All' : level}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Part of Speech Filter (vocabulary only) */}
                        {activeTab === 'vocabulary' && (
                            <div>
                                <label className="text-sm text-slate-600 dark:text-slate-400 mb-2 block">Part of Speech</label>
                                <div className="flex flex-wrap gap-2">
                                    {partsOfSpeech.map((pos) => (
                                        <button
                                            key={pos}
                                            onClick={() => setPosFilter(pos)}
                                            className={`px-3 py-1.5 text-sm rounded-lg transition-all ${posFilter === pos
                                                ? 'bg-emerald-500 text-white'
                                                : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:border-emerald-300'
                                                }`}
                                        >
                                            {pos === 'all' ? 'All' : pos.charAt(0).toUpperCase() + pos.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* SRS Status Filter */}
                        <div>
                            <label className="text-sm text-slate-600 dark:text-slate-400 mb-2 block">SRS Status</label>
                            <div className="flex flex-wrap gap-2">
                                {(['all', 'new', 'learning', 'mastered'] as SRSFilter[]).map((filter) => (
                                    <button
                                        key={filter}
                                        onClick={() => setSrsFilter(filter)}
                                        className={`px-3 py-1.5 text-sm rounded-lg transition-all ${srsFilter === filter
                                            ? 'bg-emerald-500 text-white'
                                            : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:border-emerald-300'
                                            }`}
                                    >
                                        {filter === 'all' ? 'All' : filter.charAt(0).toUpperCase() + filter.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Hiragana Grid - Organized by sections */}
            {activeTab === 'hiragana' && (() => {
                const basic = hiragana.filter(k => ['a', 'ka', 'sa', 'ta', 'na', 'ha', 'ma', 'ya', 'ra', 'wa', 'n'].includes(k.row));
                const dakuten = hiragana.filter(k => ['ga', 'za', 'da', 'ba'].includes(k.row));
                const handakuten = hiragana.filter(k => k.row === 'pa');

                const rowOrder = ['a', 'ka', 'sa', 'ta', 'na', 'ha', 'ma', 'ya', 'ra', 'wa', 'n'];
                const sortByRow = (a: typeof hiragana[0], b: typeof hiragana[0]) => {
                    const rowDiff = rowOrder.indexOf(a.row) - rowOrder.indexOf(b.row);
                    if (rowDiff !== 0) return rowDiff;
                    return ['a', 'i', 'u', 'e', 'o', 'n'].indexOf(a.column) - ['a', 'i', 'u', 'e', 'o', 'n'].indexOf(b.column);
                };

                const dakutenRowOrder = ['ga', 'za', 'da', 'ba'];
                const sortDakuten = (a: typeof hiragana[0], b: typeof hiragana[0]) => {
                    const rowDiff = dakutenRowOrder.indexOf(a.row) - dakutenRowOrder.indexOf(b.row);
                    if (rowDiff !== 0) return rowDiff;
                    return ['a', 'i', 'u', 'e', 'o'].indexOf(a.column) - ['a', 'i', 'u', 'e', 'o'].indexOf(b.column);
                };

                return (
                    <div className="space-y-8">
                        {/* Basic Hiragana */}
                        <div>
                            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">Basic Hiragana (46 characters)</h3>
                            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                                {basic.sort(sortByRow).map((k) => (
                                    <div key={k.id} className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700/50 p-3 hover:border-emerald-400 dark:hover:border-emerald-500/50 hover:shadow-md transition-all text-center group">
                                        <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">{k.character}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">{k.romaji}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Dakuten */}
                        <div>
                            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">Dakuten 濁点 <span className="text-sm font-normal text-slate-500">(voiced sounds - tenten ゛)</span></h3>
                            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                                {dakuten.sort(sortDakuten).map((k) => (
                                    <div key={k.id} className="bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-700/50 p-3 hover:border-amber-400 dark:hover:border-amber-500/50 hover:shadow-md transition-all text-center group">
                                        <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400">{k.character}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">{k.romaji}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Handakuten */}
                        <div>
                            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">Handakuten 半濁点 <span className="text-sm font-normal text-slate-500">(P-sounds - maru ゜)</span></h3>
                            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                                {handakuten.map((k) => (
                                    <div key={k.id} className="bg-rose-50 dark:bg-rose-900/20 rounded-lg border border-rose-200 dark:border-rose-700/50 p-3 hover:border-rose-400 dark:hover:border-rose-500/50 hover:shadow-md transition-all text-center group">
                                        <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100 group-hover:text-rose-600 dark:group-hover:text-rose-400">{k.character}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">{k.romaji}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            })()}

            {/* Katakana Grid - Organized by sections */}
            {activeTab === 'katakana' && (() => {
                const basic = katakana.filter(k => ['a', 'ka', 'sa', 'ta', 'na', 'ha', 'ma', 'ya', 'ra', 'wa', 'n'].includes(k.row));
                const dakuten = katakana.filter(k => ['ga', 'za', 'da', 'ba'].includes(k.row));
                const handakuten = katakana.filter(k => k.row === 'pa');

                const rowOrder = ['a', 'ka', 'sa', 'ta', 'na', 'ha', 'ma', 'ya', 'ra', 'wa', 'n'];
                const sortByRow = (a: typeof katakana[0], b: typeof katakana[0]) => {
                    const rowDiff = rowOrder.indexOf(a.row) - rowOrder.indexOf(b.row);
                    if (rowDiff !== 0) return rowDiff;
                    return ['a', 'i', 'u', 'e', 'o', 'n'].indexOf(a.column) - ['a', 'i', 'u', 'e', 'o', 'n'].indexOf(b.column);
                };

                const dakutenRowOrder = ['ga', 'za', 'da', 'ba'];
                const sortDakuten = (a: typeof katakana[0], b: typeof katakana[0]) => {
                    const rowDiff = dakutenRowOrder.indexOf(a.row) - dakutenRowOrder.indexOf(b.row);
                    if (rowDiff !== 0) return rowDiff;
                    return ['a', 'i', 'u', 'e', 'o'].indexOf(a.column) - ['a', 'i', 'u', 'e', 'o'].indexOf(b.column);
                };

                return (
                    <div className="space-y-8">
                        {/* Basic Katakana */}
                        <div>
                            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">Basic Katakana (46 characters)</h3>
                            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                                {basic.sort(sortByRow).map((k) => (
                                    <div key={k.id} className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700/50 p-3 hover:border-teal-400 dark:hover:border-teal-500/50 hover:shadow-md transition-all text-center group">
                                        <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100 group-hover:text-teal-600 dark:group-hover:text-teal-400">{k.character}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">{k.romaji}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Dakuten */}
                        <div>
                            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">Dakuten 濁点 <span className="text-sm font-normal text-slate-500">(voiced sounds - tenten ゛)</span></h3>
                            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                                {dakuten.sort(sortDakuten).map((k) => (
                                    <div key={k.id} className="bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-700/50 p-3 hover:border-amber-400 dark:hover:border-amber-500/50 hover:shadow-md transition-all text-center group">
                                        <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400">{k.character}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">{k.romaji}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Handakuten */}
                        <div>
                            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">Handakuten 半濁点 <span className="text-sm font-normal text-slate-500">(P-sounds - maru ゜)</span></h3>
                            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                                {handakuten.map((k) => (
                                    <div key={k.id} className="bg-rose-50 dark:bg-rose-900/20 rounded-lg border border-rose-200 dark:border-rose-700/50 p-3 hover:border-rose-400 dark:hover:border-rose-500/50 hover:shadow-md transition-all text-center group">
                                        <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100 group-hover:text-rose-600 dark:group-hover:text-rose-400">{k.character}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">{k.romaji}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            })()}

            {/* Kanji Grid */}
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
