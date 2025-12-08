'use client';

import { useState, useEffect } from 'react';
import { UnitCard } from './UnitCard';

interface Lesson {
    id: number;
    title: string;
    type: string;
}

interface UnitWithProgress {
    id: number;
    title: string;
    description: string | null;
    isUnlocked: boolean;
    isComplete: boolean;
    completedLessons: number;
    totalLessons: number;
}

interface CourseUnitsClientProps {
    courseId: string;
    units: UnitWithProgress[];
    lessonsByUnit: Record<number, Lesson[]>;
    completedLessonIds: number[];
}

/**
 * Client wrapper for course units that handles localStorage-based expansion state
 */
export function CourseUnitsClient({ courseId, units, lessonsByUnit, completedLessonIds }: CourseUnitsClientProps) {
    const [activeUnitId, setActiveUnitId] = useState<number | undefined>(undefined);

    // Read active unit from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem(`nihongo-flow-expanded-unit-${courseId}`);
        if (stored) {
            const storedId = parseInt(stored);
            // Verify the unit exists and is unlocked
            const unit = units.find(u => u.id === storedId);
            if (unit && unit.isUnlocked) {
                setActiveUnitId(storedId);
                return;
            }
        }

        // Default: find first incomplete and unlocked unit
        const firstIncomplete = units.find(u => u.isUnlocked && !u.isComplete);
        if (firstIncomplete) {
            setActiveUnitId(firstIncomplete.id);
        } else if (units.length > 0 && units[0].isUnlocked) {
            setActiveUnitId(units[0].id);
        }
    }, [courseId, units]);

    return (
        <div className="space-y-4">
            {units.map((unit, unitIdx) => (
                <UnitCard
                    key={unit.id}
                    unit={unit}
                    unitIdx={unitIdx}
                    courseId={courseId}
                    lessons={lessonsByUnit[unit.id] || []}
                    completedLessonIds={completedLessonIds}
                    activeUnitId={activeUnitId}
                />
            ))}
        </div>
    );
}
