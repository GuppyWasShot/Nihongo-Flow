interface SkeletonProps {
    className?: string;
}

/**
 * Basic skeleton loading component with pulse animation
 */
export function Skeleton({ className = '' }: SkeletonProps) {
    return (
        <div
            className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`}
        />
    );
}

/**
 * Skeleton for text content
 */
export function SkeletonText({ className = '', lines = 1 }: SkeletonProps & { lines?: number }) {
    return (
        <div className={`space-y-2 ${className}`}>
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton
                    key={i}
                    className={`h-4 ${i === lines - 1 ? 'w-3/4' : 'w-full'}`}
                />
            ))}
        </div>
    );
}

/**
 * Skeleton for card layouts
 */
export function SkeletonCard({ className = '' }: SkeletonProps) {
    return (
        <div className={`bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-6 ${className}`}>
            <div className="flex items-center gap-4 mb-4">
                <Skeleton className="w-14 h-14 rounded-xl" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
            </div>
            <SkeletonText lines={2} />
            <Skeleton className="h-3 w-full mt-4 rounded-full" />
        </div>
    );
}

/**
 * Skeleton for kanji/vocabulary grid items
 */
export function SkeletonGridItem({ className = '' }: SkeletonProps) {
    return (
        <div className={`bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 p-4 ${className}`}>
            <Skeleton className="w-12 h-12 mb-2" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-3 w-2/3" />
        </div>
    );
}

/**
 * Skeleton for stats cards
 */
export function SkeletonStats({ count = 3 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-6"
                >
                    <div className="flex items-center gap-4">
                        <Skeleton className="w-12 h-12 rounded-xl" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-8 w-16" />
                            <Skeleton className="h-4 w-20" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
