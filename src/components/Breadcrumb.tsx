import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

/**
 * Breadcrumb navigation component
 * Shows hierarchical navigation path with clickable links
 */
export function Breadcrumb({ items }: BreadcrumbProps) {
    return (
        <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-sm">
                <li>
                    <Link
                        href="/learn"
                        className="flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                    >
                        <Home className="w-4 h-4" />
                    </Link>
                </li>
                {items.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                        <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                        {item.href ? (
                            <Link
                                href={item.href}
                                className="text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span className="text-slate-900 dark:text-slate-100 font-medium">
                                {item.label}
                            </span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
