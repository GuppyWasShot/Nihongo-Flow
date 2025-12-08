'use client';

import { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Plus, X, ArrowLeft, Globe, Lock, Filter, Zap } from 'lucide-react';
import Link from 'next/link';
import { createDeck } from '../actions';

interface SearchItem {
    id: number;
    character?: string;
    writing?: string;
    reading?: string;
    meaning?: string;
    meanings?: string[];
    onyomi?: string[];
    kunyomi?: string[];
    type: 'kanji' | 'vocabulary';
}

type JLPTLevel = 'all' | 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
type POSFilter = 'all' | 'noun' | 'verb' | 'adjective' | 'adverb' | 'expression';

export default function CreateDeckPage() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    // Form state
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [itemType, setItemType] = useState<'kanji' | 'vocabulary' | 'mixed'>('mixed');
    const [isPublic, setIsPublic] = useState(false);
    const [selectedItems, setSelectedItems] = useState<SearchItem[]>([]);

    // Filter state
    const [jlptLevel, setJlptLevel] = useState<JLPTLevel>('N5');
    const [posFilter, setPosFilter] = useState<POSFilter>('all');
    const [showFilters, setShowFilters] = useState(false);

    // Search state
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchItem[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    // Quick add state
    const [isLoadingQuickAdd, setIsLoadingQuickAdd] = useState(false);

    // Search for items with filters
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }

        const timer = setTimeout(async () => {
            setIsSearching(true);
            try {
                const params = new URLSearchParams({
                    q: searchQuery,
                    type: itemType,
                    level: jlptLevel !== 'all' ? jlptLevel : '',
                    pos: posFilter !== 'all' ? posFilter : '',
                });
                const res = await fetch(`/api/flashcards/search?${params}`);
                const data = await res.json();
                setSearchResults(data.items || []);
            } catch (error) {
                console.error('Search error:', error);
            }
            setIsSearching(false);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery, itemType, jlptLevel, posFilter]);

    const addItem = (item: SearchItem) => {
        if (!selectedItems.find(i => i.id === item.id && i.type === item.type)) {
            setSelectedItems([...selectedItems, item]);
        }
        setSearchQuery('');
        setSearchResults([]);
    };

    const removeItem = (item: SearchItem) => {
        setSelectedItems(selectedItems.filter(i => !(i.id === item.id && i.type === item.type)));
    };

    // Quick add all items of a category
    const quickAddCategory = async (type: 'kanji' | 'vocabulary', level: string) => {
        setIsLoadingQuickAdd(true);
        try {
            const res = await fetch(`/api/flashcards/bulk?type=${type}&level=${level}`);
            const data = await res.json();
            if (data.items) {
                const newItems = data.items.filter(
                    (item: SearchItem) => !selectedItems.find(i => i.id === item.id && i.type === item.type)
                );
                setSelectedItems([...selectedItems, ...newItems]);
            }
        } catch (error) {
            console.error('Quick add error:', error);
        }
        setIsLoadingQuickAdd(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || selectedItems.length === 0) return;

        startTransition(async () => {
            const kanjiIds = selectedItems.filter(i => i.type === 'kanji').map(i => i.id);
            const vocabIds = selectedItems.filter(i => i.type === 'vocabulary').map(i => i.id);

            let effectiveType: 'kanji' | 'vocabulary' | 'mixed' = 'mixed';
            if (kanjiIds.length > 0 && vocabIds.length === 0) effectiveType = 'kanji';
            if (vocabIds.length > 0 && kanjiIds.length === 0) effectiveType = 'vocabulary';

            const result = await createDeck({
                name: name.trim(),
                description: description.trim() || undefined,
                itemType: effectiveType,
                itemIds: [...kanjiIds, ...vocabIds],
                isPublic,
                jlptLevel: jlptLevel !== 'all' ? jlptLevel : undefined,
            });

            if (result.deck) {
                router.push(`/flashcards/${result.deck.id}`);
            }
        });
    };

    return (
        <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link
                    href="/flashcards"
                    className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </Link>
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Create Flashcard Deck</h1>
                    <p className="text-slate-500 dark:text-slate-400">Build a custom deck with kanji and vocabulary</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Deck Name */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Deck Name *
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., JLPT N5 Must-Know Kanji"
                        className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                        required
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Description
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Optional: describe what this deck covers..."
                        rows={2}
                        className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
                    />
                </div>

                {/* Quick Add Section */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border border-amber-200/50 dark:border-amber-700/50 p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <Zap className="w-5 h-5 text-amber-500" />
                        <span className="font-medium text-slate-900 dark:text-slate-100">Quick Add</span>
                        <span className="text-sm text-slate-500">(add entire categories)</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <button
                            type="button"
                            onClick={() => quickAddCategory('kanji', 'N5')}
                            disabled={isLoadingQuickAdd}
                            className="px-3 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg text-sm font-medium hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors disabled:opacity-50"
                        >
                            All N5 Kanji
                        </button>
                        <button
                            type="button"
                            onClick={() => quickAddCategory('vocabulary', 'N5')}
                            disabled={isLoadingQuickAdd}
                            className="px-3 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-lg text-sm font-medium hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors disabled:opacity-50"
                        >
                            All N5 Vocab
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                quickAddCategory('kanji', 'N5');
                                quickAddCategory('vocabulary', 'N5');
                            }}
                            disabled={isLoadingQuickAdd}
                            className="px-3 py-2 bg-gradient-to-r from-purple-100 to-emerald-100 dark:from-purple-900/30 dark:to-emerald-900/30 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:from-purple-200 hover:to-emerald-200 dark:hover:from-purple-900/50 dark:hover:to-emerald-900/50 transition-colors disabled:opacity-50"
                        >
                            All N5 (Both)
                        </button>
                        <button
                            type="button"
                            onClick={() => setSelectedItems([])}
                            className="px-3 py-2 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 rounded-lg text-sm font-medium hover:bg-rose-200 dark:hover:bg-rose-900/50 transition-colors"
                        >
                            Clear All
                        </button>
                    </div>
                    {isLoadingQuickAdd && (
                        <p className="text-sm text-amber-600 dark:text-amber-400 mt-2 flex items-center gap-2">
                            <span className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></span>
                            Adding items...
                        </p>
                    )}
                </div>

                {/* Filters */}
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/50 p-4">
                    <button
                        type="button"
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center justify-between w-full text-left"
                    >
                        <div className="flex items-center gap-2">
                            <Filter className="w-5 h-5 text-slate-500" />
                            <span className="font-medium text-slate-900 dark:text-slate-100">Search Filters</span>
                        </div>
                        <span className="text-sm text-slate-500">{showFilters ? '▲' : '▼'}</span>
                    </button>

                    {showFilters && (
                        <div className="mt-4 space-y-4">
                            {/* Item Type */}
                            <div>
                                <label className="block text-sm text-slate-600 dark:text-slate-400 mb-2">Type</label>
                                <div className="flex flex-wrap gap-2">
                                    {(['mixed', 'kanji', 'vocabulary'] as const).map((type) => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setItemType(type)}
                                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${itemType === type
                                                    ? 'bg-emerald-500 text-white'
                                                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                                                }`}
                                        >
                                            {type === 'mixed' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* JLPT Level */}
                            <div>
                                <label className="block text-sm text-slate-600 dark:text-slate-400 mb-2">JLPT Level</label>
                                <div className="flex flex-wrap gap-2">
                                    {(['all', 'N5', 'N4', 'N3', 'N2', 'N1'] as const).map((level) => (
                                        <button
                                            key={level}
                                            type="button"
                                            onClick={() => setJlptLevel(level)}
                                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${jlptLevel === level
                                                    ? 'bg-teal-500 text-white'
                                                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                                                }`}
                                        >
                                            {level === 'all' ? 'All Levels' : level}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Part of Speech (for vocabulary) */}
                            {(itemType === 'vocabulary' || itemType === 'mixed') && (
                                <div>
                                    <label className="block text-sm text-slate-600 dark:text-slate-400 mb-2">Word Type</label>
                                    <div className="flex flex-wrap gap-2">
                                        {(['all', 'noun', 'verb', 'adjective', 'adverb', 'expression'] as const).map((pos) => (
                                            <button
                                                key={pos}
                                                type="button"
                                                onClick={() => setPosFilter(pos)}
                                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${posFilter === pos
                                                        ? 'bg-purple-500 text-white'
                                                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                                                    }`}
                                            >
                                                {pos === 'all' ? 'All Types' : pos.charAt(0).toUpperCase() + pos.slice(1)}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Search & Add Items */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Search Cards
                    </label>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by kanji, reading, or meaning (romaji OK)..."
                            className="w-full pl-12 pr-4 py-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                        />

                        {/* Search Results Dropdown */}
                        {(searchResults.length > 0 || isSearching) && (
                            <div className="absolute z-10 w-full mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg max-h-60 overflow-auto">
                                {isSearching ? (
                                    <div className="p-4 text-center text-slate-500">Searching...</div>
                                ) : (
                                    searchResults.map((item) => (
                                        <button
                                            key={`${item.type}-${item.id}`}
                                            type="button"
                                            onClick={() => addItem(item)}
                                            disabled={selectedItems.some(i => i.id === item.id && i.type === item.type)}
                                            className="w-full px-4 py-3 text-left hover:bg-emerald-50 dark:hover:bg-emerald-900/20 flex items-center justify-between border-b border-slate-100 dark:border-slate-700 last:border-0 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <div>
                                                <span className="text-lg font-medium text-slate-900 dark:text-slate-100">
                                                    {item.character || item.writing}
                                                </span>
                                                {item.reading && (
                                                    <span className="ml-2 text-sm text-slate-500">{item.reading}</span>
                                                )}
                                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                                    {item.meanings?.join(', ') || item.meaning}
                                                </p>
                                            </div>
                                            <span className={`text-xs px-2 py-1 rounded ${item.type === 'kanji'
                                                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                                                    : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                                                }`}>
                                                {item.type}
                                            </span>
                                        </button>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Selected Items */}
                {selectedItems.length > 0 && (
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Selected Cards ({selectedItems.length})
                            </label>
                            <div className="text-xs text-slate-500">
                                {selectedItems.filter(i => i.type === 'kanji').length} kanji, {selectedItems.filter(i => i.type === 'vocabulary').length} vocab
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 max-h-48 overflow-auto">
                            {selectedItems.map((item) => (
                                <div
                                    key={`${item.type}-${item.id}`}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg ${item.type === 'kanji'
                                            ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                                            : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                                        }`}
                                >
                                    <span className="font-medium">{item.character || item.writing}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeItem(item)}
                                        className="hover:opacity-70"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Public Toggle */}
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                        {isPublic ? (
                            <Globe className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                            <Lock className="w-5 h-5 text-slate-500" />
                        )}
                        <div>
                            <p className="font-medium text-slate-900 dark:text-slate-100">
                                {isPublic ? 'Public Deck' : 'Private Deck'}
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                {isPublic ? 'Anyone can find and study this deck' : 'Only you can access this deck'}
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setIsPublic(!isPublic)}
                        className={`relative w-12 h-7 rounded-full transition-colors ${isPublic ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'
                            }`}
                    >
                        <span className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${isPublic ? 'translate-x-6' : 'translate-x-1'
                            }`} />
                    </button>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={!name.trim() || selectedItems.length === 0 || isPending}
                    className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                    {isPending ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Creating...
                        </>
                    ) : (
                        <>
                            <Plus className="w-5 h-5" />
                            Create Deck ({selectedItems.length} cards)
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
