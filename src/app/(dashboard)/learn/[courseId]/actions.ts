'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { db } from '../../../../lib/db';
import { units, lessons, userProgress, userProfiles } from '../../../../lib/db/schema';
import { eq, and, lt, inArray } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

/**
 * Skip to a specific unit by marking all previous lessons as "completed"
 * This is a "Test Out" feature for users who already know the material.
 * 
 * In a production app, this would require passing a placement test.
 * For now, it's a simple "I know this" button.
 */
export async function skipToUnit(targetUnitId: number) {
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
        return { error: 'Not authenticated' };
    }

    try {
        // 1. Get the target unit to find its order and course
        const [targetUnit] = await db
            .select()
            .from(units)
            .where(eq(units.id, targetUnitId));

        if (!targetUnit) {
            return { error: 'Unit not found' };
        }

        // 2. Get all units with order < target unit (previous units)
        const previousUnits = await db
            .select()
            .from(units)
            .where(
                and(
                    eq(units.courseId, targetUnit.courseId),
                    lt(units.order, targetUnit.order)
                )
            );

        if (previousUnits.length === 0) {
            // No previous units - this is the first unit, already unlocked
            return { success: true, skippedLessons: 0 };
        }

        const previousUnitIds = previousUnits.map(u => u.id);

        // 3. Get all lessons from previous units
        const previousLessons = await db
            .select()
            .from(lessons)
            .where(inArray(lessons.unitId, previousUnitIds));

        if (previousLessons.length === 0) {
            return { success: true, skippedLessons: 0 };
        }

        // 4. Mark all previous lessons as completed in user_progress
        // For simplicity, we'll create vocabulary progress entries with SRS stage 1
        // This simulates the user having "learned" the material

        let progressCreated = 0;

        for (const lesson of previousLessons) {
            // Check if progress already exists
            const [existing] = await db
                .select()
                .from(userProgress)
                .where(
                    and(
                        eq(userProgress.userId, user.id),
                        eq(userProgress.itemType, 'lesson'),
                        eq(userProgress.itemId, lesson.id)
                    )
                );

            if (!existing) {
                // Create progress entry marking lesson as completed (SRS stage 1 = learned)
                await db.insert(userProgress).values({
                    userId: user.id,
                    itemType: 'lesson',
                    itemId: lesson.id,
                    srsStage: 1,
                    correctCount: 1,
                    incorrectCount: 0,
                    lastReviewed: new Date(),
                    nextReview: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day from now
                });
                progressCreated++;
            }
        }

        // 5. Award some XP for completing the test-out
        const xpAwarded = progressCreated * 5; // 5 XP per lesson skipped

        // Check if user profile exists
        const [existingProfile] = await db
            .select()
            .from(userProfiles)
            .where(eq(userProfiles.id, user.id));

        if (existingProfile) {
            // Update XP
            await db
                .update(userProfiles)
                .set({
                    totalXp: existingProfile.totalXp + xpAwarded,
                    updatedAt: new Date()
                })
                .where(eq(userProfiles.id, user.id));
        } else {
            // Create profile with XP
            await db.insert(userProfiles).values({
                id: user.id,
                email: user.email || '',
                displayName: 'Learner',
                totalXp: xpAwarded,
                studyStreak: 0,
                dailyGoal: 20,
            });
        }

        // 6. Revalidate the path to show updated UI
        revalidatePath('/learn');

        return {
            success: true,
            skippedLessons: progressCreated,
            xpAwarded,
            message: `Skipped ${progressCreated} lessons! You earned ${xpAwarded} XP.`
        };

    } catch (error) {
        console.error('Error in skipToUnit:', error);
        return { error: 'Failed to skip to unit' };
    }
}
