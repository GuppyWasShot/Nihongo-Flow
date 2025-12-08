import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';
import { kanji, vocabulary, lessons } from '../../../lib/db/schema';
import { eq, inArray } from 'drizzle-orm';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'kanji';
    const level = searchParams.get('level') || 'N5';
    const unitId = searchParams.get('unit');

    try {
        let items: any[] = [];

        // If unit is specified, get kanji from that unit's lessons
        if (unitId && type === 'kanji') {
            const unitLessons = await db.select()
                .from(lessons)
                .where(eq(lessons.unitId, parseInt(unitId)));

            // Extract kanji characters from kanji_practice lessons
            const kanjiChars: string[] = [];
            for (const lesson of unitLessons) {
                if (lesson.type === 'kanji_practice' && lesson.content) {
                    const content = lesson.content as any;
                    if (content.kanji && Array.isArray(content.kanji)) {
                        kanjiChars.push(...content.kanji);
                    }
                }
            }

            // Fetch full kanji data for those characters
            if (kanjiChars.length > 0) {
                items = await db.select()
                    .from(kanji)
                    .where(inArray(kanji.character, kanjiChars));
            }
        } else if (type === 'kanji') {
            items = await db.select().from(kanji).where(eq(kanji.jlptLevel, level));
        } else if (type === 'vocabulary') {
            items = await db.select().from(vocabulary).where(eq(vocabulary.jlptLevel, level));
        }

        return NextResponse.json({ items });
    } catch (error) {
        console.error('Error fetching flashcard items:', error);
        return NextResponse.json({ items: [], error: 'Failed to fetch items' }, { status: 500 });
    }
}

