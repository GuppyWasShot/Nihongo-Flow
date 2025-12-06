'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { useFuriganaStore } from '../../stores/furigana';

interface FuriganaToggleProps {
    /** Lesson type - toggle is disabled for kanji_practice */
    lessonType?: string;
    /** Whether we're in an exam context */
    isExam?: boolean;
    /** JLPT level for this lesson */
    jlptLevel?: 'N5' | 'N4' | 'N3';
}

/**
 * Toggle button for furigana visibility in lesson header
 * 
 * - Shows eye icon with furigana status
 * - Disabled during kanji drills (where reading IS the test)
 * - Disabled during exams
 * - Shows toast when toggling off
 */
export function FuriganaToggle({ lessonType, isExam, jlptLevel }: FuriganaToggleProps) {
    const {
        showFurigana,
        toggleFurigana,
        isDisabled,
        setDisabled,
        setJlptLevel,
        toastMessage,
        clearToast,
    } = useFuriganaStore();

    // Set JLPT level on mount
    useEffect(() => {
        if (jlptLevel) {
            setJlptLevel(jlptLevel);
        }
    }, [jlptLevel, setJlptLevel]);

    // Set disabled state based on lesson type
    useEffect(() => {
        if (lessonType === 'kanji_practice' || lessonType === 'kanji') {
            setDisabled(true, 'Disabled during kanji practice');
        } else if (isExam) {
            setDisabled(true, 'Disabled during exams');
        } else {
            setDisabled(false);
        }
    }, [lessonType, isExam, setDisabled]);

    // Auto-clear toast after 3 seconds
    useEffect(() => {
        if (toastMessage) {
            const timer = setTimeout(() => {
                clearToast();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [toastMessage, clearToast]);

    const handleClick = () => {
        if (!isDisabled) {
            toggleFurigana();
        }
    };

    return (
        <div className="relative">
            {/* Toggle Button */}
            <button
                onClick={handleClick}
                disabled={isDisabled}
                className={`
                    flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium
                    transition-all duration-200
                    ${isDisabled
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                        : showFurigana
                            ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/50'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }
                `}
                title={isDisabled ? 'Furigana disabled for this lesson type' : (showFurigana ? 'Hide furigana' : 'Show furigana')}
            >
                {showFurigana ? (
                    <Eye className="w-4 h-4" />
                ) : (
                    <EyeOff className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">
                    {showFurigana ? 'ふりがな ON' : 'ふりがな OFF'}
                </span>
            </button>

            {/* Toast Notification */}
            <AnimatePresence>
                {toastMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="absolute top-full right-0 mt-2 z-50"
                    >
                        <div className="bg-amber-50 dark:bg-amber-900/80 border border-amber-200 dark:border-amber-700 text-amber-800 dark:text-amber-200 text-sm px-4 py-2.5 rounded-xl shadow-lg whitespace-nowrap backdrop-blur-sm">
                            💡 {toastMessage}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

/**
 * Hook to get furigana-wrapped text
 * Returns the original text if furigana is off, or wrapped text if on
 */
export function useFurigana() {
    const { showFurigana, isDisabled } = useFuriganaStore();

    // If disabled (kanji practice), never show furigana
    const shouldShowFurigana = !isDisabled && showFurigana;

    return { showFurigana: shouldShowFurigana };
}
