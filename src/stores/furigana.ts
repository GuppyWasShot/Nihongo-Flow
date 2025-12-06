/**
 * Furigana Store - Global state for furigana visibility
 * 
 * Controls whether furigana (reading aids) are shown in lessons.
 * Default rules:
 * - N5 content: Furigana ON by default
 * - N4/N3 content: Furigana OFF by default
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FuriganaState {
    // Current visibility state
    showFurigana: boolean;
    // Current JLPT level (affects default)
    jlptLevel: 'N5' | 'N4' | 'N3' | null;
    // Whether toggle is disabled (during kanji drills/exams)
    isDisabled: boolean;
    // Reason for being disabled
    disabledReason: string | null;
    // Toast message to show
    toastMessage: string | null;

    // Actions
    setShowFurigana: (show: boolean) => void;
    toggleFurigana: () => void;
    setJlptLevel: (level: 'N5' | 'N4' | 'N3' | null) => void;
    setDisabled: (disabled: boolean, reason?: string) => void;
    clearToast: () => void;
}

/**
 * Get default furigana state based on JLPT level
 */
const getDefaultForLevel = (level: 'N5' | 'N4' | 'N3' | null): boolean => {
    if (level === 'N5') return true;  // Beginners need furigana
    return false;  // N4/N3 should practice without
};

export const useFuriganaStore = create<FuriganaState>()(
    persist(
        (set, get) => ({
            showFurigana: true,
            jlptLevel: null,
            isDisabled: false,
            disabledReason: null,
            toastMessage: null,

            setShowFurigana: (show: boolean) => {
                const message = show
                    ? null
                    : 'Hiding furigana helps memory retention!';
                set({ showFurigana: show, toastMessage: message });
            },

            toggleFurigana: () => {
                const current = get().showFurigana;
                const message = current
                    ? 'Hiding furigana helps memory retention!'
                    : null;
                set({ showFurigana: !current, toastMessage: message });
            },

            setJlptLevel: (level: 'N5' | 'N4' | 'N3' | null) => {
                const defaultValue = getDefaultForLevel(level);
                set({ jlptLevel: level, showFurigana: defaultValue });
            },

            setDisabled: (disabled: boolean, reason?: string) => {
                set({
                    isDisabled: disabled,
                    disabledReason: reason || null,
                });
            },

            clearToast: () => {
                set({ toastMessage: null });
            },
        }),
        {
            name: 'nihongo-furigana-settings',
            partialize: (state) => ({
                showFurigana: state.showFurigana,
            }),
        }
    )
);
