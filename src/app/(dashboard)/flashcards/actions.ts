'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { db } from '../../../lib/db';
import { flashcardDecks, flashcardSessions, kanji, vocabulary, units, userProgress } from '../../../lib/db/schema';
import { eq, and, desc, inArray } from 'drizzle-orm';

// SRS intervals in hours
const SRS_INTERVALS = [
    4,      // Stage 0 -> 1: 4 hours
    8,      // Stage 1 -> 2: 8 hours
    24,     // Stage 2 -> 3: 1 day
    72,     // Stage 3 -> 4: 3 days
    168,    // Stage 4 -> 5: 1 week
    336,    // Stage 5 -> 6: 2 weeks
    720,    // Stage 6 -> 7: 1 month
    2880,   // Stage 7 -> 8: 4 months (enlightened)
];

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

// Get all decks for current user
export async function getUserDecks() {
    const userId = await getUserId();
    const decks = await db.select().from(flashcardDecks)
        .where(eq(flashcardDecks.userId, userId))
        .orderBy(desc(flashcardDecks.createdAt));
    return { decks };
}

// Get public decks
export async function getPublicDecks() {
    const decks = await db.select().from(flashcardDecks)
        .where(eq(flashcardDecks.isPublic, true))
        .orderBy(desc(flashcardDecks.createdAt));
    return { decks };
}

// Get a single deck with its items
export async function getDeckWithItems(deckId: number) {
    const userId = await getUserId();
    const [deck] = await db.select().from(flashcardDecks).where(eq(flashcardDecks.id, deckId));

    if (!deck) return { error: 'Deck not found' };
    if (deck.userId !== userId && !deck.isPublic) return { error: 'Access denied' };

    let items: any[] = [];
    const itemIds = deck.itemIds || [];
    if (deck.itemType === 'kanji' && itemIds.length > 0) {
        items = await db.select().from(kanji).where(inArray(kanji.id, itemIds));
    } else if (deck.itemType === 'vocabulary' && itemIds.length > 0) {
        items = await db.select().from(vocabulary).where(inArray(vocabulary.id, itemIds));
    }

    return { deck, items };
}

// Create a new deck
export async function createDeck(data: {
    name: string;
    description?: string;
    itemType: 'kanji' | 'vocabulary' | 'grammar' | 'mixed';
    itemIds?: number[];
    jlptLevel?: string;
    unitId?: number;
    isPublic?: boolean;
}) {
    const userId = await getUserId();
    const [deck] = await db.insert(flashcardDecks).values({
        userId,
        name: data.name,
        description: data.description,
        itemType: data.itemType,
        itemIds: data.itemIds || [],
        jlptLevel: data.jlptLevel,
        unitId: data.unitId,
        isPublic: data.isPublic || false,
    }).returning();
    return { deck };
}

// Update a deck
export async function updateDeck(deckId: number, data: Partial<{
    name: string;
    description: string;
    itemIds: number[];
    isPublic: boolean;
}>) {
    const userId = await getUserId();
    const [deck] = await db.update(flashcardDecks)
        .set({ ...data, updatedAt: new Date() })
        .where(and(eq(flashcardDecks.id, deckId), eq(flashcardDecks.userId, userId)))
        .returning();
    return { deck };
}

// Delete a deck
export async function deleteDeck(deckId: number) {
    const userId = await getUserId();
    await db.delete(flashcardDecks)
        .where(and(eq(flashcardDecks.id, deckId), eq(flashcardDecks.userId, userId)));
    return { success: true };
}

// Start a flashcard session
export async function startSession(deckId: number, studyMode: 'recognition' | 'production' | 'cram' | 'test') {
    const userId = await getUserId();
    const { deck, items } = await getDeckWithItems(deckId);
    if (!deck || !items) return { error: 'Deck not found' };

    const [session] = await db.insert(flashcardSessions).values({
        userId,
        deckId,
        studyMode,
        totalCards: items.length,
        startedAt: new Date(),
    }).returning();

    return { session, items };
}

// Complete a flashcard session
export async function completeSession(sessionId: number, correct: number, incorrect: number) {
    const userId = await getUserId();
    const duration = 0; // Calculate from startedAt
    const accuracy = correct + incorrect > 0 ? (correct / (correct + incorrect)) * 100 : 0;

    const [session] = await db.update(flashcardSessions)
        .set({
            correct,
            incorrect,
            accuracy,
            duration,
            completedAt: new Date(),
        })
        .where(and(eq(flashcardSessions.id, sessionId), eq(flashcardSessions.userId, userId)))
        .returning();

    return { session };
}

