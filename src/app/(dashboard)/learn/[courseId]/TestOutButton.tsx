'use client';

import { useState } from 'react';
import { FastForward, Loader2 } from 'lucide-react';
import { skipToUnit } from './actions';

interface TestOutButtonProps {
    unitId: number;
    unitTitle: string;
}

/**
 * Button that allows users to "Test Out" / skip to a unit
 * Shows a confirmation before skipping
 */
export function TestOutButton({ unitId, unitTitle }: TestOutButtonProps) {
    const [isConfirming, setIsConfirming] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<{ success?: boolean; message?: string; error?: string } | null>(null);

    const handleClick = () => {
        setIsConfirming(true);
    };

    const handleCancel = () => {
        setIsConfirming(false);
    };

    const handleConfirm = async () => {
        setIsLoading(true);
        try {
            const response = await skipToUnit(unitId);
            setResult(response);

            if ('success' in response && response.success) {
                // Refresh page after a brief delay to show success
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            }
        } catch {
            setResult({ error: 'Something went wrong' });
        } finally {
            setIsLoading(false);
        }
    };

    // Show result message
    if (result) {
        if ('success' in result && result.success) {
            return (
                <div className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                    ✓ {result.message || 'Unlocked!'}
                </div>
            );
        }
        if ('error' in result) {
            return (
                <div className="text-sm text-rose-600 dark:text-rose-400">
                    {result.error}
                </div>
            );
        }
    }

    // Show confirmation dialog
    if (isConfirming) {
        return (
            <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                    Skip to this unit?
                </span>
                <button
                    onClick={handleConfirm}
                    disabled={isLoading}
                    className="px-3 py-1.5 text-xs font-medium bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 flex items-center gap-1"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-3 h-3 animate-spin" />
                            Skipping...
                        </>
                    ) : (
                        'Yes, Skip'
                    )}
                </button>
                <button
                    onClick={handleCancel}
                    disabled={isLoading}
                    className="px-3 py-1.5 text-xs font-medium bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors disabled:opacity-50"
                >
                    Cancel
                </button>
            </div>
        );
    }

    // Default: show "Test Out" button
    return (
        <button
            onClick={handleClick}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors border border-amber-200 dark:border-amber-700/50"
            title="Skip ahead if you already know this material"
        >
            <FastForward className="w-3.5 h-3.5" />
            Test Out
        </button>
    );
}
