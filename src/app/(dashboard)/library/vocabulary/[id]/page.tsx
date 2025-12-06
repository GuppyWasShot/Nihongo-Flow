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
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-8 transition-colors duration-200">
                    {/* Word Display */}
                    <div className="text-center mb-8">
                        <div className="inline-block p-8 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-2xl mb-4">
                            <p className="text-6xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                                {vocabItem.writing}
                            </p>
                            <p className="text-2xl text-gray-600 dark:text-gray-400">
                                {vocabItem.reading}
                            </p>
                        </div>
                        <div className="flex items-center justify-center gap-3 flex-wrap">
                            <span className="px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-semibold">
                                {vocabItem.jlptLevel}
                            </span>
                            {vocabItem.partOfSpeech && (
                                <span className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm">
                                    {vocabItem.partOfSpeech}
                                </span>
                            )}
                            {srsInfo && (
                                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${srsInfo.color}`}>
                                    {srsInfo.label}
                                </span>
                            )}
                            {vocabItem.audioUrl && (
                                <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-sm transition-colors">
                                    <Volume2 className="w-4 h-4" />
                                    Play Audio
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Meaning */}
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                            Meaning
                        </h2>
                        <p className="text-2xl text-gray-900 dark:text-gray-100">
                            {vocabItem.meaning}
                        </p>
                    </div>

                    {/* Kanji Breakdown */}
                    {relatedKanji.length > 0 && (
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                                Kanji Breakdown
                            </h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {relatedKanji.map(k => (
                                    <Link
                                        key={k.id}
                                        href={`/library/kanji/${k.id}`}
                                        className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors group"
                                    >
                                        <span className="text-3xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                                            {k.character}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                                                {k.meanings.slice(0, 2).join(', ')}
                                            </p>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Example Sentences */}
                    {vocabItem.exampleSentences && vocabItem.exampleSentences.length > 0 && (
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                                <MessageSquare className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                Example Sentences
                            </h2>
                            <div className="space-y-4">
                                {vocabItem.exampleSentences.map((example, idx) => (
                                    <div
                                        key={idx}
                                        className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border-l-4 border-indigo-500"
                                    >
                                        <p className="text-xl text-gray-900 dark:text-gray-100 mb-1">
                                            {example.japanese}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                            {example.reading}
                                        </p>
                                        <p className="text-gray-700 dark:text-gray-300">
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
                                {progress.nextReview && (
                                    <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Next review: {new Date(progress.nextReview).toLocaleDateString()}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Not Started Card */}
                    {!progress && (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Not Yet Learned</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                Complete lessons containing this vocabulary to add it to your review queue.
                            </p>
                        </div>
                    )}

                    {/* Quick Info */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Quick Info</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">JLPT Level</span>
                                <span className="font-semibold text-gray-900 dark:text-gray-100">{vocabItem.jlptLevel}</span>
                            </div>
                            {vocabItem.partOfSpeech && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Part of Speech</span>
                                    <span className="font-semibold text-gray-900 dark:text-gray-100">{vocabItem.partOfSpeech}</span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Kanji Count</span>
                                <span className="font-semibold text-gray-900 dark:text-gray-100">{kanjiChars.length}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
