import { getUserDecks, getPreMadeDecks } from './actions';
import Link from 'next/link';
import { Layers, Plus, BookOpen, ChevronRight, Sparkles, Clock } from 'lucide-react';
import { PageHeader } from '../../../components/PageHeader';

export default async function FlashcardsPage() {
    const { decks } = await getUserDecks();
    const preMade = await getPreMadeDecks('N5');

    return (
        <div className="max-w-4xl mx-auto">
            <PageHeader
                icon={Layers}
                title="Flashcards"
                description="Study vocabulary and kanji with customizable decks"
                action={
                    <Link
                        href="/flashcards/new"
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-teal-600 transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        Create Deck
                    </Link>
                }
            />

            {/* Quick Start Section */}
            <div className="mb-8">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    Quick Start
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                    <Link
                        href={`/flashcards/study?type=kanji&level=N5`}
                        className="group bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border border-purple-200/50 dark:border-purple-700/50 p-6 hover:shadow-lg transition-all"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">N5 Kanji</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{preMade.kanjiDeck.count} cards</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
                        </div>
                    </Link>

                    <Link
                        href={`/flashcards/study?type=vocabulary&level=N5`}
                        className="group bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl border border-emerald-200/50 dark:border-emerald-700/50 p-6 hover:shadow-lg transition-all"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">N5 Vocabulary</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{preMade.vocabDeck.count} cards</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                        </div>
                    </Link>
                </div>
            </div>

            {/* My Decks */}
            <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    My Decks
                </h2>

                {decks.length === 0 ? (
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-12 text-center">
                        <div className="flex justify-center mb-4">
                            <div className="flex items-center justify-center w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full">
                                <Layers className="w-8 h-8 text-slate-400" />
                            </div>
                        </div>
                        <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">No custom decks yet</h3>
                        <p className="text-slate-500 dark:text-slate-400 mb-4">Create your first deck to organize your study materials</p>
                        <Link
                            href="/flashcards/new"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Create Deck
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {decks.map((deck) => (
                            <Link
                                key={deck.id}
                                href={`/flashcards/${deck.id}`}
                                className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-6 hover:shadow-lg hover:border-emerald-300 dark:hover:border-emerald-600/50 transition-all"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                            {deck.name}
                                        </h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                            {(deck.itemIds || []).length} cards • {deck.itemType}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        {deck.jlptLevel && (
                                            <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded text-xs font-medium">
                                                {deck.jlptLevel}
                                            </span>
                                        )}
                                        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
