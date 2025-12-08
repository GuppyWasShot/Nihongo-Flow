import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../lib/db';
import { kanji, vocabulary } from '../../../../lib/db/schema';
import { ilike, or, sql, eq, and } from 'drizzle-orm';
import * as wanakana from 'wanakana';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const type = searchParams.get('type') || 'mixed';
    const level = searchParams.get('level') || '';
    const pos = searchParams.get('pos') || '';

    if (!query.trim()) {
        return NextResponse.json({ items: [] });
    }

    const items: any[] = [];
    const searchPattern = `%${query}%`;

    // Convert romaji to hiragana and katakana for searching
    const hiraganaQuery = wanakana.isRomaji(query) ? wanakana.toHiragana(query) : query;
    const katakanaQuery = wanakana.isRomaji(query) ? wanakana.toKatakana(query) : query;
    const hiraganaPattern = `%${hiraganaQuery}%`;
    const katakanaPattern = `%${katakanaQuery}%`;

    // Search kanji
    if (type === 'kanji' || type === 'mixed') {
        const conditions = [
            or(
                ilike(kanji.character, searchPattern),
                sql`${kanji.meanings}::text ILIKE ${searchPattern}`,
                sql`${kanji.onyomi}::text ILIKE ${searchPattern}`,
                sql`${kanji.kunyomi}::text ILIKE ${searchPattern}`,
                sql`${kanji.onyomi}::text ILIKE ${hiraganaPattern}`,
                sql`${kanji.kunyomi}::text ILIKE ${hiraganaPattern}`,
                sql`${kanji.onyomi}::text ILIKE ${katakanaPattern}`,
                sql`${kanji.kunyomi}::text ILIKE ${katakanaPattern}`
            )
        ];

        if (level) {
            conditions.push(eq(kanji.jlptLevel, level));
        }

        const kanjiResults = await db.select()
            .from(kanji)
            .where(and(...conditions))
            .limit(10);

        items.push(...kanjiResults.map(k => ({
            id: k.id,
            character: k.character,
            meanings: k.meanings,
            onyomi: k.onyomi,
            kunyomi: k.kunyomi,
            type: 'kanji' as const,
        })));
    }

    // Search vocabulary
    if (type === 'vocabulary' || type === 'mixed') {
        const conditions = [
            or(
                ilike(vocabulary.writing, searchPattern),
                ilike(vocabulary.reading, searchPattern),
                ilike(vocabulary.meaning, searchPattern),
                ilike(vocabulary.reading, hiraganaPattern),
                ilike(vocabulary.writing, hiraganaPattern),
                ilike(vocabulary.reading, katakanaPattern),
                ilike(vocabulary.writing, katakanaPattern)
            )
        ];

        if (level) {
            conditions.push(eq(vocabulary.jlptLevel, level));
        }

        if (pos) {
            conditions.push(ilike(vocabulary.partOfSpeech, pos));
        }

        const vocabResults = await db.select()
            .from(vocabulary)
            .where(and(...conditions))
            .limit(10);

        items.push(...vocabResults.map(v => ({
            id: v.id,
            writing: v.writing,
            reading: v.reading,
            meaning: v.meaning,
            type: 'vocabulary' as const,
        })));
    }

    // Remove duplicates
    const uniqueItems = items.filter((item, index, self) =>
        index === self.findIndex(i => i.id === item.id && i.type === item.type)
    );

    // Sort: exact matches first
    uniqueItems.sort((a, b) => {
        const aExact = (a.character === query || a.writing === query ||
            a.character === hiraganaQuery || a.writing === hiraganaQuery ||
            a.reading === hiraganaQuery) ? 0 : 1;
        const bExact = (b.character === query || b.writing === query ||
            b.character === hiraganaQuery || b.writing === hiraganaQuery ||
            b.reading === hiraganaQuery) ? 0 : 1;
        return aExact - bExact;
    });

    return NextResponse.json({ items: uniqueItems.slice(0, 15) });
}