// Get pre-made deck IDs (kanji and vocab by level)
export async function getPreMadeDecks(level: string = 'N5') {
    const kanjiItems = await db.select({ id: kanji.id }).from(kanji).where(eq(kanji.jlptLevel, level));
    const vocabItems = await db.select({ id: vocabulary.id }).from(vocabulary).where(eq(vocabulary.jlptLevel, level));
    const unitList = await db.select().from(units);

    return {
        kanjiDeck: { name: `${level} Kanji`, itemType: 'kanji', itemIds: kanjiItems.map(k => k.id), count: kanjiItems.length },
        vocabDeck: { name: `${level} Vocabulary`, itemType: 'vocabulary', itemIds: vocabItems.map(v => v.id), count: vocabItems.length },
        units: unitList,
    };
}

// Clone a public deck to user's collection
export async function cloneDeck(deckId: number) {
    const userId = await getUserId();

    // Get the original deck
    const [originalDeck] = await db.select().from(flashcardDecks).where(eq(flashcardDecks.id, deckId));

    if (!originalDeck) {
        return { error: 'Deck not found' };
    }

    if (!originalDeck.isPublic && originalDeck.userId !== userId) {
        return { error: 'Cannot clone private deck' };
    }

    // Create a copy
    const [newDeck] = await db.insert(flashcardDecks).values({
        userId,
        name: `${originalDeck.name} (copy)`,
        description: originalDeck.description,
        itemType: originalDeck.itemType,
        itemIds: originalDeck.itemIds,
        jlptLevel: originalDeck.jlptLevel,
        isPublic: false, // Cloned decks start as private
    }).returning();

    return { deck: newDeck };
}

// Update SRS progress after flashcard review
export async function updateSRS(results: {
    id: number;
    type: 'kanji' | 'vocabulary';
    correct: boolean
}[]) {
    const userId = await getUserId();
    const now = new Date();

    for (const result of results) {
        // Get existing progress or create new
        const [existing] = await db.select()
            .from(userProgress)
            .where(and(
                eq(userProgress.userId, userId),
                eq(userProgress.itemType, result.type),
                eq(userProgress.itemId, result.id)
            ));

        if (existing) {
            // Update existing progress
            let newStage = existing.srsStage;

            if (result.correct) {
                // Move up one stage (max 8)
                newStage = Math.min(8, existing.srsStage + 1);
            } else {
                // Drop back 2 stages (min 0)
                newStage = Math.max(0, existing.srsStage - 2);
            }

            // Calculate next review time
            const intervalHours = SRS_INTERVALS[Math.min(newStage, SRS_INTERVALS.length - 1)];
            const nextReview = new Date(now.getTime() + intervalHours * 60 * 60 * 1000);

            await db.update(userProgress)
                .set({
                    srsStage: newStage,
                    correctCount: existing.correctCount + (result.correct ? 1 : 0),
                    incorrectCount: existing.incorrectCount + (result.correct ? 0 : 1),
                    masteryLevel: Math.round((newStage / 8) * 100),
                    nextReview,
                    lastReviewed: now,
                    updatedAt: now,
                })
                .where(eq(userProgress.id, existing.id));
        } else {
            // Create new progress entry
            const initialStage = result.correct ? 1 : 0;
            const intervalHours = SRS_INTERVALS[initialStage];
            const nextReview = new Date(now.getTime() + intervalHours * 60 * 60 * 1000);

            await db.insert(userProgress).values({
                userId,
                itemType: result.type,
                itemId: result.id,
                srsStage: initialStage,
                masteryLevel: Math.round((initialStage / 8) * 100),
                correctCount: result.correct ? 1 : 0,
                incorrectCount: result.correct ? 0 : 1,
                nextReview,
                lastReviewed: now,
            });
        }
    }

    return { success: true, updatedCount: results.length };
}

// Save partial flashcard progress (for save & quit)
export async function saveFlashcardProgress(data: {
    type: 'kanji' | 'vocabulary';
    level: string;
    completedIds: number[];
    results: { id: number; correct: boolean }[];
}) {
    const userId = await getUserId();

    // Update SRS for completed items
    const srsResults = data.results.map(r => ({
        id: r.id,
        type: data.type,
        correct: r.correct,
    }));

    await updateSRS(srsResults);

    // Store remaining progress in session storage (client-side)
    // Return the completed count for UI feedback
    return {
        success: true,
        savedCount: data.results.length,
        message: `Progress saved! ${data.results.length} cards reviewed.`
    };
}
