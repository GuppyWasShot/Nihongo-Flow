import { getDueReviewItems, getNextReviewTime } from './actions';
import { RotateCcw, Clock, Sparkles, Calendar, Filter, Zap, BookOpen, Target } from 'lucide-react';
import ReviewSession from './ReviewSession';
import ReviewLauncher from './ReviewLauncher';
import { PageHeader } from '../../../components/PageHeader';

export default async function ReviewPage() {
    const dueItemsResult = await getDueReviewItems();
    const hasDueItems = 'items' in dueItemsResult && dueItemsResult.items.length > 0;
    const dueCount = hasDueItems ? dueItemsResult.items.length : 0;

    // If no due items, get next review time
    let nextReviewInfo = null;
    if (!hasDueItems) {
        nextReviewInfo = await getNextReviewTime();
    }

    // Empty state - no reviews due
    if (!hasDueItems) {
        return (
            <div className="max-w-2xl mx-auto">
                <PageHeader
                    icon={RotateCcw}
                    title="Review"
                    description="Strengthen your memory with spaced repetition"
                />

                <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700/50 p-12 text-center shadow-sm">
                    <div className="flex justify-center mb-8">
                        <div className="flex items-center justify-center w-24 h-24 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-full">
                            <Sparkles className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
                        </div>
                    </div>

                    <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-3">
                        All Caught Up! 🎉
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                        You have no reviews due at the moment. Great job staying on top of your studies!
                    </p>

                    {nextReviewInfo && 'nextReview' in nextReviewInfo && nextReviewInfo.nextReview && (
                        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl p-6 border border-emerald-200/50 dark:border-emerald-700/50">
                            <div className="flex items-center justify-center gap-3 mb-3">
                                <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                <span className="font-medium text-slate-900 dark:text-slate-100">Next Review</span>
                            </div>
                            <p className="text-2xl font-semibold text-emerald-600 dark:text-emerald-400 mb-2">
                                {new Date(nextReviewInfo.nextReview).toLocaleDateString('en-US', {
                                    weekday: 'short',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: 'numeric',
                                    minute: '2-digit',
                                })}
                            </p>
                            {nextReviewInfo.count > 0 && (
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    {nextReviewInfo.count} items scheduled for review
                                </p>
                            )}
                        </div>
                    )}

                    {nextReviewInfo && 'count' in nextReviewInfo && nextReviewInfo.count === 0 && (
                        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-6">
                            <div className="flex items-center justify-center gap-3 mb-3">
                                <Calendar className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                                <span className="font-medium text-slate-900 dark:text-slate-100">No Scheduled Reviews</span>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Complete lessons to add items to your review queue.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Has due items - show launcher with session options
    return <ReviewLauncher items={dueItemsResult.items} />;
}
