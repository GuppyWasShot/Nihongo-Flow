/**
 * Nihongo Flow - Database Seed Script
 * 
 * Populates the database with JLPT N5 course content.
 * This script is idempotent - running it multiple times won't create duplicates.
 * 
 * Run with: npm run seed
 */

// IMPORTANT: Load environment variables FIRST before any other imports
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// Now import database and schema
import { db } from './index';
import { courses, units, lessons, kanji, vocabulary } from './schema';
import { eq } from 'drizzle-orm';

async function seed() {
    console.log('🌱 Starting database seed...\n');

    try {
        // ==================== SEED COURSE ====================
        console.log('📚 Seeding courses...');

        // Check if N5 course exists
        const existingN5 = await db.select().from(courses).where(eq(courses.level, 'N5'));

        let n5Course;
        if (existingN5.length > 0) {
            console.log('  ✓ N5 course already exists');
            n5Course = existingN5[0];
        } else {
            const [newCourse] = await db.insert(courses).values({
                level: 'N5',
                title: 'JLPT N5 - Absolute Beginner',
                description: 'Master basic Japanese grammar, hiragana, katakana, and 800 essential words. Perfect for complete beginners!',
                order: 0,
            }).returning();
            n5Course = newCourse;
            console.log('  ✓ Created N5 course');
        }

        // ==================== SEED UNITS ====================
        console.log('\n📦 Seeding units...');

        const unitsData = [
            {
                title: 'Hiragana Bootcamp',
                description: 'Master all 46 hiragana characters through systematic practice',
                order: 1,
            },
            {
                title: 'Katakana & Greetings',
                description: 'Learn katakana and essential Japanese greetings',
                order: 2,
            },
            {
                title: 'Introduction to Particles',
                description: 'Understanding は, が, を, に, and other fundamental particles',
                order: 3,
            },
        ];

        const createdUnits = [];
        for (const unitData of unitsData) {
            const existing = await db.select()
                .from(units)
                .where(eq(units.title, unitData.title));

            if (existing.length > 0) {
                console.log(`  ✓ Unit "${unitData.title}" already exists`);
                createdUnits.push(existing[0]);
            } else {
                const [newUnit] = await db.insert(units).values({
                    courseId: n5Course.id,
                    ...unitData,
                }).returning();
                createdUnits.push(newUnit);
                console.log(`  ✓ Created unit "${unitData.title}"`);
            }
        }

        // ==================== SEED LESSONS ====================
        console.log('\n📝 Seeding lessons for Unit 1...');

        const lessonsData = [
            {
                title: 'Basic Vowels (あ, い, う, え, お)',
                type: 'vocab_drill',
                content: {
                    instructions: 'Practice the five basic hiragana vowels',
                    characters: ['あ', 'い', 'う', 'え', 'お'],
                    romaji: ['a', 'i', 'u', 'e', 'o'],
                },
                order: 1,
            },
            {
                title: 'Ka Row (か, き, く, け, こ)',
                type: 'vocab_drill',
                content: {
                    instructions: 'Learn the K-series hiragana',
                    characters: ['か', 'き', 'く', 'け', 'こ'],
                    romaji: ['ka', 'ki', 'ku', 'ke', 'ko'],
                },
                order: 2,
            },
            {
                title: 'Sa Row (さ, し, す, せ, そ)',
                type: 'vocab_drill',
                content: {
                    instructions: 'Master the S-series hiragana',
                    characters: ['さ', 'し', 'す', 'せ', 'そ'],
                    romaji: ['sa', 'shi', 'su', 'se', 'so'],
                },
                order: 3,
            },
            {
                title: 'Ta Row (た, ち, つ, て, と)',
                type: 'vocab_drill',
                content: {
                    instructions: 'Practice the T-series hiragana',
                    characters: ['た', 'ち', 'つ', 'て', 'と'],
                    romaji: ['ta', 'chi', 'tsu', 'te', 'to'],
                },
                order: 4,
            },
        ];

        for (const lessonData of lessonsData) {
            const existing = await db.select()
                .from(lessons)
                .where(eq(lessons.title, lessonData.title));

            if (existing.length > 0) {
                console.log(`  ✓ Lesson "${lessonData.title}" already exists`);
            } else {
                await db.insert(lessons).values({
                    unitId: createdUnits[0].id, // Hiragana Bootcamp
                    title: lessonData.title,
                    type: lessonData.type,
                    content: lessonData.content,
                    order: lessonData.order,
                });
                console.log(`  ✓ Created lesson "${lessonData.title}"`);
            }
        }

        // ==================== SEED KANJI ====================
        console.log('\n🈁 Seeding basic kanji...');

        const kanjiData = [
            {
                character: '日',
                meanings: ['sun', 'day'],
                onyomi: ['ニチ', 'ジツ'],
                kunyomi: ['ひ', 'か'],
                jlptLevel: 'N5',
                strokeCount: 4,
                exampleWords: [
                    { word: '日本', reading: 'にほん', meaning: 'Japan' },
                    { word: '今日', reading: 'きょう', meaning: 'today' },
                ],
            },
            {
                character: '本',
                meanings: ['book', 'origin', 'main'],
                onyomi: ['ホン'],
                kunyomi: ['もと'],
                jlptLevel: 'N5',
                strokeCount: 5,
                exampleWords: [
                    { word: '日本', reading: 'にほん', meaning: 'Japan' },
                    { word: '本', reading: 'ほん', meaning: 'book' },
                ],
            },
            {
                character: '人',
                meanings: ['person', 'people'],
                onyomi: ['ジン', 'ニン'],
                kunyomi: ['ひと'],
                jlptLevel: 'N5',
                strokeCount: 2,
                exampleWords: [
                    { word: '日本人', reading: 'にほんじん', meaning: 'Japanese person' },
                    { word: '人', reading: 'ひと', meaning: 'person' },
                ],
            },
            {
                character: '一',
                meanings: ['one'],
                onyomi: ['イチ', 'イツ'],
                kunyomi: ['ひと'],
                jlptLevel: 'N5',
                strokeCount: 1,
                exampleWords: [
                    { word: '一', reading: 'いち', meaning: 'one' },
                    { word: '一人', reading: 'ひとり', meaning: 'one person' },
                ],
            },
            {
                character: '二',
                meanings: ['two'],
                onyomi: ['ニ'],
                kunyomi: ['ふた'],
                jlptLevel: 'N5',
                strokeCount: 2,
                exampleWords: [
                    { word: '二', reading: 'に', meaning: 'two' },
                    { word: '二人', reading: 'ふたり', meaning: 'two people' },
                ],
            },
        ];

        for (const kanjiItem of kanjiData) {
            const existing = await db.select()
                .from(kanji)
                .where(eq(kanji.character, kanjiItem.character));

            if (existing.length > 0) {
                console.log(`  ✓ Kanji "${kanjiItem.character}" already exists`);
            } else {
                await db.insert(kanji).values(kanjiItem);
                console.log(`  ✓ Created kanji "${kanjiItem.character}"`);
            }
        }

        // ==================== SEED VOCABULARY ====================
        console.log('\n🔤 Seeding basic vocabulary...');

        const vocabData = [
            {
                writing: 'こんにちは',
                reading: 'こんにちは',
                meaning: 'hello, good afternoon',
                partOfSpeech: 'expression',
                jlptLevel: 'N5',
                kanjiComponents: [],
            },
            {
                writing: 'わたし',
                reading: 'わたし',
                meaning: 'I, me',
                partOfSpeech: 'pronoun',
                jlptLevel: 'N5',
                kanjiComponents: [],
            },
            {
                writing: 'あなた',
                reading: 'あなた',
                meaning: 'you',
                partOfSpeech: 'pronoun',
                jlptLevel: 'N5',
                kanjiComponents: [],
            },
            {
                writing: 'ありがとう',
                reading: 'ありがとう',
                meaning: 'thank you',
                partOfSpeech: 'expression',
                jlptLevel: 'N5',
                kanjiComponents: [],
            },
            {
                writing: 'すみません',
                reading: 'すみません',
                meaning: 'excuse me, sorry',
                partOfSpeech: 'expression',
                jlptLevel: 'N5',
                kanjiComponents: [],
            },
            {
                writing: '日本',
                reading: 'にほん',
                meaning: 'Japan',
                partOfSpeech: 'noun',
                jlptLevel: 'N5',
                kanjiComponents: [], // We'll link kanji IDs later if needed
                exampleSentences: [
                    {
                        japanese: '日本は美しい国です。',
                        reading: 'にほんはうつくしいくにです。',
                        english: 'Japan is a beautiful country.',
                    },
                ],
            },
            {
                writing: '学生',
                reading: 'がくせい',
                meaning: 'student',
                partOfSpeech: 'noun',
                jlptLevel: 'N5',
                kanjiComponents: [],
            },
            {
                writing: '先生',
                reading: 'せんせい',
                meaning: 'teacher',
                partOfSpeech: 'noun',
                jlptLevel: 'N5',
                kanjiComponents: [],
            },
            {
                writing: '食べる',
                reading: 'たべる',
                meaning: 'to eat',
                partOfSpeech: 'verb',
                jlptLevel: 'N5',
                kanjiComponents: [],
            },
            {
                writing: '行く',
                reading: 'いく',
                meaning: 'to go',
                partOfSpeech: 'verb',
                jlptLevel: 'N5',
                kanjiComponents: [],
            },
        ];

        for (const vocabItem of vocabData) {
            const existing = await db.select()
                .from(vocabulary)
                .where(eq(vocabulary.writing, vocabItem.writing));

            if (existing.length > 0) {
                console.log(`  ✓ Vocabulary "${vocabItem.writing}" already exists`);
            } else {
                await db.insert(vocabulary).values(vocabItem);
                console.log(`  ✓ Created vocabulary "${vocabItem.writing}"`);
            }
        }

        console.log('\n✅ Database seeding completed successfully!\n');
        console.log('Summary:');
        console.log(`  • 1 Course (JLPT N5)`);
        console.log(`  • 3 Units`);
        console.log(`  • 4 Lessons (Unit 1)`);
        console.log(`  • 5 Kanji characters`);
        console.log(`  • 10 Vocabulary words`);
        console.log('\n🎉 Your database is ready to use!\n');

    } catch (error) {
        console.error('\n❌ Error seeding database:', error);
        throw error;
    }
}

// Run the seed function
seed()
    .then(() => {
        console.log('Exiting...');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Fatal error:', error);
        process.exit(1);
    });
