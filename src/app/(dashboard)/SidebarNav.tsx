'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, BookOpen, RotateCcw, Settings } from 'lucide-react';

const navItems = [
    { href: '/learn', icon: Home, label: 'Dashboard' },
    { href: '/library', icon: BookOpen, label: 'Library' },
    { href: '/review', icon: RotateCcw, label: 'Review' },
    { href: '/settings', icon: Settings, label: 'Settings' },
];

/**
 * Sidebar navigation with active state highlighting
 * Client component to use usePathname for current route detection
 */
export function SidebarNav() {
    const pathname = usePathname();

    const isActive = (href: string) => {
        if (href === '/learn') {
            return pathname === '/learn' || pathname.startsWith('/learn/');
        }
        return pathname.startsWith(href);
    };

    return (
        <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${active
                                ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
                            }`}
                    >
                        <item.icon
                            className={`w-5 h-5 transition-colors ${active
                                    ? 'text-indigo-600 dark:text-indigo-400'
                                    : 'group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
                                }`}
                        />
                        <span className="font-medium">{item.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
}
