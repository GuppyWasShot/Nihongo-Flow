import { RotateCcw, Clock, Sparkles } from 'lucide-react';
import { getDueReviewItems, getNextReviewTime } from './actions';
import { PageHeader } from '../../../components/PageHeader';
import ReviewSession from './ReviewSession';

export default async function ReviewPage() {
    const { items, error } = await getDueReviewItems();
    const { nextReview, count } = await getNextReviewTime();

    // Format next review time
    const formatNextReview = (date: Date | null) => {
        if (!date) return null;

        const now = new Date();
        const diff = date.getTime() - now.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        if (hours > 24) {
            const days = Math.floor(hours / 24);
            return `${days} day${days !== 1 ? 's' : ''}`;
        }
        if (hours > 0) {
            return `${hours} hour${hours !== 1 ? 's' : ''}`;
        }
        return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    };

    // If there are items to review, show the review session
    if (items.length > 0) {
        return <ReviewSession initialItems={items} />;
    }

    // Empty state - no reviews due
    return (
        <div className="max-w-4xl mx-auto">
            <PageHeader
                icon={RotateCcw}
                title="Review"
                description="Practice items you've learned to strengthen your memory"
            />

            <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-12 text-center transition-colors duration-200">
                <div className="flex justify-center mb-6">
                    <div className="flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-full">
                        <Sparkles className="w-12 h-12 text-green-500 dark:text-green-400" />
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                    All caught up!
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                    You don't have any reviews due right now. Keep learning new items or check back later!
                </p>

                {nextReview && (
                    <div className="inline-flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 border border-indigo-200 dark:border-indigo-700 rounded-xl">
                        <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        <div className="text-left">
                            <p className="text-sm font-medium text-indigo-900 dark:text-indigo-300">
                                Next review in {formatNextReview(nextReview)}
                            </p>
                            <p className="text-xs text-indigo-700 dark:text-indigo-400">
                                {count} item{count !== 1 ? 's' : ''} waiting
                            </p>
                        </div>
                    </div>
                )}

                {!nextReview && (
                    <div className="inline-flex items-center gap-3 px-6 py-4 bg-gray-100 dark:bg-gray-700 rounded-xl">
                        <p className="text-gray-600 dark:text-gray-400">
                            Complete some lessons to add items to your review queue
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
