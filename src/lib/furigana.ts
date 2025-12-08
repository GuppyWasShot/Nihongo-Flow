/**
 * Smart Furigana Utility
 * 
 * Provides functions to detect kanji and render furigana only above kanji characters,
 * leaving hiragana/katakana unchanged.
 */

// Unicode ranges for Japanese character types
const KANJI_RANGE = /[\u4E00-\u9FAF\u3400-\u4DBF]/;
const HIRAGANA_RANGE = /[\u3040-\u309F]/;
const KATAKANA_RANGE = /[\u30A0-\u30FF]/;

/**
 * Check if a character is kanji
 */
export function isKanji(char: string): boolean {
    return KANJI_RANGE.test(char);
}

/**
 * Check if a character is hiragana
 */
export function isHiragana(char: string): boolean {
    return HIRAGANA_RANGE.test(char);
}

/**
 * Check if a character is katakana
 */
export function isKatakana(char: string): boolean {
    return KATAKANA_RANGE.test(char);
}

/**
 * Check if a character is any Japanese character (kana or kanji)
 */
export function isJapanese(char: string): boolean {
    return isKanji(char) || isHiragana(char) || isKatakana(char);
}

/**
 * Count kanji in a string
 */
export function countKanji(text: string): number {
    return [...text].filter(isKanji).length;
}

/**
 * Check if text contains any kanji
 */
export function hasKanji(text: string): boolean {
    return countKanji(text) > 0;
}

/**
 * Segment text into groups of consecutive kanji and non-kanji characters
 * 
 * Example: "私は学生です" -> [
 *   { text: "私", isKanji: true, kanjiCount: 1 },
 *   { text: "は", isKanji: false, kanjiCount: 0 },
 *   { text: "学生", isKanji: true, kanjiCount: 2 },
 *   { text: "です", isKanji: false, kanjiCount: 0 }
 * ]
 */
export interface TextSegment {
    text: string;
    isKanji: boolean;
    kanjiCount: number;
}

export function segmentText(text: string): TextSegment[] {
    if (!text) return [];

    const segments: TextSegment[] = [];
    let currentSegment = '';
    let currentIsKanji = isKanji(text[0]);

    for (const char of text) {
        const charIsKanji = isKanji(char);

        if (charIsKanji === currentIsKanji) {
            currentSegment += char;
        } else {
            // Push current segment and start new one
            if (currentSegment) {
                segments.push({
                    text: currentSegment,
                    isKanji: currentIsKanji,
                    kanjiCount: currentIsKanji ? currentSegment.length : 0,
                });
            }
            currentSegment = char;
            currentIsKanji = charIsKanji;
        }
    }

    // Push final segment
    if (currentSegment) {
        segments.push({
            text: currentSegment,
            isKanji: currentIsKanji,
            kanjiCount: currentIsKanji ? currentSegment.length : 0,
        });
    }

    return segments;
}

/**
 * Parse text and reading into aligned segments with furigana
 * 
 * This attempts to match kanji segments with their corresponding reading.
 * 
 * Example: 
 *   text: "私は学生です"
 *   reading: "わたしはがくせいです"
 * 
 * Returns segments with reading only for kanji portions
 */
export interface FuriganaSegment {
    text: string;
    reading?: string; // Only set for kanji segments
}

export function parseFurigana(text: string, reading: string): FuriganaSegment[] {
    if (!text || !reading) return [{ text: text || '' }];

    // If no kanji, just return the text as-is (no furigana needed)
    if (!hasKanji(text)) {
        return [{ text }];
    }

    // Simple approach: if the text and reading are the same length, no furigana needed
    if (text === reading) {
        return [{ text }];
    }

    const segments = segmentText(text);
    const result: FuriganaSegment[] = [];

    let readingIndex = 0;

    for (const segment of segments) {
        if (segment.isKanji) {
            // Find where this kanji's reading ends by looking for the next non-kanji text
            // in the original reading
            const segmentIndex = segments.indexOf(segment);
            const nextNonKanjiSegment = segments[segmentIndex + 1];

            let kanjiReading = '';

            if (nextNonKanjiSegment) {
                // Find where the next non-kanji text appears in the reading
                const nextTextInReading = reading.indexOf(nextNonKanjiSegment.text, readingIndex);

                if (nextTextInReading > readingIndex) {
                    kanjiReading = reading.slice(readingIndex, nextTextInReading);
                    readingIndex = nextTextInReading;
                } else {
                    // Can't find a match, just estimate based on typical kanji reading length
                    kanjiReading = reading.slice(readingIndex, readingIndex + segment.kanjiCount * 2);
                    readingIndex += segment.kanjiCount * 2;
                }
            } else {
                // This is the last segment, take the rest of the reading
                kanjiReading = reading.slice(readingIndex);
                readingIndex = reading.length;
            }

            result.push({
                text: segment.text,
                reading: kanjiReading,
            });
        } else {
            // Non-kanji segment: advance reading index and add without furigana
            readingIndex += segment.text.length;
            result.push({
                text: segment.text,
                // No reading property means no furigana will be shown
            });
        }
    }

    return result;
}
