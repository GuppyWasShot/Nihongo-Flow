import { db } from '../../../../../../../lib/db';
import { courses, units, lessons, vocabulary, grammarPatterns, userProgress } from '../../../../../../../lib/db/schema';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect, notFound } from 'next/navigation';
import { eq, and, inArray } from 'drizzle-orm';
import MixedPracticeSession from './MixedPracticeSession';

interface PracticePageProps {
    params: Promise<{
        courseId: string;
        unitId: string;
    }>;
}

async function getUserId() {
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
                set() { },
                remove() { },
            },
        }
    );

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    return user.id;
}

export default async function PracticePage({ params }: PracticePageProps) {
    const { courseId, unitId } = await params;
    const userId = await getUserId();
    const unitIdNum = parseInt(unitId);

    // Fetch the unit
    const [unit] = await db.select().from(units).where(eq(units.id, unitIdNum));
    if (!unit) {
        notFound();
    }

    // Fetch lessons for this unit
    const unitLessons = await db.select().from(lessons).where(eq(lessons.unitId, unitIdNum));

    // Categorize lessons
    const vocabLessons = unitLessons.filter(l =>
        l.type === 'vocab_drill' || l.title.toLowerCase().includes('vocab')
    );
    const grammarLessons = unitLessons.filter(l =>
        l.type === 'theory' || l.type === 'grammar' || l.type === 'grammar_drill'
    );

    // Check if vocab and grammar are completed
    const lessonIds = [...vocabLessons, ...grammarLessons].map(l => l.id);
    const userLessonProgress = lessonIds.length > 0
        ? await db.select().from(userProgress).where(
            and(
                eq(userProgress.userId, userId),
                eq(userProgress.itemType, 'lesson'),
                inArray(userProgress.itemId, lessonIds)
            )
        )
        : [];

    const completedLessonIds = new Set(userLessonProgress.map(p => p.itemId));

    // Check dependencies
    const vocabComplete = vocabLessons.length === 0 || vocabLessons.every(l => completedLessonIds.has(l.id));
    const grammarComplete = grammarLessons.length === 0 || grammarLessons.every(l => completedLessonIds.has(l.id));

    if (!vocabComplete) {
        // Redirect to first vocab lesson
        const firstVocab = vocabLessons[0];
        redirect(`/learn/${courseId}/unit/${unitId}/lesson/${firstVocab.id}?msg=vocab_first`);
    }

    if (!grammarComplete) {
        // Redirect to first incomplete grammar lesson
        const firstIncomplete = grammarLessons.find(l => !completedLessonIds.has(l.id));
        if (firstIncomplete) {
            redirect(`/learn/${courseId}/unit/${unitId}/lesson/${firstIncomplete.id}?msg=grammar_first`);
        }
    }

    // Generate mixed practice questions
    // For now, create sample questions from unit content
    const practiceQuestions = [
        // Sample vocab questions
        ...vocabLessons.slice(0, 3).map((l, idx) => ({
            id: idx + 1,
            type: 'vocab' as const,
            question: 'What is the meaning of this word?',
            prompt: 'こんにちは',
            options: ['Hello', 'Goodbye', 'Thank you', 'Sorry'],
            correctAnswer: 0,
        })),
        // Sample grammar questions
        ...grammarLessons.slice(0, 3).map((l, idx) => ({
            id: idx + 100,
            type: 'grammar' as const,
            question: 'Fill in the blank',
            sentence: '私___学生です。',
            sentenceReading: 'わたし___がくせいです。',
            options: ['は', 'が', 'を', 'に'],
            correctAnswer: 0,
        })),
    ];

    return (
        <MixedPracticeSession
            unitId={unitIdNum}
            unitTitle={unit.title}
            courseId={courseId}
            questions={practiceQuestions}
        />
    );
}
