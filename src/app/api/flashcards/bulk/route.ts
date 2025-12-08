import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../lib/db';
import { kanji, vocabulary } from '../../../../lib/db/schema';
import { eq } from 'drizzle-orm';

// Get all items of a type and level for quick-add
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'kanji';
    const level = searchParams.get('level') || 'N5';

    const items: any[] = [];

    if (type === 'kanji') {
        const kanjiResults = await db.select()
            .from(kanji)
            .where(eq(kanji.jlptLevel, level));

        items.push(...kanjiResults.map(k => ({
            id: k.id,
            character: k.character,
            meanings: k.meanings,
            type: 'kanji' as const,
        })));
    }

    if (type === 'vocabulary') {
        const vocabResults = await db.select()
            .from(vocabulary)
            .where(eq(vocabulary.jlptLevel, level));

        items.push(...vocabResults.map(v => ({
            id: v.id,
            writing: v.writing,
            reading: v.reading,
            meaning: v.meaning,
            type: 'vocabulary' as const,
        })));
    }

    return NextResponse.json({ items, count: items.length });
}
