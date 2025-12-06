import Link from 'next/link';
import { ChevronRight, LucideIcon } from 'lucide-react';
import { Breadcrumb } from './Breadcrumb';

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface PageHeaderProps {
    icon?: LucideIcon;
    title: string;
    description?: string;
    breadcrumbs?: BreadcrumbItem[];
    action?: React.ReactNode;
}

/**
 * Consistent page header with icon, title, description, and optional action
 * Can include breadcrumb navigation when breadcrumbs prop is provided
 */
export function PageHeader({
    icon: Icon,
    title,
    description,
    breadcrumbs,
    action,
}: PageHeaderProps) {
    return (
        <div className="mb-10">
            {breadcrumbs && <Breadcrumb items={breadcrumbs} />}

            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                    {Icon && (
                        <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl shadow-sm">
                            <Icon className="w-7 h-7 text-white" />
                        </div>
                    )}
                    <div>
                        <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">
                            {title}
                        </h1>
                        {description && (
                            <p className="text-slate-600 dark:text-slate-400 mt-1">
                                {description}
                            </p>
                        )}
                    </div>
                </div>

                {action && <div className="flex-shrink-0">{action}</div>}
            </div>
        </div>
    );
}
