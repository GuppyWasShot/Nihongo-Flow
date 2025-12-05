/**
 * Nihongo Flow - Comprehensive N5 Database Seed Script
 * 
 * Populates the database with complete Unit 1 curriculum including:
 * - Vocabulary (~20 words)
 * - Kanji (10 characters)
 * - Grammar lessons (3 lessons)
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
    console.log('🌱 Starting comprehensive database seed...\n');

    try {
        // ==================== SEED COURSE ====================
        console.log('📚 Seeding courses...');

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
                title: 'Basic Grammar & Particles',
                description: 'Understanding は, が, を, に, and building simple sentences',
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

        // ==================== SEED KANJI ====================
        console.log('\n🈁 Seeding kanji...');

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
                character: '学',
                meanings: ['study', 'learning', 'science'],
                onyomi: ['ガク'],
                kunyomi: ['まな'],
                jlptLevel: 'N5',
                strokeCount: 8,
                exampleWords: [
                    { word: '学生', reading: 'がくせい', meaning: 'student' },
                    { word: '大学', reading: 'だいがく', meaning: 'university' },
                ],
            },
            {
                character: '大',
                meanings: ['big', 'large'],
                onyomi: ['ダイ', 'タイ'],
                kunyomi: ['おお'],
                jlptLevel: 'N5',
                strokeCount: 3,
                exampleWords: [
                    { word: '大学', reading: 'だいがく', meaning: 'university' },
                    { word: '大きい', reading: 'おおきい', meaning: 'big' },
                ],
            },
            {
                character: '小',
                meanings: ['small', 'little'],
                onyomi: ['ショウ'],
                kunyomi: ['ちい', 'こ'],
                jlptLevel: 'N5',
                strokeCount: 3,
                exampleWords: [
                    { word: '小さい', reading: 'ちいさい', meaning: 'small' },
                    { word: '小学校', reading: 'しょうがっこう', meaning: 'elementary school' },
                ],
            },
            {
                character: '山',
                meanings: ['mountain'],
                onyomi: ['サン'],
                kunyomi: ['やま'],
                jlptLevel: 'N5',
                strokeCount: 3,
                exampleWords: [
                    { word: '山', reading: 'やま', meaning: 'mountain' },
                    { word: '富士山', reading: 'ふじさん', meaning: 'Mt. Fuji' },
                ],
            },
            {
                character: '川',
                meanings: ['river'],
                onyomi: ['セン'],
                kunyomi: ['かわ'],
                jlptLevel: 'N5',
                strokeCount: 3,
                exampleWords: [
                    { word: '川', reading: 'かわ', meaning: 'river' },
                ],
            },
            {
                character: '水',
                meanings: ['water'],
                onyomi: ['スイ'],
                kunyomi: ['みず'],
                jlptLevel: 'N5',
                strokeCount: 4,
                exampleWords: [
                    { word: '水', reading: 'みず', meaning: 'water' },
                    { word: '水曜日', reading: 'すいようび', meaning: 'Wednesday' },
                ],
            },
            {
                character: '食',
                meanings: ['eat', 'food'],
                onyomi: ['ショク'],
                kunyomi: ['た'],
                jlptLevel: 'N5',
                strokeCount: 9,
                exampleWords: [
                    { word: '食べる', reading: 'たべる', meaning: 'to eat' },
                    { word: '食事', reading: 'しょくじ', meaning: 'meal' },
                ],
            },
        ];

        const kanjiMap = new Map();
        for (const kanjiItem of kanjiData) {
            const existing = await db.select()
                .from(kanji)
                .where(eq(kanji.character, kanjiItem.character));

            if (existing.length > 0) {
                console.log(`  ✓ Kanji "${kanjiItem.character}" already exists`);
                kanjiMap.set(kanjiItem.character, existing[0].id);
            } else {
                const [newKanji] = await db.insert(kanji).values(kanjiItem).returning();
                kanjiMap.set(kanjiItem.character, newKanji.id);
                console.log(`  ✓ Created kanji "${kanjiItem.character}"`);
            }
        }

        // ==================== SEED VOCABULARY ====================
        console.log('\n🔤 Seeding comprehensive vocabulary...');

        const vocabData = [
            // Greetings & Basics
            { writing: 'こんにちは', reading: 'こんにちは', meaning: 'hello, good afternoon', partOfSpeech: 'expression', jlptLevel: 'N5' },
            { writing: 'おはよう', reading: 'おはよう', meaning: 'good morning', partOfSpeech: 'expression', jlptLevel: 'N5' },
            { writing: 'ありがとう', reading: 'ありがとう', meaning: 'thank you', partOfSpeech: 'expression', jlptLevel: 'N5' },
            { writing: 'すみません', reading: 'すみません', meaning: 'excuse me, sorry', partOfSpeech: 'expression', jlptLevel: 'N5' },

            // Pronouns
            { writing: 'わたし', reading: 'わたし', meaning: 'I, me', partOfSpeech: 'pronoun', jlptLevel: 'N5' },
            { writing: 'あなた', reading: 'あなた', meaning: 'you', partOfSpeech: 'pronoun', jlptLevel: 'N5' },

            // Nouns
            { writing: '学生', reading: 'がくせい', meaning: 'student', partOfSpeech: 'noun', jlptLevel: 'N5' },
            { writing: '先生', reading: 'せんせい', meaning: 'teacher', partOfSpeech: 'noun', jlptLevel: 'N5' },
            { writing: '日本', reading: 'にほん', meaning: 'Japan', partOfSpeech: 'noun', jlptLevel: 'N5' },
            { writing: '学校', reading: 'がっこう', meaning: 'school', partOfSpeech: 'noun', jlptLevel: 'N5' },
            { writing: '水', reading: 'みず', meaning: 'water', partOfSpeech: 'noun', jlptLevel: 'N5' },
            { writing: 'りんご', reading: 'りんご', meaning: 'apple', partOfSpeech: 'noun', jlptLevel: 'N5' },
            { writing: '本', reading: 'ほん', meaning: 'book', partOfSpeech: 'noun', jlptLevel: 'N5' },

            // Verbs
            { writing: '食べる', reading: 'たべる', meaning: 'to eat', partOfSpeech: 'verb', jlptLevel: 'N5' },
            { writing: '行く', reading: 'いく', meaning: 'to go', partOfSpeech: 'verb', jlptLevel: 'N5' },
            { writing: '来る', reading: 'くる', meaning: 'to come', partOfSpeech: 'verb', jlptLevel: 'N5' },
            { writing: '見る', reading: 'みる', meaning: 'to see, to watch', partOfSpeech: 'verb', jlptLevel: 'N5' },
            { writing: '飲む', reading: 'のむ', meaning: 'to drink', partOfSpeech: 'verb', jlptLevel: 'N5' },

            // Copula
            { writing: 'です', reading: 'です', meaning: 'to be (polite)', partOfSpeech: 'copula', jlptLevel: 'N5' },
        ];

        const vocabMap = new Map();
        for (const vocabItem of vocabData) {
            const existing = await db.select()
                .from(vocabulary)
                .where(eq(vocabulary.writing, vocabItem.writing));

            if (existing.length > 0) {
                console.log(`  ✓ Vocabulary "${vocabItem.writing}" already exists`);
                vocabMap.set(vocabItem.writing, existing[0].id);
            } else {
                const [newVocab] = await db.insert(vocabulary).values({
                    ...vocabItem,
                    kanjiComponents: [],
                }).returning();
                vocabMap.set(vocabItem.writing, newVocab.id);
                console.log(`  ✓ Created vocabulary "${vocabItem.writing}"`);
            }
        }

        // ==================== SEED GRAMMAR LESSONS ====================
        console.log('\n📝 Seeding grammar lessons for Unit 3...');

        const grammarLessonsData = [
            {
                title: 'The Topic Marker (は / wa)',
                type: 'grammar',
                content: {
                    instructions: 'Learn how to mark the topic of a sentence with は (wa)',
                    sentences: [
                        {
                            q: 'わたし_がくせいです',
                            a: 'は',
                            hint: 'The topic marker は (wa) indicates what you are talking about. Use it to introduce yourself or state facts: "As for me, I am a student."'
                        },
                        {
                            q: '日本_きれいです',
                            a: 'は',
                            hint: 'は (wa) marks the topic. Here we are saying "As for Japan, (it) is beautiful."'
                        },
                        {
                            q: 'これ_本です',
                            a: 'は',
                            hint: 'Use は (wa) to identify things: "As for this, (it) is a book."'
                        },
                    ],
                },
                order: 1,
                requiredVocabulary: [
                    vocabMap.get('わたし'),
                    vocabMap.get('学生'),
                    vocabMap.get('です'),
                    vocabMap.get('日本'),
                    vocabMap.get('本'),
                ].filter(id => id !== undefined),
            },
            {
                title: 'The Object Marker (を / wo)',
                type: 'grammar',
                content: {
                    instructions: 'Learn how to mark the direct object with を (wo)',
                    sentences: [
                        {
                            q: 'りんご_食べます',
                            a: 'を',
                            hint: 'を (wo/o) marks the direct object - the thing being acted upon. "I eat an apple" - the apple is what\'s being eaten.'
                        },
                        {
                            q: '水_飲みます',
                            a: 'を',
                            hint: 'を marks the direct object. Here: "drink water" - water is what\'s being drunk.'
                        },
                        {
                            q: '本_見ます',
                            a: 'を',
                            hint: 'を indicates the object of the action. "See/read a book" - the book is being seen/read.'
                        },
                    ],
                },
                order: 2,
                requiredVocabulary: [
                    vocabMap.get('りんご'),
                    vocabMap.get('食べる'),
                    vocabMap.get('水'),
                    vocabMap.get('飲む'),
                    vocabMap.get('本'),
                    vocabMap.get('見る'),
                ].filter(id => id !== undefined),
            },
            {
                title: 'Direction Particles (に & へ / ni & e)',
                type: 'grammar',
                content: {
                    instructions: 'Learn particles indicating direction and destination',
                    sentences: [
                        {
                            q: '学校_行きます',
                            a: 'に',
                            hint: 'に (ni) or へ (e) indicates destination. "Go to school" - school is the destination. に is more common in everyday speech.'
                        },
                        {
                            q: '日本_来ます',
                            a: 'に',
                            hint: 'に marks the destination of movement. "Come to Japan" - Japan is where you\'re coming to.'
                        },
                    ],
                },
                order: 3,
                requiredVocabulary: [
                    vocabMap.get('学校'),
                    vocabMap.get('行く'),
                    vocabMap.get('日本'),
                    vocabMap.get('来る'),
                ].filter(id => id !== undefined),
            },
        ];

        for (const lessonData of grammarLessonsData) {
            const existing = await db.select()
                .from(lessons)
                .where(eq(lessons.title, lessonData.title));

            if (existing.length > 0) {
                console.log(`  ✓ Lesson "${lessonData.title}" already exists`);
            } else {
                await db.insert(lessons).values({
                    unitId: createdUnits[2].id, // Basic Grammar & Particles unit
                    title: lessonData.title,
                    type: lessonData.type,
                    content: lessonData.content,
                    order: lessonData.order,
                    requiredVocabulary: lessonData.requiredVocabulary,
                });
                console.log(`  ✓ Created lesson "${lessonData.title}"`);
            }
        }

        // Also keep the hiragana lessons in Unit 1
        const hiraganaLessonsData = [
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
        ];

        for (const lessonData of hiraganaLessonsData) {
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

        console.log('\n✅ Comprehensive database seeding completed!\n');
        console.log('Summary:');
        console.log(`  • 1 Course (JLPT N5)`);
        console.log(`  • 3 Units`);
        console.log(`  • 5 Lessons (2 Hiragana drills + 3 Grammar lessons)`);
        console.log(`  • 10 Kanji characters`);
        console.log(`  • 19 Vocabulary words`);
        console.log('\n🎉 Your database is ready with complete Unit 1 curriculum!\n');

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
