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
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800"
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

    const getIcon = () => {
        if (theme === 'system') {
            return <Monitor className="w-5 h-5" />;
        }
        return resolvedTheme === 'dark' ? (
            <Moon className="w-5 h-5" />
        ) : (
            <Sun className="w-5 h-5" />
        );
    };

    const getLabel = () => {
        if (theme === 'system') return 'System theme';
        return theme === 'dark' ? 'Dark mode' : 'Light mode';
    };

    return (
        <button
            onClick={cycleTheme}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors duration-200"
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
            <div className="flex items-center justify-between py-3">
                <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Theme</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Choose your preferred theme</p>
                </div>
                <div className="w-32 h-10 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
            </div>
        );
    }

    return (
        <div className="flex items-center justify-between py-3">
            <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">Theme</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Choose your preferred theme</p>
            </div>
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
                <button
                    onClick={() => setTheme('light')}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${theme === 'light'
                            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                        }`}
                >
                    <Sun className="w-4 h-4" />
                </button>
                <button
                    onClick={() => setTheme('dark')}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${theme === 'dark'
                            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                        }`}
                >
                    <Moon className="w-4 h-4" />
                </button>
                <button
                    onClick={() => setTheme('system')}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${theme === 'system'
                            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                        }`}
                >
                    <Monitor className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
