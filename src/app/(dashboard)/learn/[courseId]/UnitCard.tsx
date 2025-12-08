'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronDown, Lock, CheckCircle, Play, Book,
    MessageSquareText, Target, Sparkles, Languages
} from 'lucide-react';
import { TestOutButton } from './TestOutButton';

interface Lesson {
    id: number;
    title: string;
    type: string;
}

interface LessonPhase {
    name: string;
    icon: React.ReactNode;
    lessons: Lesson[];
    status: 'locked' | 'ready' | 'completed';
    description: string;
}

interface UnitCardProps {
    unit: {
        id: number;
        title: string;
        description: string | null;
        isUnlocked: boolean;
        isComplete: boolean;
        completedLessons: number;
        totalLessons: number;
    };
    unitIdx: number;
    courseId: string;
    lessons: Lesson[];
    completedLessonIds: number[];
    /** ID of the unit that should be expanded by default */
    activeUnitId?: number;
}

// Categorize lessons into phases
function categorizeLessons(lessons: Lesson[], completedIds: Set<number>): LessonPhase[] {
    const vocabLessons = lessons.filter(l =>
        l.type === 'vocab_drill' || l.title.toLowerCase().includes('vocab')
    );
    const grammarLessons = lessons.filter(l =>
        l.type === 'theory' || l.type === 'grammar' || l.type === 'grammar_drill'
    );
    const practiceLessons = lessons.filter(l =>
        l.type === 'mixed' || l.title.toLowerCase().includes('practice') || l.title.toLowerCase().includes('review')
    );
    const kanjiLessons = lessons.filter(l =>
        l.type === 'kanji_practice' || l.type === 'kanji'
    );

    // Calculate phase status
    const vocabComplete = vocabLessons.length > 0 && vocabLessons.every(l => completedIds.has(l.id));
    const grammarComplete = grammarLessons.length > 0 && grammarLessons.every(l => completedIds.has(l.id));
    const practiceComplete = practiceLessons.length > 0 && practiceLessons.every(l => completedIds.has(l.id));

    return [
        {
            name: 'Vocabulary',
            icon: <Book className="w-4 h-4" />,
            lessons: vocabLessons,
            status: (vocabComplete ? 'completed' : 'ready') as 'locked' | 'ready' | 'completed',
            description: 'Learn new words',
        },
        {
            name: 'Grammar',
            icon: <MessageSquareText className="w-4 h-4" />,
            lessons: grammarLessons,
            status: (grammarComplete ? 'completed' : vocabComplete ? 'ready' : 'locked') as 'locked' | 'ready' | 'completed',
            description: 'Master the patterns',
        },
        {
            name: 'Practice',
            icon: <Target className="w-4 h-4" />,
            lessons: practiceLessons.length > 0 ? practiceLessons : [{ id: -1, title: 'Unit Practice', type: 'mixed' }],
            status: (practiceComplete ? 'completed' : (vocabComplete && grammarComplete) ? 'ready' : 'locked') as 'locked' | 'ready' | 'completed',
            description: 'Test your skills',
        },
    ].filter(phase => phase.lessons.length > 0 || phase.name === 'Practice');
}

// Get kanji lessons for sidebar
function getKanjiLessons(lessons: Lesson[]): Lesson[] {
    return lessons.filter(l =>
        l.type === 'kanji_practice' || l.type === 'kanji'
    );
}

