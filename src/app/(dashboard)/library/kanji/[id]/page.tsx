import { db } from '../../../../../lib/db';
import { kanji, userProgress, vocabulary } from '../../../../../lib/db/schema';
import { eq, and, inArray } from 'drizzle-orm';
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
    if (stage === 0) return { label: 'New', color: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300' };
    if (stage <= 2) return { label: 'Apprentice', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' };
    if (stage <= 5) return { label: 'Guru', color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' };
    if (stage <= 7) return { label: 'Master', color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' };
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
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-8 transition-colors duration-200">
                    {/* Character Display */}
                    <div className="text-center mb-8">
                        <div className="inline-block p-8 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-2xl mb-4">
                            <span className="text-9xl font-bold text-gray-900 dark:text-gray-100">
                                {kanjiItem.character}
                            </span>
                        </div>
                        <div className="flex items-center justify-center gap-3 flex-wrap">
                            <span className="px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-semibold">
                                {kanjiItem.jlptLevel}
                            </span>
                            {kanjiItem.strokeCount && (
                                <span className="flex items-center gap-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm">
                                    <Pencil className="w-4 h-4" />
                                    {kanjiItem.strokeCount} strokes
                                </span>
                            )}
                            {srsInfo && (
                                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${srsInfo.color}`}>
                                    {srsInfo.label}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Meanings */}
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                            Meanings
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {kanjiItem.meanings.map((meaning, idx) => (
                                <span
                                    key={idx}
                                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl text-lg"
                                >
                                    {meaning}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Readings */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* Onyomi */}
                        {kanjiItem.onyomi && kanjiItem.onyomi.length > 0 && (
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2">
                                    <Volume2 className="w-4 h-4" />
                                    音読み (On'yomi) - Chinese Reading
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {kanjiItem.onyomi.map((reading, idx) => (
                                        <span
                                            key={idx}
                                            className="px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-lg font-medium"
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
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2">
                                    <Volume2 className="w-4 h-4" />
                                    訓読み (Kun'yomi) - Japanese Reading
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {kanjiItem.kunyomi.map((reading, idx) => (
                                        <span
                                            key={idx}
                                            className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-lg font-medium"
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
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                                <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                Radicals
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {kanjiItem.radicals.map((radical, idx) => (
                                    <span
                                        key={idx}
                                        className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-xl text-xl"
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
                        <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Your Progress</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">SRS Stage</span>
                                    <span className="font-semibold text-gray-900 dark:text-gray-100">{progress.srsStage} / 8</span>
                                </div>
                                <div className="bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                                    <div
                                        className="bg-gradient-to-r from-indigo-600 to-purple-600 h-full"
                                        style={{ width: `${(progress.srsStage / 8) * 100}%` }}
                                    />
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Correct</span>
                                    <span className="text-green-600 dark:text-green-400 font-medium">{progress.correctCount}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Incorrect</span>
                                    <span className="text-red-600 dark:text-red-400 font-medium">{progress.incorrectCount}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Example Words */}
                    {vocabWithKanji.length > 0 && (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Example Words</h3>
                            <div className="space-y-3">
                                {vocabWithKanji.map(vocab => (
                                    <Link
                                        key={vocab.id}
                                        href={`/library/vocabulary/${vocab.id}`}
                                        className="block p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors group"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                                                    {vocab.writing}
                                                </p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">{vocab.reading}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-500">{vocab.meaning}</p>
                                            </div>
                                            <ArrowRight className="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Official Example Words from Kanji data */}
                    {kanjiItem.exampleWords && kanjiItem.exampleWords.length > 0 && (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">More Examples</h3>
                            <div className="space-y-3">
                                {kanjiItem.exampleWords.map((example, idx) => (
                                    <div key={idx} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                        <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{example.word}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{example.reading}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-500">{example.meaning}</p>
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
