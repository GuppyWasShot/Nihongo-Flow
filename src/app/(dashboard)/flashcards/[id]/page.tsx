import { getDeckWithItems, cloneDeck } from '../actions';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Play, Pencil, Globe, Lock, Share2, Copy, BookOpen } from 'lucide-react';
import { Breadcrumb } from '../../../../components/Breadcrumb';

interface DeckPageProps {
    params: Promise<{ id: string }>;
}

async function getUserId() {
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) { return cookieStore.get(name)?.value; },
                set() { },
                remove() { },
            },
        }
    );
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id;
}

export default async function DeckPage({ params }: DeckPageProps) {
    const { id } = await params;
    const deckId = parseInt(id);

    if (isNaN(deckId)) notFound();

    const userId = await getUserId();
    if (!userId) redirect('/login');

    const result = await getDeckWithItems(deckId);

    if ('error' in result || !result.deck) {
        notFound();
    }

    const { deck, items } = result;
    const isOwner = deck.userId === userId;
    const shareUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/flashcards/${deck.id}`
        : `/flashcards/${deck.id}`;

    // Server action for cloning
    async function handleClone() {
        'use server';
        const cloneResult = await cloneDeck(deckId);
        if (cloneResult.deck) {
            redirect(`/flashcards/${cloneResult.deck.id}`);
        }
    }

    return (
        <div className="max-w-4xl mx-auto">
            <Breadcrumb items={[
                { label: 'Flashcards', href: '/flashcards' },
                { label: deck.name }
            ]} />

            {/* Deck Header */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-8 mb-6">
                <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-2xl">
                            <BookOpen className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{deck.name}</h1>
                            {deck.description && (
                                <p className="text-slate-500 dark:text-slate-400">{deck.description}</p>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {deck.isPublic ? (
                            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-lg text-sm">
                                <Globe className="w-4 h-4" /> Public
                            </span>
                        ) : (
                            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-lg text-sm">
                                <Lock className="w-4 h-4" /> Private
                            </span>
                        )}
                    </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6 mb-6 text-sm text-slate-600 dark:text-slate-400">
                    <span>{items.length} cards</span>
                    <span className="capitalize">{deck.itemType}</span>
                    {deck.jlptLevel && <span>{deck.jlptLevel}</span>}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                    <Link
                        href={`/flashcards/study?deckId=${deck.id}`}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-teal-600 transition-all"
                    >
                        <Play className="w-5 h-5" />
                        Study Now
                    </Link>

                    {deck.isPublic && (
                        <button
                            className="flex items-center gap-2 px-4 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                            onClick={() => navigator.clipboard.writeText(shareUrl)}
                        >
                            <Share2 className="w-5 h-5" />
                            Share
                        </button>
                    )}

                    {isOwner && (
                        <Link
                            href={`/flashcards/${deck.id}/edit`}
                            className="flex items-center gap-2 px-4 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                        >
                            <Pencil className="w-5 h-5" />
                            Edit
                        </Link>
                    )}

                    {!isOwner && deck.isPublic && (
                        <form action={handleClone}>
                            <button
                                type="submit"
                                className="flex items-center gap-2 px-4 py-3 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-xl font-medium hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors"
                            >
                                <Copy className="w-5 h-5" />
                                Clone to My Decks
                            </button>
                        </form>
                    )}
                </div>
            </div>

            {/* Cards Grid */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-6">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                    Cards in this Deck
                </h2>

                {items.length === 0 ? (
                    <p className="text-center text-slate-500 dark:text-slate-400 py-8">
                        No cards in this deck yet.
                    </p>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        {items.map((item: any) => (
                            <div
                                key={item.id}
                                className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 text-center hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                            >
                                <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-1">
                                    {item.character || item.writing}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                    {item.meanings?.join(', ') || item.meaning}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
