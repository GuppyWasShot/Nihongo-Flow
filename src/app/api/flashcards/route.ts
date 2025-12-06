import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';
import { kanji, vocabulary } from '../../../lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'kanji';
    const level = searchParams.get('level') || 'N5';

    try {
        let items: any[] = [];

        if (type === 'kanji') {
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
