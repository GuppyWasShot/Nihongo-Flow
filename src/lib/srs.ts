/**
 * Spaced Repetition System (SRS) Algorithm
 * 
 * Implements a simplified SM-2 algorithm for optimal learning intervals.
 * Based on the SuperMemo 2 algorithm with modifications for Japanese learning.
 */

/**
 * SRS Stage Intervals
 * 
 * Each stage represents how long to wait before the next review:
 * - Stage 0: New item (review immediately)
 * - Stage 1: 4 hours
 * - Stage 2: 8 hours  
 * - Stage 3: 1 day
 * - Stage 4: 3 days
 * - Stage 5: 1 week
 * - Stage 6: 2 weeks
 * - Stage 7: 1 month
 * - Stage 8: 4 months (graduated)
 */
export const SRS_INTERVALS = [
    0,           // Stage 0: New (0 hours)
    4,           // Stage 1: 4 hours
    8,           // Stage 2: 8 hours
    24,          // Stage 3: 1 day
    72,          // Stage 4: 3 days
    168,         // Stage 5: 7 days (1 week)
    336,         // Stage 6: 14 days (2 weeks)
    720,         // Stage 7: 30 days (1 month)
    2880,        // Stage 8: 120 days (4 months)
] as const;

/**
 * Maximum SRS stage (graduated/mastered)
 */
export const MAX_SRS_STAGE = SRS_INTERVALS.length - 1;

/**
 * Minimum SRS stage (new item)
 */
export const MIN_SRS_STAGE = 0;

/**
 * Calculate the next review date and SRS stage based on user performance
 * 
 * @param currentStage - Current SRS stage (0-8)
 * @param isCorrect - Whether the user answered correctly
 * @returns Object containing the new stage and next review date
 * 
 * @example
 * const { newStage, nextReview } = calculateNextReview(2, true);
 * // newStage: 3, nextReview: Date (24 hours from now)
 */
export function calculateNextReview(
    currentStage: number,
    isCorrect: boolean
): {
    newStage: number;
    nextReview: Date;
} {
    let newStage: number;

    if (isCorrect) {
        // Correct answer: Move to next stage
        newStage = Math.min(currentStage + 1, MAX_SRS_STAGE);
    } else {
        // Incorrect answer: Demote by 2 stages (but not below 0)
        newStage = Math.max(currentStage - 2, MIN_SRS_STAGE);
    }

    // Calculate the next review date
    const hoursUntilNextReview = SRS_INTERVALS[newStage];
    const nextReview = new Date();
    nextReview.setHours(nextReview.getHours() + hoursUntilNextReview);

    return {
        newStage,
        nextReview,
    };
}

/**
 * Get a human-readable description of the SRS interval
 * 
 * @param stage - SRS stage (0-8)
 * @returns Human-readable interval string
 * 
 * @example
 * getIntervalDescription(3); // "1 day"
 * getIntervalDescription(5); // "1 week"
 */
export function getIntervalDescription(stage: number): string {
    const hours = SRS_INTERVALS[stage];

    if (hours === 0) return 'Now';
    if (hours < 24) {
        return hours === 4 ? '4 hours' : hours === 8 ? '8 hours' : `${hours} hours`;
    }

    const days = hours / 24;
    if (days < 7) return `${days}  day${days !== 1 ? 's' : ''}`;

    const weeks = days / 7;
    if (weeks < 4) return `${weeks} week${weeks !== 1 ? 's' : ''}`;

    const months = Math.round(days / 30);
    return `${months} month${months !== 1 ? 's' : ''}`;
}

/**
 * Check if an item is due for review
 * 
 * @param nextReview - The scheduled next review date
 * @returns Whether the item is due for review
 * 
 * @example
 * const dueDate = new Date('2024-01-01');
 * isDue(dueDate); // true if current date is >= 2024-01-01
 */
export function isDue(nextReview: Date): boolean {
    return new Date() >= nextReview;
}

/**
 * Get all items due for review from a list of progress items
 * 
 * @param progressItems - Array of user progress items with nextReview dates
 * @returns Filtered array of items due for review
 */
export function getDueItems<T extends { nextReview: Date | null }>(
    progressItems: T[]
): T[] {
    const now = new Date();
    return progressItems.filter(item => {
        if (!item.nextReview) return true; // New items
        return new Date(item.nextReview) <= now;
    });
}

/**
 * Calculate retention percentage based on correct/incorrect counts
 * 
 * @param correctCount - Number of correct answers
 * @param incorrectCount - Number of incorrect answers
 * @returns Retention percentage (0-100)
 */
export function calculateRetention(
    correctCount: number,
    incorrectCount: number
): number {
    const total = correctCount + incorrectCount;
    if (total === 0) return 0;
    return Math.round((correctCount / total) * 100);
}
