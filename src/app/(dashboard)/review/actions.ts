'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { db } from '../../../lib/db';
import { userProgress, vocabulary, kanji, userProfiles } from '../../../lib/db/schema';
import { eq, and, lte, gt } from 'drizzle-orm';
import { calculateNextReview } from '../../../lib/srs';

// Types for review items
export interface ReviewItem {
    id: number;
    type: 'vocabulary' | 'kanji';
    progressId: number;
    srsStage: number;
    question: string;
    answer: string;
    meaning: string;
    alternatives?: string[];
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

    if (!user) {
        redirect('/login');
    }

    return user.id;
}

/**
 * Fetch all items due for review with full details
 */
export async function getDueReviewItems(): Promise<{ items: ReviewItem[]; error?: string }> {
    try {
        const userId = await getUserId();
        const now = new Date();

        // Get all due progress items
        const dueProgress = await db.select()
            .from(userProgress)
            .where(
                and(
                    eq(userProgress.userId, userId),
                    lte(userProgress.nextReview, now)
                )
            );

        const reviewItems: ReviewItem[] = [];

        for (const progress of dueProgress) {
            if (progress.itemType === 'vocabulary') {
                const [vocabItem] = await db.select()
                    .from(vocabulary)
                    .where(eq(vocabulary.id, progress.itemId));

                if (vocabItem) {
                    reviewItems.push({
                        id: vocabItem.id,
                        type: 'vocabulary',
                        progressId: progress.id,
                        srsStage: progress.srsStage,
                        question: vocabItem.writing,
                        answer: vocabItem.reading,
                        meaning: vocabItem.meaning,
                    });
                }
            } else if (progress.itemType === 'kanji') {
                const [kanjiItem] = await db.select()
                    .from(kanji)
                    .where(eq(kanji.id, progress.itemId));

                if (kanjiItem) {
                    const readings = [
                        ...(kanjiItem.kunyomi || []),
                        ...(kanjiItem.onyomi || []),
                    ];
                    reviewItems.push({
                        id: kanjiItem.id,
                        type: 'kanji',
                        progressId: progress.id,
                        srsStage: progress.srsStage,
                        question: kanjiItem.character,
                        answer: readings[0] || '',
                        meaning: kanjiItem.meanings.join(', '),
                        alternatives: readings.slice(1),
                    });
                }
            }
        }

        // Shuffle the items for variety
        const shuffled = reviewItems.sort(() => Math.random() - 0.5);

        return { items: shuffled };
    } catch (error: any) {
        console.error('Error fetching due reviews:', error);
        return { items: [], error: 'Failed to fetch reviews' };
    }
}

/**
 * Submit a single review result and update SRS data
 */
export async function submitReviewResult(
    progressId: number,
    isCorrect: boolean
): Promise<{ success: boolean; newStage: number; nextReview: Date; error?: string }> {
    try {
        const userId = await getUserId();

        // Get current progress
        const [progress] = await db.select()
            .from(userProgress)
            .where(
                and(
                    eq(userProgress.id, progressId),
                    eq(userProgress.userId, userId)
                )
            );

        if (!progress) {
            return { success: false, newStage: 0, nextReview: new Date(), error: 'Progress not found' };
        }

        // Calculate new SRS values
        const { newStage, nextReview } = calculateNextReview(progress.srsStage, isCorrect);

        // Update progress
        await db.update(userProgress)
            .set({
                srsStage: newStage,
                nextReview,
                lastReviewed: new Date(),
                correctCount: isCorrect ? progress.correctCount + 1 : progress.correctCount,
                incorrectCount: isCorrect ? progress.incorrectCount : progress.incorrectCount + 1,
                updatedAt: new Date(),
            })
            .where(eq(userProgress.id, progressId));

        return { success: true, newStage, nextReview };
    } catch (error: any) {
        console.error('Error submitting review:', error);
        return { success: false, newStage: 0, nextReview: new Date(), error: 'Failed to submit review' };
    }
}

/**
 * Complete a review session and award XP
 */
export async function completeReviewSession(
    correctCount: number,
    totalCount: number
): Promise<{ success: boolean; xpEarned: number; error?: string }> {
    try {
        const userId = await getUserId();

        // Calculate XP: 5 per review + 10 bonus for 100%
        const baseXp = totalCount * 5;
        const bonusXp = correctCount === totalCount ? 10 : 0;
        const xpEarned = baseXp + bonusXp;

        // Get current profile
        const [profile] = await db.select()
            .from(userProfiles)
            .where(eq(userProfiles.id, userId));

        if (profile) {
            // Check if this is a new study day for streak
            const today = new Date().toDateString();
            const lastStudy = profile.lastStudyDate ? new Date(profile.lastStudyDate).toDateString() : null;
            const yesterday = new Date(Date.now() - 86400000).toDateString();

            let newStreak = profile.studyStreak;
            if (lastStudy !== today) {
                if (lastStudy === yesterday) {
                    newStreak += 1;
                } else if (lastStudy !== today) {
                    newStreak = 1; // Reset streak if missed a day
                }
            }

            // Update profile
            await db.update(userProfiles)
                .set({
                    totalXp: profile.totalXp + xpEarned,
                    studyStreak: newStreak,
                    lastStudyDate: new Date(),
                    updatedAt: new Date(),
                })
                .where(eq(userProfiles.id, userId));
        }

        return { success: true, xpEarned };
    } catch (error: any) {
        console.error('Error completing review session:', error);
        return { success: false, xpEarned: 0, error: 'Failed to complete session' };
    }
}

/**
 * Get the next review time for the user
 */
export async function getNextReviewTime(): Promise<{ nextReview: Date | null; count: number }> {
    try {
        const userId = await getUserId();
        const now = new Date();

        // Get all future reviews
        const futureReviews = await db.select()
            .from(userProgress)
            .where(
                and(
                    eq(userProgress.userId, userId),
                    gt(userProgress.nextReview, now)
                )
            )
            .orderBy(userProgress.nextReview)
            .limit(1);

        if (futureReviews.length > 0) {
            // Count total items not yet due
            const allFuture = await db.select()
                .from(userProgress)
                .where(
                    and(
                        eq(userProgress.userId, userId),
                        gt(userProgress.nextReview, now)
                    )
                );

            return {
                nextReview: futureReviews[0].nextReview,
                count: allFuture.length
            };
        }

        return { nextReview: null, count: 0 };
    } catch (error) {
        console.error('Error getting next review time:', error);
        return { nextReview: null, count: 0 };
    }
}
