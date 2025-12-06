import { LucideIcon } from 'lucide-react';
import { Breadcrumb } from './Breadcrumb';

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface PageHeaderProps {
    title: string;
    description?: string;
    icon: LucideIcon;
    breadcrumbs?: BreadcrumbItem[];
    children?: React.ReactNode;
}

/**
 * Consistent page header component with icon, title, description,
 * optional breadcrumbs, and optional action slot
 * 
 * @example
 * <PageHeader 
 *   icon={BookOpen}
 *   title="Study Library"
 *   description="Browse and review kanji and vocabulary"
 *   breadcrumbs={[{ label: 'Library' }]}
 * >
 *   <ActionButton />
 * </PageHeader>
 */
export function PageHeader({
    title,
    description,
    icon: Icon,
    breadcrumbs,
    children
}: PageHeaderProps) {
    return (
        <div className="mb-8">
            {breadcrumbs && breadcrumbs.length > 0 && (
                <Breadcrumb items={breadcrumbs} />
            )}

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl">
                        <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                            {title}
                        </h1>
                        {description && (
                            <p className="text-gray-600 dark:text-gray-400">
                                {description}
                            </p>
                        )}
                    </div>
                </div>

                {children && (
                    <div className="flex items-center gap-3">
                        {children}
                    </div>
                )}
            </div>
        </div>
    );
}
