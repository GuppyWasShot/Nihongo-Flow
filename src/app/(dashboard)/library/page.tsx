import { db } from '../../../lib/db';
import { kanji, vocabulary, userProgress, kanaCharacters } from '../../../lib/db/schema';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { BookMarked, Zap } from 'lucide-react';
import LibraryTabs from './LibraryTabs';
import { eq } from 'drizzle-orm';
import Link from 'next/link';
import { getDueReviews } from './actions';

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

    if (!user) {
        redirect('/login');
    }

    return user.id;
}

export default async function LibraryPage() {
    const userId = await getUserId();

    // Fetch ALL kanji, vocabulary, and kana
    const allKanji = await db.select().from(kanji);
    const allVocabulary = await db.select().from(vocabulary);
    const allKana = await db.select().from(kanaCharacters);

    // Separate hiragana and katakana
    const hiragana = allKana.filter(k => k.type === 'hiragana');
    const katakana = allKana.filter(k => k.type === 'katakana');

    // Fetch user progress for SRS status
    const progress = await db.select()
        .from(userProgress)
        .where(eq(userProgress.userId, userId));

    // Create a map of progress by item type and ID
    const progressMap = new Map(
        progress.map(p => [`${p.itemType}-${p.itemId}`, p])
    );

    // Add SRS status to kanji
    const kanjiWithProgress = allKanji.map(k => ({
        ...k,
        srsStage: progressMap.get(`kanji-${k.id}`)?.srsStage ?? null,
    }));

    // Add SRS status to vocabulary
    const vocabularyWithProgress = allVocabulary.map(v => ({
        ...v,
        srsStage: progressMap.get(`vocabulary-${v.id}`)?.srsStage ?? null,
    }));

    // Get due reviews count
    const dueReviewsData = await getDueReviews();
    const dueCount = dueReviewsData && 'items' in dueReviewsData && dueReviewsData.items ? dueReviewsData.items.length : 0;

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-10">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl shadow-sm">
                            <BookMarked className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">Study Library</h1>
                            <p className="text-slate-600 dark:text-slate-400">Browse kana, kanji, and vocabulary</p>
                        </div>
                    </div>

                    {/* Quick Review Button */}
                    {dueCount > 0 && (
                        <Link
                            href="/review"
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-400 to-orange-400 text-white rounded-xl font-medium hover:from-rose-500 hover:to-orange-500 transition-all duration-300 shadow-md hover:shadow-lg hover:translate-y-[-2px] active:scale-95"
                        >
                            <Zap className="w-5 h-5" />
                            Quick Review ({dueCount})
                        </Link>
                    )}
                </div>
            </div>

            <LibraryTabs
                kanji={kanjiWithProgress}
                vocabulary={vocabularyWithProgress}
                hiragana={hiragana}
                katakana={katakana}
            />
        </div>
    );
}
