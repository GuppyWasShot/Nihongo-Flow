import { db } from '../../../lib/db';
import { kanji, vocabulary, userProgress } from '../../../lib/db/schema';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { BookMarked } from 'lucide-react';
import LibraryTabs from './LibraryTabs';
import { eq } from 'drizzle-orm';

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

    if (!user) {
        redirect('/login');
    }

    return user.id;
}

export default async function LibraryPage() {
    const userId = await getUserId();

    // Fetch kanji (limit 50 for performance)
    const allKanji = await db.select().from(kanji).limit(50);

    // Fetch vocabulary (limit 50 for performance)
    const allVocabulary = await db.select().from(vocabulary).limit(50);

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

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl">
                        <BookMarked className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">Study Library</h1>
                </div>
                <p className="text-gray-600">Browse and review kanji and vocabulary</p>
            </div>

            <LibraryTabs
                kanji={kanjiWithProgress}
                vocabulary={vocabularyWithProgress}
            />
        </div>
    );
}
