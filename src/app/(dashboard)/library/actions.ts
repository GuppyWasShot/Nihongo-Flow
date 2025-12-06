'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { db } from '../../../lib/db';
import { userProgress, vocabulary, kanji } from '../../../lib/db/schema';
import { eq, and, lte } from 'drizzle-orm';
import { isDue } from '../../../lib/srs';

export async function getDueReviews() {
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

    try {
        // Get all user progress items that are due for review
        const now = new Date();
        const progress = await db.select()
            .from(userProgress)
            .where(
                and(
                    eq(userProgress.userId, user.id),
                    lte(userProgress.nextReview, now)
                )
            );

        // Fetch actual items (vocabulary and kanji)
        const dueItems = [];

        for (const progressItem of progress) {
            if (progressItem.itemType === 'vocabulary') {
                const [vocabItem] = await db.select()
                    .from(vocabulary)
                    .where(eq(vocabulary.id, progressItem.itemId));

                if (vocabItem) {
                    dueItems.push({
                        id: vocabItem.id,
                        type: 'vocabulary' as const,
                        question: vocabItem.writing,
                        answer: vocabItem.reading,
                        meaning: vocabItem.meaning,
                    });
                }
            } else if (progressItem.itemType === 'kanji') {
                const [kanjiItem] = await db.select()
                    .from(kanji)
                    .where(eq(kanji.id, progressItem.itemId));

                if (kanjiItem) {
                    dueItems.push({
                        id: kanjiItem.id,
                        type: 'kanji' as const,
                        question: kanjiItem.character,
                        answer: kanjiItem.kunyomi?.[0] || kanjiItem.onyomi?.[0] || '',
                        meaning: kanjiItem.meanings.join(', '),
                    });
                }
            }
        }

        return { items: dueItems };
    } catch (error: any) {
        console.error('Error fetching due reviews:', error);
        return { error: 'Failed to fetch due reviews' };
    }
}
