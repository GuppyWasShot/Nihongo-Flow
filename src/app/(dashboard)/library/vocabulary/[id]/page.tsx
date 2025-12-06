import { db } from '../../../../../lib/db';
import { vocabulary, kanji, userProgress } from '../../../../../lib/db/schema';
import { eq, and, inArray } from 'drizzle-orm';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { Breadcrumb } from '../../../../../components/Breadcrumb';
import { BookOpen, Volume2, MessageSquare, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface VocabularyDetailPageProps {
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
                set() { },
                remove() { },
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

export default async function VocabularyDetailPage({ params }: VocabularyDetailPageProps) {
    const { id } = await params;
    const vocabId = parseInt(id);

    if (isNaN(vocabId)) {
        notFound();
    }

    const userId = await getUserId();

    // Fetch vocabulary
    const [vocabItem] = await db.select()
        .from(vocabulary)
        .where(eq(vocabulary.id, vocabId));

    if (!vocabItem) {
        notFound();
    }

    // Fetch user's SRS progress
    const [progress] = await db.select()
        .from(userProgress)
        .where(
            and(
                eq(userProgress.userId, userId),
                eq(userProgress.itemType, 'vocabulary'),
                eq(userProgress.itemId, vocabId)
            )
        );

    // Extract kanji characters from the writing
    const kanjiChars = vocabItem.writing.split('').filter(char => {
        const code = char.charCodeAt(0);
        return code >= 0x4E00 && code <= 0x9FAF;
    });

    // Fetch kanji details for breakdown
    let relatedKanji: typeof kanji.$inferSelect[] = [];
    if (kanjiChars.length > 0) {
        relatedKanji = await db.select()
            .from(kanji)
            .where(inArray(kanji.character, kanjiChars));
    }

    const srsInfo = progress ? getSRSLabel(progress.srsStage) : null;

    return (
        <div className="max-w-4xl mx-auto">
            <Breadcrumb items={[
                { label: 'Library', href: '/library' },
                { label: 'Vocabulary', href: '/library?tab=vocabulary' },
                { label: vocabItem.writing }
            ]} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Info Card */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-8 transition-colors duration-200">
                    {/* Word Display */}
                    <div className="text-center mb-10">
                        <div className="inline-block p-10 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-3xl mb-5">
                            <p className="text-6xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                                {vocabItem.writing}
                            </p>
                            <p className="text-2xl text-slate-500 dark:text-slate-400">
                                {vocabItem.reading}
                            </p>
                        </div>
                        <div className="flex items-center justify-center gap-3 flex-wrap">
                            <span className="px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full text-sm font-medium">
                                {vocabItem.jlptLevel}
                            </span>
                            {vocabItem.partOfSpeech && (
                                <span className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full text-sm">
                                    {vocabItem.partOfSpeech}
                                </span>
                            )}
                            {srsInfo && (
                                <span className={`px-4 py-2 rounded-full text-sm font-medium ${srsInfo.color}`}>
                                    {srsInfo.label}
                                </span>
                            )}
                            {vocabItem.audioUrl && (
                                <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full text-sm transition-colors">
                                    <Volume2 className="w-4 h-4" />
                                    Play Audio
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Meaning */}
                    <div className="mb-8">
                        <h2 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                            Meaning
                        </h2>
                        <p className="text-2xl text-slate-900 dark:text-slate-100">
                            {vocabItem.meaning}
                        </p>
                    </div>

                    {/* Kanji Breakdown */}
                    {relatedKanji.length > 0 && (
                        <div className="mb-8">
                            <h2 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">
                                Kanji Breakdown
                            </h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {relatedKanji.map(k => (
                                    <Link
                                        key={k.id}
                                        href={`/library/kanji/${k.id}`}
                                        className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors group"
                                    >
                                        <span className="text-3xl font-semibold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                                            {k.character}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                                                {k.meanings.slice(0, 2).join(', ')}
                                            </p>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400" />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Example Sentences */}
                    {vocabItem.exampleSentences && vocabItem.exampleSentences.length > 0 && (
                        <div>
                            <h2 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                                <MessageSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                Example Sentences
                            </h2>
                            <div className="space-y-4">
                                {vocabItem.exampleSentences.map((example, idx) => (
                                    <div
                                        key={idx}
                                        className="p-5 bg-slate-50 dark:bg-slate-700/50 rounded-xl border-l-4 border-emerald-500"
                                    >
                                        <p className="text-xl text-slate-900 dark:text-slate-100 mb-1">
                                            {example.japanese}
                                        </p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                                            {example.reading}
                                        </p>
                                        <p className="text-slate-600 dark:text-slate-300">
                                            {example.english}
                                        </p>
                                    </div>
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
                                {progress.nextReview && (
                                    <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                            Next review: {new Date(progress.nextReview).toLocaleDateString()}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Not Started Card */}
                    {!progress && (
                        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-6 transition-colors duration-200">
                            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-3">Not Yet Learned</h3>
                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                Complete lessons containing this vocabulary to add it to your review queue.
                            </p>
                        </div>
                    )}

                    {/* Quick Info */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-6 transition-colors duration-200">
                        <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-5">Quick Info</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-slate-600 dark:text-slate-400">JLPT Level</span>
                                <span className="font-medium text-slate-900 dark:text-slate-100">{vocabItem.jlptLevel}</span>
                            </div>
                            {vocabItem.partOfSpeech && (
                                <div className="flex justify-between">
                                    <span className="text-slate-600 dark:text-slate-400">Part of Speech</span>
                                    <span className="font-medium text-slate-900 dark:text-slate-100">{vocabItem.partOfSpeech}</span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span className="text-slate-600 dark:text-slate-400">Kanji Count</span>
                                <span className="font-medium text-slate-900 dark:text-slate-100">{kanjiChars.length}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
