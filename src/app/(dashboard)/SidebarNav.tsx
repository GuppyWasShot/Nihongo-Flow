'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, BookOpen, RotateCcw, Settings, FileText } from 'lucide-react';

const navItems = [
    { href: '/learn', icon: Home, label: 'Dashboard' },
    { href: '/library', icon: BookOpen, label: 'Library' },
    { href: '/review', icon: RotateCcw, label: 'Review' },
    { href: '/exam', icon: FileText, label: 'Exams' },
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
        <nav className="flex-1 px-4 py-6 space-y-1.5">
            {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${active
                            ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                            }`}
                    >
                        <item.icon
                            className={`w-5 h-5 transition-colors ${active
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'group-hover:text-emerald-600 dark:group-hover:text-emerald-400'
                                }`}
                        />
                        <span className="font-medium">{item.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
}
