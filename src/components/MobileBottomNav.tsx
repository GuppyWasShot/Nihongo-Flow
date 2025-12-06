'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, BookOpen, RotateCcw, User } from 'lucide-react';

const navItems = [
    { href: '/learn', icon: Home, label: 'Learn' },
    { href: '/library', icon: BookOpen, label: 'Library' },
    { href: '/review', icon: RotateCcw, label: 'Review' },
    { href: '/settings', icon: User, label: 'Profile' },
];

/**
 * Mobile bottom navigation bar
 * Fixed at bottom on mobile, hidden on desktop (lg:)
 */
export function MobileBottomNav() {
    const pathname = usePathname();

    // Hide during lesson/quiz sessions
    const isInLesson = pathname.includes('/lesson/');
    if (isInLesson) return null;

    const isActive = (href: string) => {
        if (href === '/learn') {
            return pathname === '/learn' || (pathname.startsWith('/learn/') && !pathname.includes('/lesson/'));
        }
        return pathname.startsWith(href);
    };

    return (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-t border-slate-200/80 dark:border-slate-800 transition-colors duration-200 safe-area-pb">
            <div className="flex items-center justify-around py-2 px-4">
                {navItems.map((item) => {
                    const active = isActive(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl min-w-[68px] transition-all duration-200 ${active
                                    ? 'text-emerald-600 dark:text-emerald-400'
                                    : 'text-slate-500 dark:text-slate-400 active:text-slate-700 dark:active:text-slate-300'
                                }`}
                        >
                            <item.icon
                                className={`w-6 h-6 ${active ? 'scale-110' : ''} transition-transform duration-200`}
                            />
                            <span className={`text-xs font-medium ${active ? 'font-semibold' : ''}`}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
