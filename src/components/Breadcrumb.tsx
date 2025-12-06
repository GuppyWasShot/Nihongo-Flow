import { ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

/**
 * Breadcrumb navigation component
 * 
 * @param items - Array of breadcrumb items with label and optional href
 * Last item is treated as current page (no link)
 * 
 * @example
 * <Breadcrumb items={[
 *   { label: 'Dashboard', href: '/learn' },
 *   { label: 'N5 Course', href: '/learn/n5' },
 *   { label: 'Unit 1' }
 * ]} />
 */
export function Breadcrumb({ items }: BreadcrumbProps) {
    return (
        <nav className="flex items-center gap-2 text-sm mb-6" aria-label="Breadcrumb">
            <Link
                href="/learn"
                className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Dashboard</span>
            </Link>

            {items.map((item, index) => {
                const isLast = index === items.length - 1;

                return (
                    <div key={index} className="flex items-center gap-2">
                        <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                        {isLast || !item.href ? (
                            <span className="text-gray-900 dark:text-gray-100 font-medium truncate max-w-[150px] sm:max-w-none">
                                {item.label}
                            </span>
                        ) : (
                            <Link
                                href={item.href}
                                className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors truncate max-w-[100px] sm:max-w-none"
                            >
                                {item.label}
                            </Link>
                        )}
                    </div>
                );
            })}
        </nav>
    );
}
