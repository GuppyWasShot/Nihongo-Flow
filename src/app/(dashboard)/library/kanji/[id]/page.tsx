import { db } from '../../../../../lib/db';
import { kanji, userProgress, vocabulary } from '../../../../../lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { Breadcrumb } from '../../../../../components/Breadcrumb';
import { BookOpen, Volume2, Layers, Pencil, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface KanjiDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}

async function getUserId() {
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
                set(name: string, value: string, options: any) {
                    cookieStore.set({ name, value, ...options });
                },
                remove(name: string, options: any) {
                    cookieStore.set({ name, value: '', ...options });
                },
            },
        }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');
    return user.id;
}

function getSRSLabel(stage: number): { label: string; color: string } {
    if (stage === 0) return { label: 'New', color: 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300' };
    if (stage <= 2) return { label: 'Apprentice', color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' };
    if (stage <= 5) return { label: 'Guru', color: 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300' };
    if (stage <= 7) return { label: 'Master', color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' };
    return { label: 'Enlightened', color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' };
}

export default async function KanjiDetailPage({ params }: KanjiDetailPageProps) {
    const { id } = await params;
    const kanjiId = parseInt(id);

    if (isNaN(kanjiId)) {
        notFound();
    }

    const userId = await getUserId();

    // Fetch kanji
    const [kanjiItem] = await db.select()
        .from(kanji)
        .where(eq(kanji.id, kanjiId));

    if (!kanjiItem) {
        notFound();
    }

    // Fetch user's SRS progress for this kanji
    const [progress] = await db.select()
        .from(userProgress)
        .where(
            and(
                eq(userProgress.userId, userId),
                eq(userProgress.itemType, 'kanji'),
                eq(userProgress.itemId, kanjiId)
            )
        );

    // Fetch related vocabulary (words that use this kanji)
    const relatedVocab = await db.select()
        .from(vocabulary)
        .where(eq(vocabulary.jlptLevel, kanjiItem.jlptLevel))
        .limit(5);

    // Filter to only vocab that contains this kanji
    const vocabWithKanji = relatedVocab.filter(v =>
        v.writing.includes(kanjiItem.character)
    );

    const srsInfo = progress ? getSRSLabel(progress.srsStage) : null;

    return (
        <div className="max-w-4xl mx-auto">
            <Breadcrumb items={[
                { label: 'Library', href: '/library' },
                { label: 'Kanji', href: '/library?tab=kanji' },
                { label: kanjiItem.character }
            ]} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Info Card */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-8 transition-colors duration-200">
                    {/* Character Display */}
                    <div className="text-center mb-10">
                        <div className="inline-block p-10 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-3xl mb-5">
                            <span className="text-9xl font-semibold text-slate-900 dark:text-slate-100">
                                {kanjiItem.character}
                            </span>
                        </div>
                        <div className="flex items-center justify-center gap-3 flex-wrap">
                            <span className="px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full text-sm font-medium">
                                {kanjiItem.jlptLevel}
                            </span>
                            {kanjiItem.strokeCount && (
                                <span className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full text-sm">
                                    <Pencil className="w-4 h-4" />
                                    {kanjiItem.strokeCount} strokes
                                </span>
                            )}
                            {srsInfo && (
                                <span className={`px-4 py-2 rounded-full text-sm font-medium ${srsInfo.color}`}>
                                    {srsInfo.label}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Meanings */}
                    <div className="mb-8">
                        <h2 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                            Meanings
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {kanjiItem.meanings.map((meaning, idx) => (
                                <span
                                    key={idx}
                                    className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-xl text-lg"
                                >
                                    {meaning}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Readings */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {/* Onyomi */}
                        {kanjiItem.onyomi && kanjiItem.onyomi.length > 0 && (
                            <div>
                                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-2">
                                    <Volume2 className="w-4 h-4" />
                                    音読み (On'yomi) - Chinese Reading
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {kanjiItem.onyomi.map((reading, idx) => (
                                        <span
                                            key={idx}
                                            className="px-4 py-2 bg-rose-100 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300 rounded-xl text-lg font-medium"
                                        >
                                            {reading}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Kunyomi */}
                        {kanjiItem.kunyomi && kanjiItem.kunyomi.length > 0 && (
                            <div>
                                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-2">
                                    <Volume2 className="w-4 h-4" />
                                    訓読み (Kun'yomi) - Japanese Reading
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {kanjiItem.kunyomi.map((reading, idx) => (
                                        <span
                                            key={idx}
                                            className="px-4 py-2 bg-teal-100 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 rounded-xl text-lg font-medium"
                                        >
                                            {reading}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Radicals */}
                    {kanjiItem.radicals && kanjiItem.radicals.length > 0 && (
                        <div>
                            <h2 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                                <Layers className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                Radicals
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {kanjiItem.radicals.map((radical, idx) => (
                                    <span
                                        key={idx}
                                        className="px-5 py-3 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-xl text-xl"
                                    >
                                        {radical}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* SRS Progress Card */}
                    {progress && (
                        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-6 transition-colors duration-200">
                            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-5">Your Progress</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-slate-600 dark:text-slate-400">SRS Stage</span>
                                    <span className="font-medium text-slate-900 dark:text-slate-100">{progress.srsStage} / 8</span>
                                </div>
                                <div className="bg-slate-100 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                                    <div
                                        className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full"
                                        style={{ width: `${(progress.srsStage / 8) * 100}%` }}
                                    />
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600 dark:text-slate-400">Correct</span>
                                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">{progress.correctCount}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600 dark:text-slate-400">Incorrect</span>
                                    <span className="text-rose-600 dark:text-rose-400 font-medium">{progress.incorrectCount}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Example Words */}
                    {vocabWithKanji.length > 0 && (
                        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-6 transition-colors duration-200">
                            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-5">Example Words</h3>
                            <div className="space-y-3">
                                {vocabWithKanji.map(vocab => (
                                    <Link
                                        key={vocab.id}
                                        href={`/library/vocabulary/${vocab.id}`}
                                        className="block p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors group"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-lg font-medium text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                                                    {vocab.writing}
                                                </p>
                                                <p className="text-sm text-slate-500 dark:text-slate-400">{vocab.reading}</p>
                                                <p className="text-sm text-slate-500 dark:text-slate-500">{vocab.meaning}</p>
                                            </div>
                                            <ArrowRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400" />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Official Example Words from Kanji data */}
                    {kanjiItem.exampleWords && kanjiItem.exampleWords.length > 0 && (
                        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-6 transition-colors duration-200">
                            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-5">More Examples</h3>
                            <div className="space-y-3">
                                {kanjiItem.exampleWords.map((example, idx) => (
                                    <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                                        <p className="text-lg font-medium text-slate-900 dark:text-slate-100">{example.word}</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">{example.reading}</p>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">{example.meaning}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
