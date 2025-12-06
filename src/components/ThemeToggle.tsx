'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';

/**
 * Theme toggle button that cycles through light/dark/system modes
 * Shows appropriate icon based on current theme
 */
export function ThemeToggle() {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme, resolvedTheme } = useTheme();

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <button
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800"
                aria-label="Toggle theme"
            >
                <div className="w-5 h-5" />
            </button>
        );
    }

    const cycleTheme = () => {
        if (theme === 'system') {
            setTheme('light');
        } else if (theme === 'light') {
            setTheme('dark');
        } else {
            setTheme('system');
        }
    };

    // Always show Sun/Moon based on the actual resolved theme (what the user sees)
    // This is clearer than showing a Monitor icon for system mode
    const getIcon = () => {
        return resolvedTheme === 'dark' ? (
            <Moon className="w-5 h-5" />
        ) : (
            <Sun className="w-5 h-5" />
        );
    };

    const getLabel = () => {
        if (theme === 'system') return 'System theme (click to switch)';
        return theme === 'dark' ? 'Dark mode' : 'Light mode';
    };

    return (
        <button
            onClick={cycleTheme}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 transition-all duration-200 hover:scale-105 active:scale-95"
            aria-label={getLabel()}
            title={getLabel()}
        >
            {getIcon()}
        </button>
    );
}

/**
 * Theme toggle with label for settings page
 */
export function ThemeToggleWithLabel() {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="flex items-center justify-between py-4">
                <div>
                    <p className="font-medium text-slate-900 dark:text-slate-100">Theme</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Choose your preferred theme</p>
                </div>
                <div className="w-36 h-11 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse" />
            </div>
        );
    }

    return (
        <div className="flex items-center justify-between py-4">
            <div>
                <p className="font-medium text-slate-900 dark:text-slate-100">Theme</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Choose your preferred theme</p>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
                <button
                    onClick={() => setTheme('light')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${theme === 'light'
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                        }`}
                    aria-label="Light mode"
                >
                    <Sun className="w-4 h-4" />
                </button>
                <button
                    onClick={() => setTheme('dark')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${theme === 'dark'
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                        }`}
                    aria-label="Dark mode"
                >
                    <Moon className="w-4 h-4" />
                </button>
                <button
                    onClick={() => setTheme('system')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${theme === 'system'
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                        }`}
                    aria-label="System theme"
                >
                    <Monitor className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