export function UnitCard({ unit, unitIdx, courseId, lessons, completedLessonIds, activeUnitId }: UnitCardProps) {
    // Determine initial expansion: use activeUnitId, fallback to first incomplete unit
    const shouldBeExpanded = activeUnitId !== undefined
        ? unit.id === activeUnitId
        : (unit.isUnlocked && !unit.isComplete && unitIdx === 0);

    const [isExpanded, setIsExpanded] = useState(shouldBeExpanded);
    const completedSet = new Set(completedLessonIds);

    // Sync with activeUnitId changes (when navigating back from lesson)
    useEffect(() => {
        if (activeUnitId !== undefined) {
            setIsExpanded(unit.id === activeUnitId);
        }
    }, [activeUnitId, unit.id]);

    // Save expansion state to localStorage
    const handleToggle = () => {
        if (!unit.isUnlocked) return;
        const newState = !isExpanded;
        setIsExpanded(newState);
        if (newState) {
            localStorage.setItem(`nihongo-flow-expanded-unit-${courseId}`, String(unit.id));
        }
    };

    const phases = categorizeLessons(lessons, completedSet);
    const kanjiLessons = getKanjiLessons(lessons);

    const getStatusColor = (status: 'locked' | 'ready' | 'completed') => {
        switch (status) {
            case 'completed':
                return 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-700';
            case 'ready':
                return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-700';
            case 'locked':
            default:
                return 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-600';
        }
    };

    const getConnectorColor = (status: 'locked' | 'ready' | 'completed') => {
        switch (status) {
            case 'completed':
                return 'bg-amber-300 dark:bg-amber-600';
            case 'ready':
                return 'bg-emerald-300 dark:bg-emerald-600';
            default:
                return 'bg-slate-200 dark:bg-slate-600';
        }
    };

    return (
        <div
            className={`bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden transition-all duration-300 ${unit.isUnlocked ? 'hover:shadow-lg hover:border-emerald-300 dark:hover:border-emerald-600/50' : 'opacity-70'
                }`}
        >
            {/* Unit Header */}
            <div
                onClick={handleToggle}
                className={`w-full p-5 text-left ${unit.isUnlocked ? 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50' : 'cursor-default'
                    } transition-colors`}
                role="button"
                tabIndex={unit.isUnlocked ? 0 : -1}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div
                            className={`flex items-center justify-center w-12 h-12 rounded-xl ${unit.isComplete
                                ? 'bg-amber-100 dark:bg-amber-900/30'
                                : unit.isUnlocked
                                    ? 'bg-emerald-100 dark:bg-emerald-900/30'
                                    : 'bg-slate-100 dark:bg-slate-700'
                                }`}
                        >
                            {unit.isComplete ? (
                                <CheckCircle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                            ) : unit.isUnlocked ? (
                                <span className="text-xl font-semibold text-emerald-600 dark:text-emerald-400">
                                    {unitIdx + 1}
                                </span>
                            ) : (
                                <Lock className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                            )}
                        </div>
                        <div>
                            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                                {unit.title}
                            </h3>
                            {unit.description && (
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    {unit.description}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {!unit.isUnlocked && unitIdx > 0 && (
                            <div onClick={(e) => e.stopPropagation()}>
                                <TestOutButton unitId={unit.id} unitTitle={unit.title} />
                            </div>
                        )}
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                            {unit.completedLessons}/{unit.totalLessons}
                        </span>
                        {unit.isUnlocked && (
                            <motion.div
                                animate={{ rotate: isExpanded ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                                className="text-slate-400"
                            >
                                <ChevronDown className="w-5 h-5" />
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>

            {/* Expanded Content - Learning Path */}
            <AnimatePresence initial={false}>
                {unit.isUnlocked && isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="overflow-hidden border-t border-slate-100 dark:border-slate-700"
                    >
                        <div className="p-5">
                            <div className="flex gap-6">
                                {/* Learning Path */}
                                <div className="flex-1">
                                    <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
                                        Learning Path
                                    </h4>
                                    <div className="space-y-1">
                                        {phases.map((phase, idx) => (
                                            <div key={phase.name} className="flex items-stretch">
                                                {/* Timeline connector */}
                                                <div className="flex flex-col items-center mr-4">
                                                    <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${getStatusColor(phase.status)} ${phase.status === 'ready' ? 'animate-pulse' : ''
                                                        }`}>
                                                        {phase.status === 'completed' ? (
                                                            <CheckCircle className="w-4 h-4" />
                                                        ) : phase.status === 'ready' ? (
                                                            <Play className="w-3 h-3" />
                                                        ) : (
                                                            <Lock className="w-3 h-3" />
                                                        )}
                                                    </div>
                                                    {idx < phases.length - 1 && (
                                                        <div className={`w-0.5 flex-1 min-h-[32px] ${getConnectorColor(
                                                            phases[idx + 1].status === 'locked' ? 'locked' : phase.status
                                                        )}`} />
                                                    )}
                                                </div>

                                                {/* Phase content */}
                                                <div className="flex-1 pb-4">
                                                    {phase.status === 'locked' ? (
                                                        <div className="px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-700/30 opacity-60">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                {phase.icon}
                                                                <span className="font-medium text-slate-500 dark:text-slate-400">
                                                                    {phase.name}
                                                                </span>
                                                            </div>
                                                            <p className="text-xs text-slate-400 dark:text-slate-500">
                                                                Complete previous steps first
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <div className="space-y-2">
                                                            {phase.lessons.map((lesson) => {
                                                                const isComplete = completedSet.has(lesson.id);
                                                                return (
                                                                    <Link
                                                                        key={lesson.id}
                                                                        href={lesson.id === -1
                                                                            ? `/learn/${courseId}/unit/${unit.id}/practice`
                                                                            : `/learn/${courseId}/unit/${unit.id}/lesson/${lesson.id}`
                                                                        }
                                                                        className={`block px-4 py-3 rounded-xl transition-all ${isComplete
                                                                            ? 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50'
                                                                            : 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/30'
                                                                            }`}
                                                                    >
                                                                        <div className="flex items-center justify-between">
                                                                            <div className="flex items-center gap-2">
                                                                                {phase.icon}
                                                                                <span className={`font-medium ${isComplete
                                                                                    ? 'text-amber-700 dark:text-amber-300'
                                                                                    : 'text-emerald-700 dark:text-emerald-300'
                                                                                    }`}>
                                                                                    {lesson.title}
                                                                                </span>
                                                                            </div>
                                                                            {isComplete ? (
                                                                                <CheckCircle className="w-4 h-4 text-amber-500" />
                                                                            ) : (
                                                                                <Play className="w-4 h-4 text-emerald-500" />
                                                                            )}
                                                                        </div>
                                                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                                            {phase.description}
                                                                        </p>
                                                                    </Link>
                                                                );
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Kanji Flashcard Panel */}
                                {kanjiLessons.length > 0 && (
                                    <div className="w-52 flex-shrink-0">
                                        <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                            <Languages className="w-3 h-3" />
                                            Unit Kanji
                                        </h4>
                                        <div className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-xl border border-violet-200 dark:border-violet-700/50 p-4">
                                            <div className="flex items-center gap-2 mb-3">
                                                <Sparkles className="w-4 h-4 text-violet-500" />
                                                <span className="text-sm font-medium text-violet-700 dark:text-violet-300">
                                                    Flashcard Deck
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                                                Study {kanjiLessons.length > 0 ? 'this unit\'s' : ''} kanji with spaced repetition flashcards.
                                            </p>
                                            <Link
                                                href={`/flashcards/study?type=kanji&unit=${unit.id}`}
                                                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-violet-500 hover:bg-violet-600 text-white rounded-lg font-medium text-sm transition-all duration-200 hover:shadow-md active:scale-[0.98]"
                                            >
                                                <Languages className="w-4 h-4" />
                                                Study Kanji
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
