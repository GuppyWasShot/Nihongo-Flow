'use client';

import { parseFurigana, hasKanji } from '../../lib/furigana';
import { useFurigana } from './FuriganaToggle';

interface SmartFuriganaProps {
    /** The Japanese text (may contain kanji and kana) */
    text: string;
    /** The full hiragana reading of the text */
    reading?: string;
    /** Optional CSS class for the wrapper */
    className?: string;
}

/**
 * Smart Furigana Component
 * 
 * Renders Japanese text with furigana (reading guides) only above kanji characters.
 * Hiragana and katakana are shown without furigana to avoid redundancy.
 * 
 * Uses the furigana parsing utility to align readings with kanji segments.
 */
export function SmartFurigana({ text, reading, className = '' }: SmartFuriganaProps) {
    const { showFurigana } = useFurigana();

    // If furigana is disabled, no reading provided, or no kanji in text, just show text
    if (!showFurigana || !reading || !hasKanji(text)) {
        return <span className={className}>{text}</span>;
    }

    // Parse text into segments with aligned readings
    const segments = parseFurigana(text, reading);

    return (
        <span className={className}>
            {segments.map((segment, idx) => {
                if (segment.reading) {
                    // Kanji segment - show with furigana
                    return (
                        <ruby key={idx} className="ruby-text">
                            {segment.text}
                            <rp>(</rp>
                            <rt className="text-xs text-slate-500 dark:text-slate-400">
                                {segment.reading}
                            </rt>
                            <rp>)</rp>
                        </ruby>
                    );
                } else {
                    // Non-kanji segment - show without furigana
                    return <span key={idx}>{segment.text}</span>;
                }
            })}
        </span>
    );
}

/**
 * Standalone version (doesn't use furigana toggle state)
 * Always shows furigana above kanji when reading is provided
 */
export function StaticFurigana({ text, reading, className = '' }: SmartFuriganaProps) {
    // If no reading provided or no kanji in text, just show text
    if (!reading || !hasKanji(text)) {
        return <span className={className}>{text}</span>;
    }

    // Parse text into segments with aligned readings
    const segments = parseFurigana(text, reading);

    return (
        <span className={className}>
            {segments.map((segment, idx) => {
                if (segment.reading) {
                    // Kanji segment - show with furigana
                    return (
                        <ruby key={idx} className="ruby-text">
                            {segment.text}
                            <rp>(</rp>
                            <rt className="text-xs text-slate-500 dark:text-slate-400">
                                {segment.reading}
                            </rt>
                            <rp>)</rp>
                        </ruby>
                    );
                } else {
                    // Non-kanji segment - show without furigana
                    return <span key={idx}>{segment.text}</span>;
                }
            })}
        </span>
    );
}

export default SmartFurigana;
