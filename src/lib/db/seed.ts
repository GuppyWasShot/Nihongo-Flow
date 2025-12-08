/**
 * Nihongo Flow - Comprehensive N5 Database Seed Script
 * 
 * Populates the database with complete N5 curriculum including:
 * - Hiragana and Katakana (92 characters)
 * - N5 Kanji with mnemonics
 * - Vocabulary words
 * - Grammar patterns
 * - Complete units with lessons (new question types)
 * - Sample mock exam
 * 
 * Run with: npm run seed
 */

// dotenv needs to be imported first
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// Now import database and schema
import { db } from './index';
import {
    courses, units, lessons, kanji, vocabulary,
    grammarPatterns, kanaCharacters, mockExams, contexts
} from './schema';
import { eq } from 'drizzle-orm';

// Import seed data
import { hiraganaData, katakanaData } from './seed-data/kana';
import { n5KanjiData } from './seed-data/kanji';
import { n5GrammarData } from './seed-data/grammar';
import { allN5Vocabulary } from './seed-data/n5-vocabulary-full';

// Import N4 seed data
import { n4KanjiData } from './seed-data/n4-kanji';
import { n4GrammarData } from './seed-data/n4-grammar';
import { n4VocabularyData } from './seed-data/n4-vocabulary';

// ============ FOCUSED UNIT 1 DATA ============

// 6 Core Kanji for Unit 1 (Atoms)
const unit1Kanji = [
    {
        character: '人',
        meanings: ['person', 'people'],
        onyomi: ['ジン', 'ニン'],
        kunyomi: ['ひと'],
        strokeCount: 2,
        mnemonic: 'A person walking on two legs - the strokes look like legs in motion.',
        exampleWords: [
            { word: '日本人', reading: 'にほんじん', meaning: 'Japanese person' },
            { word: '一人', reading: 'ひとり', meaning: 'one person; alone' },
        ],
    },
    {
        character: '日',
        meanings: ['sun', 'day'],
        onyomi: ['ニチ', 'ジツ'],
        kunyomi: ['ひ', 'か'],
        strokeCount: 4,
        mnemonic: 'Picture a window with the sun shining through it.',
        exampleWords: [
            { word: '今日', reading: 'きょう', meaning: 'today' },
            { word: '日曜日', reading: 'にちようび', meaning: 'Sunday' },
        ],
    },
    {
        character: '本',
        meanings: ['book', 'origin', 'base'],
        onyomi: ['ホン'],
        kunyomi: ['もと'],
        strokeCount: 5,
        mnemonic: 'A tree with roots - the origin of things. Books come from trees (paper)!',
        exampleWords: [
            { word: '日本', reading: 'にほん', meaning: 'Japan' },
            { word: '本', reading: 'ほん', meaning: 'book' },
        ],
    },
    {
        character: '学',
        meanings: ['study', 'learning', 'science'],
        onyomi: ['ガク'],
        kunyomi: ['まな-ぶ'],
        strokeCount: 8,
        mnemonic: 'A child (子) under a roof with knowledge raining down - a place of learning.',
        exampleWords: [
            { word: '学生', reading: 'がくせい', meaning: 'student' },
            { word: '大学', reading: 'だいがく', meaning: 'university' },
        ],
    },
    {
        character: '生',
        meanings: ['life', 'birth', 'raw'],
        onyomi: ['セイ', 'ショウ'],
        kunyomi: ['い-きる', 'う-まれる', 'なま'],
        strokeCount: 5,
        mnemonic: 'A plant sprouting from the earth - new life growing.',
        exampleWords: [
            { word: '先生', reading: 'せんせい', meaning: 'teacher' },
            { word: '生まれる', reading: 'うまれる', meaning: 'to be born' },
        ],
    },
    {
        character: '私',
        meanings: ['I', 'me', 'private'],
        onyomi: ['シ'],
        kunyomi: ['わたし', 'わたくし'],
        strokeCount: 7,
        mnemonic: 'Grain (禾) + self = my private grain field. What\'s mine is private.',
        exampleWords: [
            { word: '私', reading: 'わたし', meaning: 'I; me' },
            { word: '私達', reading: 'わたしたち', meaning: 'we; us' },
        ],
    },
];

// 20 Essential Vocabulary for Unit 1 (Molecules)
const unit1Vocabulary = [
    // Pronouns (2)
    { writing: '私', reading: 'わたし', meaning: 'I; me', partOfSpeech: 'pronoun' },
    { writing: 'あなた', reading: 'あなた', meaning: 'you', partOfSpeech: 'pronoun' },

    // People (3)
    { writing: '学生', reading: 'がくせい', meaning: 'student', partOfSpeech: 'noun' },
    { writing: '先生', reading: 'せんせい', meaning: 'teacher; professor', partOfSpeech: 'noun' },
    { writing: '人', reading: 'ひと', meaning: 'person', partOfSpeech: 'noun' },

    // Countries (2)
    { writing: '日本', reading: 'にほん', meaning: 'Japan', partOfSpeech: 'noun' },
    { writing: 'アメリカ', reading: 'アメリカ', meaning: 'America; USA', partOfSpeech: 'noun' },

    // Expressions (5)
    { writing: 'こんにちは', reading: 'こんにちは', meaning: 'hello; good afternoon', partOfSpeech: 'expression' },
    { writing: 'さようなら', reading: 'さようなら', meaning: 'goodbye', partOfSpeech: 'expression' },
    { writing: 'ありがとう', reading: 'ありがとう', meaning: 'thank you', partOfSpeech: 'expression' },
    { writing: 'はい', reading: 'はい', meaning: 'yes', partOfSpeech: 'expression' },
    { writing: 'いいえ', reading: 'いいえ', meaning: 'no', partOfSpeech: 'expression' },

    // Verbs - Polite Form (4)
    { writing: '行きます', reading: 'いきます', meaning: 'to go (polite)', partOfSpeech: 'verb' },
    { writing: '食べます', reading: 'たべます', meaning: 'to eat (polite)', partOfSpeech: 'verb' },
    { writing: '見ます', reading: 'みます', meaning: 'to see; watch (polite)', partOfSpeech: 'verb' },
    { writing: '飲みます', reading: 'のみます', meaning: 'to drink (polite)', partOfSpeech: 'verb' },

    // Nouns (4)
    { writing: '本', reading: 'ほん', meaning: 'book', partOfSpeech: 'noun' },
    { writing: '名前', reading: 'なまえ', meaning: 'name', partOfSpeech: 'noun' },
    { writing: '友達', reading: 'ともだち', meaning: 'friend', partOfSpeech: 'noun' },
    { writing: '会社員', reading: 'かいしゃいん', meaning: 'office worker; employee', partOfSpeech: 'noun' },
];

// 3 Grammar Lessons for Unit 1 (Logic)
const unit1GrammarLessons = [
    {
        title: 'Lesson 1.1: Topic Marker は (wa)',
        type: 'grammar',
        content: {
            grammarPoint: 'X は Y です',
            explanation: 'The particle は (pronounced "wa") marks the topic of a sentence. です (desu) is the polite copula meaning "is/am/are".',
            questionType: 'fill_blank',
            questions: [
                {
                    sentence: '私{_}田中です',
                    sentenceReading: 'わたし{_}たなかです',
                    sentenceEnglish: 'I am Tanaka.',
                    answer: 'は',
                    hint: 'Topic marker particle',
                },
                {
                    sentence: '田中さん{_}学生です',
                    sentenceReading: 'たなかさん{_}がくせいです',
                    sentenceEnglish: 'Mr. Tanaka is a student.',
                    answer: 'は',
                    hint: 'Topic marker particle',
                },
                {
                    sentence: 'あなた{_}先生ですか',
                    sentenceReading: 'あなた{_}せんせいですか',
                    sentenceEnglish: 'Are you a teacher?',
                    answer: 'は',
                    hint: 'Topic marker particle',
                },
                {
                    sentence: '私{_}日本人です',
                    sentenceReading: 'わたし{_}にほんじんです',
                    sentenceEnglish: 'I am Japanese.',
                    answer: 'は',
                    hint: 'Topic marker particle',
                },
            ],
        },
    },
    {
        title: 'Lesson 1.2: Question Marker か (ka)',
        type: 'grammar',
        content: {
            grammarPoint: 'X は Y ですか',
            explanation: 'Adding か (ka) at the end of a statement turns it into a question. In Japanese, you don\'t need to change word order for questions!',
            questionType: 'word_bank',
            questions: [
                {
                    targetSentence: 'あなたは学生ですか',
                    targetReading: 'あなたはがくせいですか',
                    targetEnglish: 'Are you a student?',
                    words: ['です', 'か', '学生', 'あなた', 'は'],
                    wordsReading: ['です', 'か', 'がくせい', 'あなた', 'は'],
                    correctOrder: [3, 4, 2, 0, 1],
                },
                {
                    targetSentence: '田中さんは先生ですか',
                    targetReading: 'たなかさんはせんせいですか',
                    targetEnglish: 'Is Mr. Tanaka a teacher?',
                    words: ['先生', 'は', 'ですか', '田中さん'],
                    wordsReading: ['せんせい', 'は', 'ですか', 'たなかさん'],
                    correctOrder: [3, 1, 0, 2],
                },
                {
                    targetSentence: '山田さんは日本人ですか',
                    targetReading: 'やまださんはにほんじんですか',
                    targetEnglish: 'Is Mr. Yamada Japanese?',
                    words: ['日本人', 'ですか', '山田さん', 'は'],
                    wordsReading: ['にほんじん', 'ですか', 'やまださん', 'は'],
                    correctOrder: [2, 3, 0, 1],
                },
            ],
        },
    },
    {
        title: 'Lesson 1.3: Possessive の (no)',
        type: 'grammar',
        content: {
            grammarPoint: 'X の Y',
            explanation: 'The particle の (no) shows possession or connection between nouns. It\'s like the English "\'s" or "of".',
            questionType: 'multiple_choice',
            questions: [
                {
                    sentence: '私___本です',
                    sentenceReading: 'わたし___ほんです',
                    sentenceEnglish: 'It is my book.',
                    options: ['は', 'が', 'の', 'を'],
                    correctAnswer: 2,
                    explanation: 'の connects "私" (I) with "本" (book) to show possession.',
                },
                {
                    sentence: '田中さん___友達',
                    sentenceReading: 'たなかさん___ともだち',
                    sentenceEnglish: 'Tanaka\'s friend',
                    options: ['の', 'は', 'に', 'で'],
                    correctAnswer: 0,
                    explanation: 'の shows the friend belongs to/is connected to Tanaka.',
                },
                {
                    sentence: '日本___学生',
                    sentenceReading: 'にほん___がくせい',
                    sentenceEnglish: 'A student from Japan',
                    options: ['は', 'の', 'が', 'と'],
                    correctAnswer: 1,
                    explanation: 'の connects "Japan" with "student" showing origin.',
                },
                {
                    sentence: '会社___名前',
                    sentenceReading: 'かいしゃ___なまえ',
                    sentenceEnglish: 'The company\'s name',
                    options: ['を', 'に', 'の', 'で'],
                    correctAnswer: 2,
                    explanation: 'の shows the name belongs to the company.',
                },
            ],
        },
    },
];

async function seed() {
    console.log('🌱 Starting comprehensive N5 seed...\n');

    try {
        // ============ CLEAN UP EXISTING DATA ============
        console.log('🧹 Cleaning existing data...');
        await db.delete(lessons);
        await db.delete(units);
        await db.delete(courses);
        await db.delete(kanji);
        await db.delete(vocabulary);
        await db.delete(grammarPatterns);
        await db.delete(kanaCharacters);
        await db.delete(mockExams);
        await db.delete(contexts);
        console.log('   ✓ Cleaned existing data\n');

        // ============ SEED KANA CHARACTERS ============
        console.log('📝 Seeding kana characters...');

        // Insert hiragana
        for (const h of hiraganaData) {
            await db.insert(kanaCharacters).values({
                character: h.character,
                type: 'hiragana',
                romaji: h.romaji,
                row: h.row,
                column: h.column,
                strokeCount: h.strokeCount,
            });
        }
        console.log(`   ✓ Inserted ${hiraganaData.length} hiragana characters`);

        // Insert katakana
        for (const k of katakanaData) {
            await db.insert(kanaCharacters).values({
                character: k.character,
                type: 'katakana',
                romaji: k.romaji,
                row: k.row,
                column: k.column,
                strokeCount: k.strokeCount,
            });
        }
        console.log(`   ✓ Inserted ${katakanaData.length} katakana characters\n`);

        // ============ SEED KANJI ============
        console.log('🈶 Seeding N5 kanji...');
        const kanjiIds: Record<string, number> = {};

        // First insert Unit 1 focused kanji
        for (const k of unit1Kanji) {
            const [inserted] = await db.insert(kanji).values({
                character: k.character,
                meanings: k.meanings,
                onyomi: k.onyomi || [],
                kunyomi: k.kunyomi || [],
                jlptLevel: 'N5',
                strokeCount: k.strokeCount,
                mnemonic: k.mnemonic,
                radicals: [],
                exampleWords: k.exampleWords,
            }).returning();
            kanjiIds[k.character] = inserted.id;
        }
        console.log(`   ✓ Inserted ${unit1Kanji.length} Unit 1 core kanji`);

        // Then insert remaining N5 kanji (skip duplicates)
        const unit1Chars = new Set(unit1Kanji.map(k => k.character));
        let additionalKanji = 0;
        for (const k of n5KanjiData) {
            if (unit1Chars.has(k.character)) continue; // Skip duplicates
            const [inserted] = await db.insert(kanji).values({
                character: k.character,
                meanings: k.meanings,
                onyomi: k.onyomi || [],
                kunyomi: k.kunyomi || [],
                jlptLevel: 'N5',
                strokeCount: k.strokeCount,
                mnemonic: k.mnemonic,
                radicals: [],
                exampleWords: [],
            }).returning();
            kanjiIds[k.character] = inserted.id;
            additionalKanji++;
        }
        console.log(`   ✓ Inserted ${additionalKanji} additional N5 kanji\n`);

        // ============ SEED VOCABULARY ============
        console.log('📚 Seeding comprehensive N5 vocabulary...');

        // Use the full N5 vocabulary dataset (700+ words)
        const seenWritings = new Set<string>();
        let vocabCount = 0;
        for (const v of allN5Vocabulary) {
            if (seenWritings.has(v.writing)) continue; // Skip exact duplicates within dataset
            seenWritings.add(v.writing);
            await db.insert(vocabulary).values({
                writing: v.writing,
                reading: v.reading,
                meaning: v.meaning,
                partOfSpeech: v.partOfSpeech,
                jlptLevel: 'N5',
                kanjiComponents: [],
                exampleSentences: [],
            });
            vocabCount++;
        }
        console.log(`   ✓ Inserted ${vocabCount} N5 vocabulary words\n`);

        // ============ SEED GRAMMAR PATTERNS ============
        console.log('📖 Seeding grammar patterns...');
        const grammarIds: Record<string, number> = {};

        for (const g of n5GrammarData) {
            const [inserted] = await db.insert(grammarPatterns).values({
                pattern: g.pattern,
                meaning: g.meaning,
                jlptLevel: 'N5',
                formation: g.formation,
                explanation: g.explanation,
                examples: g.examples,
                notes: null,
                relatedPatterns: [],
            }).returning();
            grammarIds[g.pattern] = inserted.id;
        }
        console.log(`   ✓ Inserted ${n5GrammarData.length} grammar patterns\n`);

        // ============ SEED N4 KANJI ============
        console.log('🈶 Seeding N4 kanji...');
        const existingKanji = new Set([...unit1Chars, ...n5KanjiData.map(k => k.character)]);
        let n4KanjiCount = 0;
        for (const k of n4KanjiData) {
            if (existingKanji.has(k.character)) continue; // Skip duplicates
            const [inserted] = await db.insert(kanji).values({
                character: k.character,
                meanings: k.meanings,
                onyomi: k.onyomi || [],
                kunyomi: k.kunyomi || [],
                jlptLevel: 'N4',
                strokeCount: k.strokeCount,
                mnemonic: k.mnemonic,
                radicals: [],
                exampleWords: [],
            }).returning();
            kanjiIds[k.character] = inserted.id;
            n4KanjiCount++;
        }
        console.log(`   ✓ Inserted ${n4KanjiCount} N4 kanji\n`);

        // ============ SEED N4 VOCABULARY ============
        console.log('📚 Seeding N4 vocabulary...');
        let n4VocabCount = 0;
        for (const v of n4VocabularyData) {
            if (seenWritings.has(v.writing)) continue; // Skip duplicates
            seenWritings.add(v.writing);
            await db.insert(vocabulary).values({
                writing: v.writing,
                reading: v.reading,
                meaning: v.meaning,
                partOfSpeech: v.partOfSpeech,
                jlptLevel: 'N4',
                kanjiComponents: [],
                exampleSentences: [],
            });
            n4VocabCount++;
        }
        console.log(`   ✓ Inserted ${n4VocabCount} N4 vocabulary words\n`);

        // ============ SEED N4 GRAMMAR PATTERNS ============
        console.log('📖 Seeding N4 grammar patterns...');
        for (const g of n4GrammarData) {
            const [inserted] = await db.insert(grammarPatterns).values({
                pattern: g.pattern,
                meaning: g.meaning,
                jlptLevel: 'N4',
                formation: g.formation,
                explanation: g.explanation,
                examples: g.examples,
                notes: null,
                relatedPatterns: [],
            }).returning();
            grammarIds[g.pattern] = inserted.id;
        }
        console.log(`   ✓ Inserted ${n4GrammarData.length} N4 grammar patterns\n`);

        // ============ SEED COURSE ============
        console.log('🎓 Seeding N5 course...');
        const [n5Course] = await db.insert(courses).values({
            level: 'N5',
            title: 'JLPT N5 - Beginner Japanese',
            description: 'Master the fundamentals of Japanese including hiragana, katakana, basic kanji, vocabulary, and grammar patterns.',
            order: 1,
        }).returning();
        console.log(`   ✓ Created N5 course (ID: ${n5Course.id})\n`);

        // ============ SEED N4 COURSE ============
        console.log('🎓 Seeding N4 course...');
        const [n4Course] = await db.insert(courses).values({
            level: 'N4',
            title: 'JLPT N4 - Elementary Japanese',
            description: 'Build on N5 foundations with intermediate grammar, expanded vocabulary, and more complex kanji.',
            order: 2,
        }).returning();
        console.log(`   ✓ Created N4 course (ID: ${n4Course.id})\n`);

        // ============ SEED UNITS ============
        console.log('📦 Seeding units and lessons...');

        const unitDefinitions = [
            {
                title: 'Unit 0: Japanese Writing Systems',
                description: 'Learn hiragana and katakana - the foundations of Japanese writing',
                lessons: [
                    // LESSON 1: Hiragana Part 1 (vowels through T-row = 20 chars)
                    {
                        title: 'Hiragana Part 1: あ〜と', type: 'vocab_drill', content: {
                            instructions: 'Master the first 20 hiragana! Vowels (あ-お), K-row (か-こ), S-row (さ-そ), T-row (た-と). Special: し=shi, ち=chi, つ=tsu',
                            characters: ['あ', 'い', 'う', 'え', 'お', 'か', 'き', 'く', 'け', 'こ', 'さ', 'し', 'す', 'せ', 'そ', 'た', 'ち', 'つ', 'て', 'と'],
                            romaji: ['a', 'i', 'u', 'e', 'o', 'ka', 'ki', 'ku', 'ke', 'ko', 'sa', 'shi', 'su', 'se', 'so', 'ta', 'chi', 'tsu', 'te', 'to']
                        }
                    },
                    // LESSON 2: Hiragana Part 2 (N through W + n = 26 chars)
                    {
                        title: 'Hiragana Part 2: な〜ん', type: 'vocab_drill', content: {
                            instructions: 'Complete basic hiragana! N-row, H-row (ふ=fu), M-row, Y-row (3 chars), R-row, W-row, and ん',
                            characters: ['な', 'に', 'ぬ', 'ね', 'の', 'は', 'ひ', 'ふ', 'へ', 'ほ', 'ま', 'み', 'む', 'め', 'も', 'や', 'ゆ', 'よ', 'ら', 'り', 'る', 'れ', 'ろ', 'わ', 'を', 'ん'],
                            romaji: ['na', 'ni', 'nu', 'ne', 'no', 'ha', 'hi', 'fu', 'he', 'ho', 'ma', 'mi', 'mu', 'me', 'mo', 'ya', 'yu', 'yo', 'ra', 'ri', 'ru', 're', 'ro', 'wa', 'wo', 'n']
                        }
                    },
                    // LESSON 3: Hiragana Part 3 (dakuten, handakuten, combos = 28 chars)
                    {
                        title: 'Hiragana Part 3: Voiced & Combos', type: 'vocab_drill', content: {
                            instructions: 'Voiced sounds (゛): が-ぼ. P-sounds (゜): ぱ-ぽ. Combinations: きゃ, しゅ, ちょ, etc.',
                            characters: ['が', 'ぎ', 'ぐ', 'げ', 'ご', 'ざ', 'じ', 'ず', 'ぜ', 'ぞ', 'だ', 'で', 'ど', 'ば', 'び', 'ぶ', 'べ', 'ぼ', 'ぱ', 'ぴ', 'ぷ', 'ぺ', 'ぽ', 'きゃ', 'しゅ', 'ちょ', 'にゃ', 'りゅ'],
                            romaji: ['ga', 'gi', 'gu', 'ge', 'go', 'za', 'ji', 'zu', 'ze', 'zo', 'da', 'de', 'do', 'ba', 'bi', 'bu', 'be', 'bo', 'pa', 'pi', 'pu', 'pe', 'po', 'kya', 'shu', 'cho', 'nya', 'ryu']
                        }
                    },
                    // LESSON 4: Katakana Complete (46 basic chars)
                    {
                        title: 'Katakana Complete: ア〜ン', type: 'vocab_drill', content: {
                            instructions: 'All 46 basic katakana! Same sounds as hiragana but angular shapes. Used for foreign words.',
                            characters: ['ア', 'イ', 'ウ', 'エ', 'オ', 'カ', 'キ', 'ク', 'ケ', 'コ', 'サ', 'シ', 'ス', 'セ', 'ソ', 'タ', 'チ', 'ツ', 'テ', 'ト', 'ナ', 'ニ', 'ヌ', 'ネ', 'ノ', 'ハ', 'ヒ', 'フ', 'ヘ', 'ホ', 'マ', 'ミ', 'ム', 'メ', 'モ', 'ヤ', 'ユ', 'ヨ', 'ラ', 'リ', 'ル', 'レ', 'ロ', 'ワ', 'ヲ', 'ン'],
                            romaji: ['a', 'i', 'u', 'e', 'o', 'ka', 'ki', 'ku', 'ke', 'ko', 'sa', 'shi', 'su', 'se', 'so', 'ta', 'chi', 'tsu', 'te', 'to', 'na', 'ni', 'nu', 'ne', 'no', 'ha', 'hi', 'fu', 'he', 'ho', 'ma', 'mi', 'mu', 'me', 'mo', 'ya', 'yu', 'yo', 'ra', 'ri', 'ru', 're', 'ro', 'wa', 'wo', 'n']
                        }
                    },
                    // LESSON 5: Mixed Kana Challenge
                    {
                        title: '🔀 Kana Master Challenge', type: 'vocab_drill', content: {
                            instructions: 'Ultimate test! Random hiragana and katakana mixed together. Can you recognize them all?',
                            characters: ['ろ', 'ク', 'し', 'ン', 'あ', 'テ', 'も', 'ヤ', 'ふ', 'コ', 'り', 'エ', 'な', 'ヲ', 'す', 'ホ', 'み', 'ヨ', 'に', 'ワ', 'が', 'ジ', 'ぱ', 'チ'],
                            romaji: ['ro', 'ku', 'shi', 'n', 'a', 'te', 'mo', 'ya', 'fu', 'ko', 'ri', 'e', 'na', 'wo', 'su', 'ho', 'mi', 'yo', 'ni', 'wa', 'ga', 'ji', 'pa', 'chi']
                        }
                    },
                    // LESSON 6: Real Katakana Words
                    {
                        title: 'Katakana Words Practice', type: 'vocab_drill', content: {
                            instructions: 'Read real Japanese words! These katakana words are used every day.',
                            characters: ['コーヒー', 'パン', 'テレビ', 'ホテル', 'レストラン', 'アメリカ', 'コンビニ', 'ビール', 'タクシー', 'スマホ', 'パソコン', 'インターネット'],
                            romaji: ['koohii', 'pan', 'terebi', 'hoteru', 'resutoran', 'amerika', 'konbini', 'biiru', 'takushii', 'sumaho', 'pasokon', 'intaanetto']
                        }
                    },
                ]
            },
            {
                title: 'Unit 1: Self-Introduction & Basic Sentences',
                description: 'Master the core particles は, の, and か to form basic sentences and questions',
                lessons: [
                    // Theory: Basic greetings
                    {
                        title: 'Essential Greetings', type: 'theory', content: {
                            grammar: 'Basic Japanese Greetings',
                            explanation: 'Japanese has different greetings for different times of day and levels of formality. Using the wrong greeting at the wrong time can be confusing, so learning when to use each one is essential!',
                            examples: [
                                { japanese: 'おはようございます', reading: 'ohayou gozaimasu', english: 'Good morning (polite)' },
                                { japanese: 'こんにちは', reading: 'konnichiwa', english: 'Hello / Good afternoon' },
                                { japanese: 'こんばんは', reading: 'konbanwa', english: 'Good evening' },
                                { japanese: 'さようなら', reading: 'sayounara', english: 'Goodbye' },
                                { japanese: 'ありがとうございます', reading: 'arigatou gozaimasu', english: 'Thank you (polite)' },
                            ],
                            useCases: [
                                {
                                    correct: 'おはようございます (morning at work)',
                                    incorrect: 'こんにちは (morning at work)',
                                    explanation: 'Use おはようございます until around 10-11am. こんにちは is for afternoon.',
                                },
                                {
                                    correct: 'ありがとうございます (to teacher)',
                                    incorrect: 'ありがとう (to teacher)',
                                    explanation: 'Use the polite form ございます with teachers, bosses, and strangers.',
                                },
                            ],
                            commonMistakes: [
                                {
                                    mistake: 'Saying こんにちは to family members',
                                    correction: 'Use おはよう (casual good morning) with family',
                                    why: 'こんにちは is too formal for family - it sounds strange!',
                                },
                            ],
                            quickCheck: [
                                {
                                    question: 'What greeting do you use in the morning?',
                                    options: ['こんにちは', 'おはようございます', 'こんばんは', 'さようなら'],
                                    answer: 1,
                                    explanation: 'おはようございます is the polite morning greeting.',
                                },
                                {
                                    question: 'Which is more polite?',
                                    options: ['ありがとう', 'ありがとうございます'],
                                    answer: 1,
                                    explanation: 'Adding ございます makes it polite - use this with teachers and strangers!',
                                },
                            ],
                        }
                    },
                    // Vocab drill for greetings
                    {
                        title: 'Greetings Practice', type: 'vocab_drill', content: {
                            instructions: 'Type the reading for each expression',
                            characters: ['こんにちは', 'さようなら', 'ありがとう', 'はい', 'いいえ'],
                            romaji: ['konnichiha', 'sayounara', 'arigatou', 'hai', 'iie']
                        }
                    },
                    // NEW: Grammar lesson with fill_blank
                    ...unit1GrammarLessons.map(l => ({
                        title: l.title,
                        type: l.type,
                        content: l.content,
                    })),
                    // Kanji practice for Unit 1
                    {
                        title: 'Unit 1 Kanji', type: 'kanji_practice', content: {
                            instructions: 'Learn the core kanji for self-introduction',
                            kanji: ['人', '日', '本', '学', '生', '私'],
                            readings: ['ひと', 'ひ', 'ほん', 'がく', 'せい', 'わたし'],
                            meanings: ['person', 'day/sun', 'book/origin', 'study', 'life', 'I/private']
                        }
                    },
                ]
            },
            {
                title: 'Unit 2: Numbers & Counting',
                description: 'Master Japanese numbers, counters, and practical usage like prices and ages',
                lessons: [
                    // Lesson 1: Numbers 1-10 theory with both systems
                    {
                        title: 'Numbers 1-10', type: 'theory', content: {
                            grammar: 'Sino-Japanese Numbers (いち、に、さん...)',
                            explanation: 'Japanese mainly uses Sino-Japanese numbers (derived from Chinese) for most counting. Native Japanese numbers (ひとつ、ふたつ...) are used for counting objects without counters. For N5, focus on Sino-Japanese: いち、に、さん、よん/し、ご、ろく、なな/しち、はち、きゅう/く、じゅう.',
                            examples: [
                                { japanese: '一、二、三', reading: 'いち、に、さん', english: '1, 2, 3' },
                                { japanese: '四、五、六', reading: 'よん、ご、ろく', english: '4, 5, 6 (よん preferred over し)' },
                                { japanese: '七、八、九、十', reading: 'なな、はち、きゅう、じゅう', english: '7, 8, 9, 10 (なな preferred over しち)' },
                            ],
                            useCases: [
                                { correct: 'よんにん (4 people)', incorrect: 'しにん (sounds like 死人=dead person)', explanation: 'Use よん instead of し to avoid the word for death!' },
                                { correct: 'なな (seven)', incorrect: 'しち (sounds similar to いち)', explanation: 'Use なな to avoid confusion with いち (one)' },
                            ],
                        }
                    },
                    // Lesson 2: Number vocabulary drill
                    {
                        title: 'Number Vocabulary', type: 'vocab_lesson', content: {
                            vocabulary: [
                                { japanese: '一', reading: 'いち', english: 'one (1)' },
                                { japanese: '二', reading: 'に', english: 'two (2)' },
                                { japanese: '三', reading: 'さん', english: 'three (3)' },
                                { japanese: '四', reading: 'よん', english: 'four (4)' },
                                { japanese: '五', reading: 'ご', english: 'five (5)' },
                                { japanese: '六', reading: 'ろく', english: 'six (6)' },
                                { japanese: '七', reading: 'なな', english: 'seven (7)' },
                                { japanese: '八', reading: 'はち', english: 'eight (8)' },
                                { japanese: '九', reading: 'きゅう', english: 'nine (9)' },
                                { japanese: '十', reading: 'じゅう', english: 'ten (10)' },
                            ]
                        }
                    },
                    // Lesson 3: Larger numbers
                    {
                        title: 'Numbers 11-100', type: 'theory', content: {
                            grammar: 'Building Larger Numbers',
                            explanation: 'Japanese numbers are logical: 11 = 10+1 (じゅういち), 20 = 2×10 (にじゅう), 100 = 百 (ひゃく). Numbers combine: 45 = 4×10+5 (よんじゅうご).',
                            examples: [
                                { japanese: '十一', reading: 'じゅういち', english: '11 (10+1)' },
                                { japanese: '二十', reading: 'にじゅう', english: '20 (2×10)' },
                                { japanese: '五十', reading: 'ごじゅう', english: '50 (5×10)' },
                                { japanese: '百', reading: 'ひゃく', english: '100' },
                                { japanese: '三百', reading: 'さんびゃく', english: '300 (sound change!)' },
                            ],
                        }
                    },
                    // Lesson 4: Counter intro - people
                    {
                        title: 'Counting People (人)', type: 'theory', content: {
                            grammar: 'The Counter 人 (にん/り)',
                            explanation: 'To count people: 一人 (ひとり = 1 person), 二人 (ふたり = 2 people), then 三人 (さんにん), 四人 (よにん)... Note the irregular readings for 1 and 2 people!',
                            examples: [
                                { japanese: '一人', reading: 'ひとり', english: '1 person (irregular!)' },
                                { japanese: '二人', reading: 'ふたり', english: '2 people (irregular!)' },
                                { japanese: '三人', reading: 'さんにん', english: '3 people' },
                                { japanese: '四人', reading: 'よにん', english: '4 people' },
                                { japanese: '何人', reading: 'なんにん', english: 'how many people?' },
                            ],
                        }
                    },
                    // Lesson 5: Prices with 円
                    {
                        title: 'Prices (円)', type: 'vocab_lesson', content: {
                            vocabulary: [
                                { japanese: '百円', reading: 'ひゃくえん', english: '100 yen' },
                                { japanese: '三百円', reading: 'さんびゃくえん', english: '300 yen' },
                                { japanese: '五百円', reading: 'ごひゃくえん', english: '500 yen' },
                                { japanese: '千円', reading: 'せんえん', english: '1,000 yen' },
                                { japanese: 'いくらですか', reading: 'いくらですか', english: 'How much is it?' },
                            ]
                        }
                    },
                    // Lesson 6: Practice
                    {
                        title: 'Number Practice', type: 'grammar', content: {
                            questionType: 'multiple_choice',
                            questions: [
                                { sentence: '15 in Japanese is:', sentenceReading: '', sentenceEnglish: 'Choose the correct reading', options: ['いちご', 'じゅうご', 'いちじゅうご', 'ごじゅう'], correctAnswer: 1, explanation: '15 = 10+5 = じゅうご' },
                                { sentence: '2 people in Japanese:', sentenceReading: '', sentenceEnglish: 'Choose the correct reading', options: ['にじん', 'にひと', 'ふたり', 'ふたにん'], correctAnswer: 2, explanation: '2 people = ふたり (irregular reading!)' },
                                { sentence: 'How do you say "How much?"', sentenceReading: '', sentenceEnglish: '', options: ['なんえん', 'いくら', 'どれくらい', 'なんぼ'], correctAnswer: 1, explanation: 'いくらですか is the standard way to ask "How much?"' },
                            ]
                        }
                    },
                    // Lesson 7: Number kanji practice
                    {
                        title: 'Number Kanji Practice', type: 'kanji_practice', content: {
                            instructions: 'Practice the kanji for numbers',
                            kanji: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '百', '千'],
                            readings: ['いち', 'に', 'さん', 'よん', 'ご', 'ろく', 'なな', 'はち', 'きゅう', 'じゅう', 'ひゃく', 'せん'],
                            meanings: ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'hundred', 'thousand']
                        }
                    },
                ]
            },
            {
                title: 'Unit 3: Time & Daily Routines',
                description: 'Learn to tell time, describe schedules, and talk about daily activities',
                lessons: [
                    // Lesson 1: Hour Basics (including irregulars)
                    {
                        title: 'Telling Hours (時)', type: 'theory', content: {
                            grammar: 'Hours with 時 (じ)',
                            explanation: 'Hours are expressed with number + 時 (ji). Watch out for irregular readings! 4時 is よじ (not しじ), 7時 is しちじ, and 9時 is くじ. These are JLPT N5 essentials.',
                            examples: [
                                { japanese: '一時', reading: 'いちじ', english: '1 o\'clock' },
                                { japanese: '四時', reading: 'よじ', english: '4 o\'clock (irregular!)' },
                                { japanese: '七時', reading: 'しちじ', english: '7 o\'clock (irregular!)' },
                                { japanese: '九時', reading: 'くじ', english: '9 o\'clock (irregular!)' },
                                { japanese: '十二時', reading: 'じゅうにじ', english: '12 o\'clock' },
                            ],
                            useCases: [
                                { correct: '四時です (よじです)', incorrect: '四時です (しじです)', explanation: '4 o\'clock uses よ not し - this is a very common mistake!' },
                                { correct: '九時です (くじです)', incorrect: '九時です (きゅうじです)', explanation: '9 o\'clock uses く not きゅう - shortened for easier pronunciation' },
                            ],
                        }
                    },
                    // Lesson 2: Time vocabulary with minutes, half, AM/PM
                    {
                        title: 'Time Vocabulary', type: 'vocab_lesson', content: {
                            vocabulary: [
                                { japanese: '一時', reading: 'いちじ', english: '1 o\'clock' },
                                { japanese: '二時', reading: 'にじ', english: '2 o\'clock' },
                                { japanese: '三時', reading: 'さんじ', english: '3 o\'clock' },
                                { japanese: '四時', reading: 'よじ', english: '4 o\'clock' },
                                { japanese: '五時', reading: 'ごじ', english: '5 o\'clock' },
                                { japanese: '六時', reading: 'ろくじ', english: '6 o\'clock' },
                                { japanese: '七時', reading: 'しちじ', english: '7 o\'clock' },
                                { japanese: '八時', reading: 'はちじ', english: '8 o\'clock' },
                                { japanese: '九時', reading: 'くじ', english: '9 o\'clock' },
                                { japanese: '十時', reading: 'じゅうじ', english: '10 o\'clock' },
                            ]
                        }
                    },
                    // Lesson 3: Half hour, minutes, AM/PM
                    {
                        title: 'Half Hour & Minutes', type: 'theory', content: {
                            grammar: '半 (han) and 分 (fun/pun)',
                            explanation: 'Half past = 時 + 半 (han). Minutes = number + 分 (fun/pun). Some minute numbers change: 1分=いっぷん, 3分=さんぷん, 6分=ろっぷん, 10分=じゅっぷん. For AM/PM: 午前 (gozen) = AM, 午後 (gogo) = PM.',
                            examples: [
                                { japanese: '三時半', reading: 'さんじはん', english: '3:30 (half past 3)' },
                                { japanese: '七時半', reading: 'しちじはん', english: '7:30 (half past 7)' },
                                { japanese: '五分', reading: 'ごふん', english: '5 minutes' },
                                { japanese: '十分', reading: 'じゅっぷん', english: '10 minutes (irregular!)' },
                                { japanese: '午前八時', reading: 'ごぜんはちじ', english: '8:00 AM' },
                                { japanese: '午後六時', reading: 'ごごろくじ', english: '6:00 PM' },
                            ],
                            useCases: [
                                { correct: '三時半に起きます', incorrect: '三時三十分に起きます', explanation: '半 is more natural for :30. 三十分 is technically correct but sounds stiff.' },
                            ],
                        }
                    },
                    // Lesson 4: Asking and answering time
                    {
                        title: 'What Time Is It?', type: 'grammar', content: {
                            questionType: 'multiple_choice',
                            questions: [
                                { sentence: '今、何時ですか。', sentenceReading: 'いま、なんじですか', sentenceEnglish: 'What time is it now?', options: ['三時です', '三です', '時三です', '三時間です'], correctAnswer: 0, explanation: 'Answer with [number]時です. 時間 means "hours (duration)" not "o\'clock"' },
                                { sentence: '四時 is read as:', sentenceReading: '', sentenceEnglish: 'Choose the correct reading', options: ['しじ', 'よじ', 'よんじ', 'しじゅう'], correctAnswer: 1, explanation: '4時 = よじ (not しじ or よんじ) - this is an irregular reading!' },
                                { sentence: '9時 is read as:', sentenceReading: '', sentenceEnglish: 'Choose the correct reading', options: ['きゅうじ', 'くじ', 'ここのつじ', 'ないんじ'], correctAnswer: 1, explanation: '9時 = くじ (not きゅうじ) - another common irregular!' },
                            ]
                        }
                    },
                    // Lesson 5: Daily Activities vocab (already converted to vocab_lesson)
                    {
                        title: 'Daily Activities Verbs', type: 'vocab_lesson', content: {
                            vocabulary: [
                                { japanese: '起きます', reading: 'おきます', english: 'to wake up' },
                                { japanese: '食べます', reading: 'たべます', english: 'to eat' },
                                { japanese: '行きます', reading: 'いきます', english: 'to go' },
                                { japanese: '寝ます', reading: 'ねます', english: 'to sleep' },
                                { japanese: '働きます', reading: 'はたらきます', english: 'to work' },
                                { japanese: '勉強します', reading: 'べんきょうします', english: 'to study' },
                            ]
                        }
                    },
                    // Lesson 6: Putting it together - daily schedule sentences
                    {
                        title: 'Describing Your Schedule', type: 'grammar', content: {
                            questionType: 'fill_blank',
                            questions: [
                                { sentence: '朝七時{_}起きます', sentenceReading: 'あさしちじ{_}おきます', sentenceEnglish: 'I wake up at 7 in the morning.', answer: 'に', hint: 'Time marker particle' },
                                { sentence: '午後六時{_}帰ります', sentenceReading: 'ごごろくじ{_}かえります', sentenceEnglish: 'I go home at 6 PM.', answer: 'に', hint: 'Time marker particle' },
                                { sentence: '毎日九時{_}寝ます', sentenceReading: 'まいにちくじ{_}ねます', sentenceEnglish: 'I sleep at 9 every day.', answer: 'に', hint: 'Time marker particle' },
                            ]
                        }
                    },
                ]
            },
            {
                title: 'Unit 4: Basic Verbs (ます Form)',
                description: 'Master polite verb conjugation, negation, and past tense',
                lessons: [
                    // Lesson 1: Introduction to ます Form
                    {
                        title: 'Introduction to ます Form', type: 'theory', content: {
                            grammar: 'Polite Verb Form (ます)',
                            explanation: 'The ます form is the polite present/future tense. Use it with teachers, strangers, and in formal situations. Japanese verbs don\'t change for person (I, you, he) - context determines who is doing the action. ます can mean "I do", "you do", "he does", "I will do" etc.',
                            examples: [
                                { japanese: '食べます', reading: 'たべます', english: 'eat / will eat' },
                                { japanese: '飲みます', reading: 'のみます', english: 'drink / will drink' },
                                { japanese: '行きます', reading: 'いきます', english: 'go / will go' },
                                { japanese: '来ます', reading: 'きます', english: 'come / will come' },
                            ],
                            useCases: [
                                { correct: '毎日コーヒーを飲みます', incorrect: '毎日コーヒーを飲む', explanation: 'Use ます form in polite/formal speech. 飲む is casual/dictionary form.' },
                            ],
                        }
                    },
                    // Lesson 2: Negative form (ません)
                    {
                        title: 'Negative Form (ません)', type: 'theory', content: {
                            grammar: 'Polite Negative (ません)',
                            explanation: 'To make a verb negative, change ます to ません. This means "do not / will not". Example: 食べます (eat) → 食べません (don\'t eat).',
                            examples: [
                                { japanese: '食べません', reading: 'たべません', english: 'don\'t eat / won\'t eat' },
                                { japanese: '飲みません', reading: 'のみません', english: 'don\'t drink' },
                                { japanese: '行きません', reading: 'いきません', english: 'don\'t go' },
                                { japanese: 'お酒を飲みません', reading: 'おさけをのみません', english: 'I don\'t drink alcohol' },
                            ],
                        }
                    },
                    // Lesson 3: Past tense (ました / ませんでした)
                    {
                        title: 'Past Tense (ました)', type: 'theory', content: {
                            grammar: 'Polite Past (ました / ませんでした)',
                            explanation: 'Past: ます → ました (did). Past negative: ます → ませんでした (didn\'t). Example: 食べます → 食べました (ate) → 食べませんでした (didn\'t eat).',
                            examples: [
                                { japanese: '食べました', reading: 'たべました', english: 'ate' },
                                { japanese: '行きました', reading: 'いきました', english: 'went' },
                                { japanese: '食べませんでした', reading: 'たべませんでした', english: 'didn\'t eat' },
                                { japanese: '昨日、映画を見ました', reading: 'きのう、えいがをみました', english: 'Yesterday, I watched a movie' },
                            ],
                        }
                    },
                    // Lesson 4: Common verbs vocabulary
                    {
                        title: 'Common Verbs', type: 'vocab_lesson', content: {
                            vocabulary: [
                                { japanese: '食べます', reading: 'たべます', english: 'to eat' },
                                { japanese: '飲みます', reading: 'のみます', english: 'to drink' },
                                { japanese: '行きます', reading: 'いきます', english: 'to go' },
                                { japanese: '来ます', reading: 'きます', english: 'to come' },
                                { japanese: '見ます', reading: 'みます', english: 'to see/watch' },
                                { japanese: '聞きます', reading: 'ききます', english: 'to hear/listen' },
                                { japanese: '書きます', reading: 'かきます', english: 'to write' },
                                { japanese: '読みます', reading: 'よみます', english: 'to read' },
                                { japanese: '買います', reading: 'かいます', english: 'to buy' },
                                { japanese: '会います', reading: 'あいます', english: 'to meet' },
                            ]
                        }
                    },
                    // Lesson 5: Conjugation practice
                    {
                        title: 'Verb Conjugation Practice', type: 'grammar', content: {
                            questionType: 'multiple_choice',
                            questions: [
                                { sentence: 'Negative of 食べます:', sentenceReading: '', sentenceEnglish: '', options: ['食べます', '食べません', '食べました', '食べる'], correctAnswer: 1, explanation: 'ます → ません for negative' },
                                { sentence: 'Past of 行きます:', sentenceReading: '', sentenceEnglish: '', options: ['行きます', '行きません', '行きました', '行く'], correctAnswer: 2, explanation: 'ます → ました for past tense' },
                                { sentence: '"I didn\'t drink" is:', sentenceReading: '', sentenceEnglish: '', options: ['飲みます', '飲みました', '飲みません', '飲みませんでした'], correctAnswer: 3, explanation: 'Past negative: ます → ませんでした' },
                            ]
                        }
                    },
                    // Lesson 6: Sentence building practice
                    {
                        title: 'Making Sentences', type: 'grammar', content: {
                            questionType: 'fill_blank',
                            questions: [
                                { sentence: '朝ごはんを{_}', sentenceReading: 'あさごはんを{_}', sentenceEnglish: 'I eat breakfast.', answer: '食べます', hint: 'polite form of to eat' },
                                { sentence: '昨日、本を{_}', sentenceReading: 'きのう、ほんを{_}', sentenceEnglish: 'Yesterday, I read a book.', answer: '読みました', hint: 'past tense of to read' },
                                { sentence: 'お茶を{_}か', sentenceReading: 'おちゃを{_}か', sentenceEnglish: 'Do you drink tea?', answer: '飲みます', hint: 'polite form of to drink' },
                            ]
                        }
                    },
                ]
            },
            {
                title: 'Unit 5: Particles (は, が, を, に)',
                description: 'Master the essential Japanese particles that connect words in sentences',
                lessons: [
                    // Lesson 1: は - The Topic Marker
                    {
                        title: 'Topic Marker は', type: 'theory', content: {
                            grammar: 'The Topic Particle は',
                            explanation: 'は (pronounced "wa") marks the TOPIC of the sentence - what you\'re talking about. It answers "As for X...". Think of it as setting the scene. 私は田中です = "As for me, I\'m Tanaka" = "I\'m Tanaka".',
                            examples: [
                                { japanese: '私は学生です', reading: 'わたしはがくせいです', english: 'I am a student (As for me, student)' },
                                { japanese: '今日は暑いです', reading: 'きょうはあついです', english: 'Today is hot (As for today, it\'s hot)' },
                                { japanese: 'これは本です', reading: 'これはほんです', english: 'This is a book' },
                            ],
                            useCases: [
                                { correct: '私は会社員です', incorrect: '私が会社員です', explanation: 'For self-introduction, use は. Use が when answering "WHO is the office worker?"' },
                            ],
                        }
                    },
                    // Lesson 2: を - The Object Marker
                    {
                        title: 'Object Marker を', type: 'theory', content: {
                            grammar: 'The Object Particle を',
                            explanation: 'を (pronounced "o") marks the DIRECT OBJECT - the thing receiving the action. Pattern: [object]を[verb]. Example: パンを食べます = I eat bread (bread receives the eating action).',
                            examples: [
                                { japanese: 'ご飯を食べます', reading: 'ごはんをたべます', english: 'I eat rice' },
                                { japanese: '水を飲みます', reading: 'みずをのみます', english: 'I drink water' },
                                { japanese: '本を読みます', reading: 'ほんをよみます', english: 'I read a book' },
                                { japanese: '映画を見ます', reading: 'えいがをみます', english: 'I watch a movie' },
                            ],
                        }
                    },
                    // Lesson 3: に - Direction/Time/Existence
                    {
                        title: 'Direction & Time Marker に', type: 'theory', content: {
                            grammar: 'The Particle に (Direction, Time, Location)',
                            explanation: 'に has three main uses: 1) DIRECTION: 学校に行きます (go TO school), 2) TIME: 七時に起きます (wake up AT 7), 3) EXISTENCE LOCATION: 東京にいます (I am IN Tokyo). Think of に as "at/to/in" for specific points.',
                            examples: [
                                { japanese: '学校に行きます', reading: 'がっこうにいきます', english: 'I go TO school (direction)' },
                                { japanese: '六時に起きます', reading: 'ろくじにおきます', english: 'I wake up AT 6 (time)' },
                                { japanese: '東京に住んでいます', reading: 'とうきょうにすんでいます', english: 'I live IN Tokyo (location)' },
                                { japanese: '友達に会います', reading: 'ともだちにあいます', english: 'I meet (with) a friend' },
                            ],
                        }
                    },
                    // Lesson 4: で - Location of Action
                    {
                        title: 'Action Location Marker で', type: 'theory', content: {
                            grammar: 'The Particle で (Location of Action, Means)',
                            explanation: 'で marks WHERE an action happens or HOW/BY WHAT MEANS. Compare: 学校にいます (I am AT school - existence) vs 学校で勉強します (I study AT school - action happens there). Also: バスで行きます (I go BY bus).',
                            examples: [
                                { japanese: '図書館で勉強します', reading: 'としょかんでべんきょうします', english: 'I study AT the library' },
                                { japanese: 'レストランで食べます', reading: 'レストランでたべます', english: 'I eat AT the restaurant' },
                                { japanese: 'バスで行きます', reading: 'バスでいきます', english: 'I go BY bus' },
                                { japanese: '日本語で話します', reading: 'にほんごではなします', english: 'I speak IN Japanese' },
                            ],
                        }
                    },
                    // Lesson 5: が - Subject (New Info/Question Words)
                    {
                        title: 'Subject Marker が', type: 'theory', content: {
                            grammar: 'The Subject Particle が',
                            explanation: 'が marks the SUBJECT, especially for: 1) NEW information: 田中さんが来ました (Tanaka came - new info!), 2) QUESTION WORDS: 誰が来ましたか (WHO came?), 3) After certain words like すき (like), ほしい (want), できる (can). Don\'t overthink は vs が early on - focus on patterns!',
                            examples: [
                                { japanese: '誰が来ましたか', reading: 'だれがきましたか', english: 'WHO came? (question word)' },
                                { japanese: '田中さんが来ました', reading: 'たなかさんがきました', english: 'Mr. Tanaka came (answering who)' },
                                { japanese: '猫が好きです', reading: 'ねこがすきです', english: 'I like cats (cats are liked)' },
                                { japanese: '日本語ができます', reading: 'にほんごができます', english: 'I can (do) Japanese' },
                            ],
                        }
                    },
                    // Lesson 6: Comprehensive particle practice
                    {
                        title: 'Particle Practice', type: 'grammar', content: {
                            questionType: 'fill_blank',
                            questions: [
                                { sentence: 'パン{_}食べます', sentenceReading: 'ぱん{_}たべます', sentenceEnglish: 'I eat bread.', answer: 'を', hint: 'Object marker - bread is being eaten' },
                                { sentence: '学校{_}行きます', sentenceReading: 'がっこう{_}いきます', sentenceEnglish: 'I go to school.', answer: 'に', hint: 'Direction marker - going TO somewhere' },
                                { sentence: '私{_}日本人です', sentenceReading: 'わたし{_}にほんじんです', sentenceEnglish: 'I am Japanese.', answer: 'は', hint: 'Topic marker - introducing myself' },
                                { sentence: '図書館{_}本を読みます', sentenceReading: 'としょかん{_}ほんをよみます', sentenceEnglish: 'I read books at the library.', answer: 'で', hint: 'Location of action - where reading happens' },
                                { sentence: '誰{_}来ましたか', sentenceReading: 'だれ{_}きましたか', sentenceEnglish: 'Who came?', answer: 'が', hint: 'Subject with question word' },
                            ]
                        }
                    },
                    // Lesson 7: More practice - に vs で
                    {
                        title: 'に vs で Practice', type: 'grammar', content: {
                            questionType: 'multiple_choice',
                            questions: [
                                { sentence: '東京___住んでいます', sentenceReading: 'とうきょう___すんでいます', sentenceEnglish: 'I live in Tokyo', options: ['に', 'で', 'を', 'は'], correctAnswer: 0, explanation: 'に for existence/living location' },
                                { sentence: '東京___働いています', sentenceReading: 'とうきょう___はたらいています', sentenceEnglish: 'I work in Tokyo', options: ['に', 'で', 'を', 'は'], correctAnswer: 1, explanation: 'で for location where action happens' },
                                { sentence: '電車___行きます', sentenceReading: 'でんしゃ___いきます', sentenceEnglish: 'I go by train', options: ['に', 'で', 'を', 'は'], correctAnswer: 1, explanation: 'で for means of transportation' },
                            ]
                        }
                    },
                ]
            },
            // ============ UNIT 6: DEMONSTRATIVES ============
            {
                title: 'Unit 6: Demonstratives (これ・それ・あれ)',
                description: 'Learn to point to and identify objects using Japanese demonstratives',
                lessons: [
                    {
                        title: 'This, That, That Over There', type: 'theory', content: {
                            grammar: 'Demonstrative Pronouns',
                            explanation: 'これ (this - near speaker), それ (that - near listener), あれ (that over there - far from both). Add の to make them modify nouns: この本 (this book).',
                            examples: [
                                { japanese: 'これはペンです', reading: 'kore wa pen desu', english: 'This is a pen' },
                                { japanese: 'それは何ですか', reading: 'sore wa nan desu ka', english: 'What is that?' },
                                { japanese: 'あれは学校です', reading: 'are wa gakkou desu', english: 'That (over there) is a school' },
                            ]
                        }
                    },
                    {
                        title: 'Demonstrative Vocabulary', type: 'vocab_drill', content: {
                            instructions: 'Type the reading for each word',
                            characters: ['これ', 'それ', 'あれ', 'この', 'その', 'あの', 'ここ', 'そこ', 'あそこ'],
                            romaji: ['kore', 'sore', 'are', 'kono', 'sono', 'ano', 'koko', 'soko', 'asoko']
                        }
                    },
                    {
                        title: 'Demonstrative Practice', type: 'grammar', content: {
                            questionType: 'fill_blank',
                            questions: [
                                { sentence: '{_}は本です', sentenceReading: '{_}はほんです', sentenceEnglish: 'This is a book.', answer: 'これ', hint: 'Near the speaker' },
                                { sentence: '{_}は何ですか', sentenceReading: '{_}はなんですか', sentenceEnglish: 'What is that (near you)?', answer: 'それ', hint: 'Near the listener' },
                                { sentence: '{_}本は私のです', sentenceReading: '{_}ほんはわたしのです', sentenceEnglish: 'This book is mine.', answer: 'この', hint: 'This + noun' },
                                { sentence: '{_}は駅です', sentenceReading: '{_}はえきです', sentenceEnglish: 'That over there is a station.', answer: 'あれ', hint: 'Far from both speaker and listener' },
                            ]
                        }
                    },
                    {
                        title: 'Build Demonstrative Sentences', type: 'grammar', content: {
                            grammarPoint: 'これ/それ/あれ + は + Noun + です',
                            questionType: 'word_bank',
                            questions: [
                                {
                                    targetSentence: 'これはペンです',
                                    targetReading: 'これはぺんです',
                                    targetEnglish: 'This is a pen.',
                                    words: ['です', 'は', 'ペン', 'これ'],
                                    wordsReading: ['です', 'は', 'ぺん', 'これ'],
                                    correctOrder: [3, 1, 2, 0],
                                },
                                {
                                    targetSentence: 'それは何ですか',
                                    targetReading: 'それはなんですか',
                                    targetEnglish: 'What is that?',
                                    words: ['何', 'ですか', 'それ', 'は'],
                                    wordsReading: ['なん', 'ですか', 'それ', 'は'],
                                    correctOrder: [2, 3, 0, 1],
                                },
                            ]
                        }
                    },
                ]
            },
            // ============ UNIT 7: LOCATIONS & EXISTENCE ============
            {
                title: 'Unit 7: Location & Existence (います・あります)',
                description: 'Learn to describe where things and people are located',
                lessons: [
                    {
                        title: 'います vs あります', type: 'theory', content: {
                            grammar: 'Existence Verbs',
                            explanation: 'います (imasu) is used for living things (people, animals). あります (arimasu) is used for non-living things. Location is marked with に.',
                            examples: [
                                { japanese: '猫がいます', reading: 'neko ga imasu', english: 'There is a cat' },
                                { japanese: '本があります', reading: 'hon ga arimasu', english: 'There is a book' },
                                { japanese: '部屋に猫がいます', reading: 'heya ni neko ga imasu', english: 'There is a cat in the room' },
                            ]
                        }
                    },
                    {
                        title: 'Location Vocabulary', type: 'vocab_lesson', content: {
                            vocabulary: [
                                { japanese: '上', reading: 'うえ', english: 'above/on top' },
                                { japanese: '下', reading: 'した', english: 'below/under' },
                                { japanese: '中', reading: 'なか', english: 'inside/middle' },
                                { japanese: '前', reading: 'まえ', english: 'in front' },
                                { japanese: '後ろ', reading: 'うしろ', english: 'behind' },
                                { japanese: '右', reading: 'みぎ', english: 'right' },
                                { japanese: '左', reading: 'ひだり', english: 'left' },
                                { japanese: '隣', reading: 'となり', english: 'next to' },
                                { japanese: '近く', reading: 'ちかく', english: 'nearby' },
                            ]
                        }
                    },
                    {
                        title: 'Location Kanji', type: 'kanji_practice', content: {
                            instructions: 'Learn kanji for locations',
                            kanji: ['上', '下', '中', '前', '後', '右', '左'],
                            readings: ['うえ', 'した', 'なか', 'まえ', 'うしろ', 'みぎ', 'ひだり'],
                            meanings: ['above', 'below', 'inside', 'front', 'behind', 'right', 'left']
                        }
                    },
                    {
                        title: 'Existence Practice', type: 'grammar', content: {
                            questionType: 'multiple_choice',
                            questions: [
                                {
                                    sentence: '猫が___',
                                    sentenceReading: 'ねこが___',
                                    sentenceEnglish: 'There is a cat.',
                                    options: ['あります', 'います', 'です', 'ます'],
                                    correctAnswer: 1,
                                    explanation: 'Use います for living things (animals, people).',
                                },
                                {
                                    sentence: '机の上に本が___',
                                    sentenceReading: 'つくえのうえにほんが___',
                                    sentenceEnglish: 'There is a book on the desk.',
                                    options: ['います', 'あります', 'です', 'ます'],
                                    correctAnswer: 1,
                                    explanation: 'Use あります for non-living things.',
                                },
                                {
                                    sentence: '公園に___がいます',
                                    sentenceReading: 'こうえんに___がいます',
                                    sentenceEnglish: 'There are ___ in the park. (living)',
                                    options: ['本', '机', '犬', 'ペン'],
                                    correctAnswer: 2,
                                    explanation: '犬 (dog) is a living thing, so います is correct.',
                                },
                            ]
                        }
                    },
                ]
            },
            // ============ UNIT 8: ADJECTIVES ============
            {
                title: 'Unit 8: Adjectives (い & な)',
                description: 'Describe things using Japanese adjectives',
                lessons: [
                    {
                        title: 'い-Adjectives and な-Adjectives', type: 'theory', content: {
                            grammar: 'Adjective Types',
                            explanation: 'い-adjectives end in い and can directly modify nouns. な-adjectives need な before nouns. Both can be used predicatively with です.',
                            examples: [
                                { japanese: '大きい犬', reading: 'ookii inu', english: 'big dog' },
                                { japanese: '静かな部屋', reading: 'shizuka na heya', english: 'quiet room' },
                                { japanese: 'この本は面白いです', reading: 'kono hon wa omoshiroi desu', english: 'This book is interesting' },
                            ]
                        }
                    },
                    {
                        title: 'Adjective Vocabulary', type: 'vocab_lesson', content: {
                            vocabulary: [
                                { japanese: '大きい', reading: 'おおきい', english: 'big' },
                                { japanese: '小さい', reading: 'ちいさい', english: 'small' },
                                { japanese: '新しい', reading: 'あたらしい', english: 'new' },
                                { japanese: '古い', reading: 'ふるい', english: 'old' },
                                { japanese: '高い', reading: 'たかい', english: 'tall/expensive' },
                                { japanese: '安い', reading: 'やすい', english: 'cheap' },
                                { japanese: '静か', reading: 'しずか', english: 'quiet' },
                                { japanese: '元気', reading: 'げんき', english: 'healthy/energetic' },
                                { japanese: '好き', reading: 'すき', english: 'like' },
                            ]
                        }
                    },
                    {
                        title: 'Adjective Kanji', type: 'kanji_practice', content: {
                            instructions: 'Learn kanji for common adjectives',
                            kanji: ['大', '小', '新', '古', '高', '安', '長', '短'],
                            readings: ['おお', 'ちい', 'あたら', 'ふる', 'たか', 'やす', 'なが', 'みじか'],
                            meanings: ['big', 'small', 'new', 'old', 'tall/expensive', 'cheap', 'long', 'short']
                        }
                    },
                    {
                        title: 'Adjective Practice', type: 'grammar', content: {
                            questionType: 'fill_blank',
                            questions: [
                                { sentence: 'この部屋は静か{_}です', sentenceReading: 'このへやはしずか{_}です', sentenceEnglish: 'This room is quiet.', answer: '', hint: 'な-adjective + です (no な needed before です)' },
                                { sentence: '新し{_}本を買いました', sentenceReading: 'あたらし{_}ほんをかいました', sentenceEnglish: 'I bought a new book.', answer: 'い', hint: 'い-adjective directly modifies noun' },
                                { sentence: '彼女は元気{_}人です', sentenceReading: 'かのじょはげんき{_}ひとです', sentenceEnglish: 'She is an energetic person.', answer: 'な', hint: 'な-adjective + な + noun' },
                            ]
                        }
                    },
                ]
            },
            // ============ UNIT 9: PAST TENSE ============
            {
                title: 'Unit 9: Past Tense',
                description: 'Learn to talk about past actions and states',
                lessons: [
                    {
                        title: 'Past Tense Formation', type: 'theory', content: {
                            grammar: 'ました / ませんでした / かった / なかった',
                            explanation: 'Verbs: ます→ました (did), ません→ませんでした (did not). い-adj: い→かった. な-adj: だ→だった. です→でした.',
                            examples: [
                                { japanese: '食べました', reading: 'tabemashita', english: 'I ate' },
                                { japanese: '面白かったです', reading: 'omoshirokatta desu', english: 'It was interesting' },
                                { japanese: '昨日は暇でした', reading: 'kinou wa hima deshita', english: 'Yesterday I was free' },
                            ]
                        }
                    },
                    {
                        title: 'Time Word Vocabulary', type: 'vocab_lesson', content: {
                            vocabulary: [
                                { japanese: '昨日', reading: 'きのう', english: 'yesterday' },
                                { japanese: '先週', reading: 'せんしゅう', english: 'last week' },
                                { japanese: '先月', reading: 'せんげつ', english: 'last month' },
                                { japanese: '去年', reading: 'きょねん', english: 'last year' },
                                { japanese: 'さっき', reading: 'さっき', english: 'just now' },
                                { japanese: '今朝', reading: 'けさ', english: 'this morning' },
                                { japanese: '昨夜', reading: 'ゆうべ', english: 'last night' },
                            ]
                        }
                    },
                    {
                        title: 'Past Tense Practice', type: 'grammar', content: {
                            questionType: 'fill_blank',
                            questions: [
                                { sentence: '昨日、映画を見{_}', sentenceReading: 'きのう、えいがをみ{_}', sentenceEnglish: 'I watched a movie yesterday.', answer: 'ました', hint: 'Polite past tense of verb' },
                                { sentence: 'この本は面白{_}です', sentenceReading: 'このほんはおもしろ{_}です', sentenceEnglish: 'This book was interesting.', answer: 'かった', hint: 'Past tense of い-adjective' },
                                { sentence: '先週、学校に行き{_}でした', sentenceReading: 'せんしゅう、がっこうにいき{_}でした', sentenceEnglish: 'I did not go to school last week.', answer: 'ません', hint: 'Polite negative past tense' },
                            ]
                        }
                    },
                    {
                        title: 'Build Past Tense Sentences', type: 'grammar', content: {
                            grammarPoint: 'Time + Action + ました',
                            questionType: 'word_bank',
                            questions: [
                                {
                                    targetSentence: '昨日ご飯を食べました',
                                    targetReading: 'きのうごはんをたべました',
                                    targetEnglish: 'I ate rice yesterday.',
                                    words: ['食べました', 'を', '昨日', 'ご飯'],
                                    wordsReading: ['たべました', 'を', 'きのう', 'ごはん'],
                                    correctOrder: [2, 3, 1, 0],
                                },
                                {
                                    targetSentence: '先週日本に行きました',
                                    targetReading: 'せんしゅうにほんにいきました',
                                    targetEnglish: 'I went to Japan last week.',
                                    words: ['先週', '行きました', 'に', '日本'],
                                    wordsReading: ['せんしゅう', 'いきました', 'に', 'にほん'],
                                    correctOrder: [0, 3, 2, 1],
                                },
                            ]
                        }
                    },
                ]
            },
            // ============ UNIT 10: TE-FORM & REQUESTS ============
            {
                title: 'Unit 10: て-Form & Requests',
                description: 'Learn the versatile て-form for requests and connecting actions',
                lessons: [
                    {
                        title: 'Introduction to て-Form', type: 'theory', content: {
                            grammar: 'て-Form Formation',
                            explanation: 'The て-form is one of the most useful verb forms. It connects actions and is used for requests (てください). Formation varies by verb type.',
                            examples: [
                                { japanese: '食べてください', reading: 'tabete kudasai', english: 'Please eat' },
                                { japanese: '見て、聞いて', reading: 'mite, kiite', english: 'Look and listen' },
                                { japanese: '待ってください', reading: 'matte kudasai', english: 'Please wait' },
                            ]
                        }
                    },
                    {
                        title: 'Common て-Form Verbs', type: 'vocab_lesson', content: {
                            vocabulary: [
                                { japanese: '食べて', reading: 'たべて', english: 'eat (te-form)' },
                                { japanese: '飲んで', reading: 'のんで', english: 'drink (te-form)' },
                                { japanese: '見て', reading: 'みて', english: 'see (te-form)' },
                                { japanese: '聞いて', reading: 'きいて', english: 'listen (te-form)' },
                                { japanese: '書いて', reading: 'かいて', english: 'write (te-form)' },
                                { japanese: '読んで', reading: 'よんで', english: 'read (te-form)' },
                                { japanese: '話して', reading: 'はなして', english: 'speak (te-form)' },
                                { japanese: '待って', reading: 'まって', english: 'wait (te-form)' },
                            ]
                        }
                    },
                    {
                        title: 'Request Practice', type: 'grammar', content: {
                            questionType: 'fill_blank',
                            questions: [
                                { sentence: 'ここに座っ{_}ください', sentenceReading: 'ここにすわっ{_}ください', sentenceEnglish: 'Please sit here.', answer: 'て', hint: 'て-form + ください' },
                                { sentence: '日本語で話し{_}ください', sentenceReading: 'にほんごではなし{_}ください', sentenceEnglish: 'Please speak in Japanese.', answer: 'て', hint: 'て-form + ください' },
                                { sentence: 'ちょっと待っ{_}', sentenceReading: 'ちょっとまっ{_}', sentenceEnglish: 'Wait a moment. (casual)', answer: 'て', hint: 'Casual request uses just て-form' },
                            ]
                        }
                    },
                    {
                        title: 'Build Request Sentences', type: 'grammar', content: {
                            grammarPoint: 'Verb(て) + ください',
                            questionType: 'word_bank',
                            questions: [
                                {
                                    targetSentence: '窓を開けてください',
                                    targetReading: 'まどをあけてください',
                                    targetEnglish: 'Please open the window.',
                                    words: ['窓', 'ください', 'を', '開けて'],
                                    wordsReading: ['まど', 'ください', 'を', 'あけて'],
                                    correctOrder: [0, 2, 3, 1],
                                },
                                {
                                    targetSentence: 'もう一度言ってください',
                                    targetReading: 'もういちどいってください',
                                    targetEnglish: 'Please say it one more time.',
                                    words: ['一度', 'ください', 'もう', '言って'],
                                    wordsReading: ['いちど', 'ください', 'もう', 'いって'],
                                    correctOrder: [2, 0, 3, 1],
                                },
                            ]
                        }
                    },
                ]
            },
            // ============ UNIT 11: FINAL REVIEW ============
            {
                title: 'Unit 11: N5 Final Review',
                description: 'Comprehensive review of all N5 grammar and vocabulary',
                lessons: [
                    {
                        title: 'Grammar Review', type: 'theory', content: {
                            grammar: 'N5 Grammar Summary',
                            explanation: 'Review all major grammar points: は/が, particles, adjectives, て-form, past tense, and demonstratives.',
                            examples: [
                                { japanese: '私は学生です', reading: 'watashi wa gakusei desu', english: 'I am a student (Basic sentence)' },
                                { japanese: '昨日、面白い本を読みました', reading: 'kinou, omoshiroi hon wo yomimashita', english: 'I read an interesting book yesterday (Past + adj)' },
                                { japanese: 'ここに座ってください', reading: 'koko ni suwatte kudasai', english: 'Please sit here (te-form request)' },
                            ]
                        }
                    },
                    {
                        title: 'Mixed Particle Review', type: 'grammar', content: {
                            questionType: 'multiple_choice',
                            questions: [
                                {
                                    sentence: '私___田中です',
                                    sentenceReading: 'わたし___たなかです',
                                    sentenceEnglish: 'I am Tanaka.',
                                    options: ['が', 'を', 'は', 'に'],
                                    correctAnswer: 2,
                                    explanation: 'は marks the topic.',
                                },
                                {
                                    sentence: '本___読みます',
                                    sentenceReading: 'ほん___よみます',
                                    sentenceEnglish: 'I read a book.',
                                    options: ['は', 'を', 'に', 'で'],
                                    correctAnswer: 1,
                                    explanation: 'を marks the direct object.',
                                },
                                {
                                    sentence: '学校___行きます',
                                    sentenceReading: 'がっこう___いきます',
                                    sentenceEnglish: 'I go to school.',
                                    options: ['を', 'が', 'に', 'は'],
                                    correctAnswer: 2,
                                    explanation: 'に marks the destination.',
                                },
                                {
                                    sentence: '猫___います',
                                    sentenceReading: 'ねこ___います',
                                    sentenceEnglish: 'There is a cat.',
                                    options: ['は', 'を', 'が', 'に'],
                                    correctAnswer: 2,
                                    explanation: 'が marks the subject with existence verbs.',
                                },
                            ]
                        }
                    },
                    {
                        title: 'Comprehensive Sentence Building', type: 'grammar', content: {
                            grammarPoint: 'Mixed N5 Patterns',
                            questionType: 'word_bank',
                            questions: [
                                {
                                    targetSentence: '私の友達は日本人です',
                                    targetReading: 'わたしのともだちはにほんじんです',
                                    targetEnglish: 'My friend is Japanese.',
                                    words: ['友達', 'です', '私', 'は', 'の', '日本人'],
                                    wordsReading: ['ともだち', 'です', 'わたし', 'は', 'の', 'にほんじん'],
                                    correctOrder: [2, 4, 0, 3, 5, 1],
                                },
                                {
                                    targetSentence: '駅の前にバス停があります',
                                    targetReading: 'えきのまえにばすていがあります',
                                    targetEnglish: 'There is a bus stop in front of the station.',
                                    words: ['の', 'があります', '前', '駅', 'に', 'バス停'],
                                    wordsReading: ['の', 'があります', 'まえ', 'えき', 'に', 'ばすてい'],
                                    correctOrder: [3, 0, 2, 4, 5, 1],
                                },
                            ]
                        }
                    },
                ]
            },
        ];

        for (let i = 0; i < unitDefinitions.length; i++) {
            const unitDef = unitDefinitions[i];

            const [unit] = await db.insert(units).values({
                courseId: n5Course.id,
                title: unitDef.title,
                description: unitDef.description,
                order: i,
            }).returning();

            console.log(`   📦 Unit ${i}: ${unitDef.title}`);

            for (let j = 0; j < unitDef.lessons.length; j++) {
                const lessonDef = unitDef.lessons[j];
                await db.insert(lessons).values({
                    unitId: unit.id,
                    type: lessonDef.type,
                    title: lessonDef.title,
                    content: lessonDef.content,
                    order: j,
                    requiredVocabulary: [],
                    requiredKanji: [],
                });
            }
            console.log(`      ✓ ${unitDef.lessons.length} lessons created`);
        }

        // ============ SEED N4 UNITS ============
        console.log('\\n📦 Seeding N4 units and lessons...');

        const n4UnitDefinitions = [
            {
                title: 'Unit 1: Verb Forms (Potential, Passive, Causative)',
                description: 'Master advanced verb conjugations used in everyday Japanese',
                lessons: [
                    {
                        title: 'Potential Form (~られる/~える)', type: 'theory', content: {
                            grammar: 'Potential Form',
                            explanation: 'The potential form expresses ability or possibility. Group 1 verbs: replace う with える. Group 2 verbs: replace る with られる. Irregular: する→できる, くる→こられる. Note: With potential form, use が instead of を for the object!',
                            formation: 'Group 1: う→える | Group 2: る→られる',
                            examples: [
                                { japanese: '日本語が話せます', reading: 'nihongo ga hanasemasu', english: 'I can speak Japanese' },
                                { japanese: '漢字が読めますか', reading: 'kanji ga yomemasu ka', english: 'Can you read kanji?' },
                                { japanese: '明日来られますか', reading: 'ashita koraremasu ka', english: 'Can you come tomorrow?' },
                                { japanese: '一人で出来ます', reading: 'hitori de dekimasu', english: 'I can do it by myself' },
                            ],
                            useCases: [
                                {
                                    correct: '日本語が話せます',
                                    incorrect: '日本語を話せます',
                                    explanation: 'With potential form, use が (not を) to mark what you can do.',
                                },
                                {
                                    correct: '泳げる (can swim)',
                                    incorrect: '泳ぐられる',
                                    explanation: 'Group 1 verbs change う→える, not by adding られる.',
                                },
                            ],
                            commonMistakes: [
                                {
                                    mistake: 'Using を with potential form',
                                    correction: 'Use が instead: 漢字が読める (O) not 漢字を読める (X)',
                                    why: 'The potential form changes the grammatical structure - the object becomes the subject of the ability.',
                                },
                                {
                                    mistake: 'Confusing potential and passive (both use られる for Group 2)',
                                    correction: 'Potential: 食べられる = can eat. Passive: 食べられる = was eaten.',
                                    why: 'Context determines meaning! "りんごが食べられる" = can eat apple. "りんごに食べられた" = was eaten by apple (nonsense, so clearly passive)',
                                },
                            ],
                            quickCheck: [
                                {
                                    question: 'What is the potential form of 読む (to read)?',
                                    options: ['読まれる', '読める', '読ませる', '読んでいる'],
                                    answer: 1,
                                    explanation: '読む is Group 1 (u→e): む→める = 読める',
                                },
                                {
                                    question: 'Which particle is correct? "日本語___話せます"',
                                    options: ['を', 'が', 'に', 'で'],
                                    answer: 1,
                                    explanation: 'With potential form, use が to mark what you can do.',
                                },
                            ],
                        }
                    },
                    {
                        title: 'Passive Form (~られる)', type: 'theory', content: {
                            grammar: 'Passive Form',
                            explanation: 'The passive form is used when the subject receives an action. Group 1 verbs: replace う with あれる. Group 2 verbs: replace る with られる.',
                            examples: [
                                { japanese: '彼に褒められました', reading: 'kare ni homeraremashita', english: 'I was praised by him' },
                                { japanese: '電車で足を踏まれた', reading: 'densha de ashi wo fumareta', english: 'My foot was stepped on in the train' },
                                { japanese: '雨に降られた', reading: 'ame ni furareta', english: 'I was caught in the rain' },
                            ]
                        }
                    },
                    {
                        title: 'Causative Form (~させる)', type: 'theory', content: {
                            grammar: 'Causative Form',
                            explanation: 'The causative form means to make or let someone do something. Group 1 verbs: replace う with あせる. Group 2 verbs: replace る with させる.',
                            examples: [
                                { japanese: '子供に野菜を食べさせる', reading: 'kodomo ni yasai wo tabesaseru', english: 'I make my child eat vegetables' },
                                { japanese: '友達を待たせてしまった', reading: 'tomodachi wo matasete shimatta', english: 'I made my friend wait' },
                                { japanese: '好きにさせてください', reading: 'suki ni sasete kudasai', english: 'Please let me do as I like' },
                            ]
                        }
                    },
                ]
            },
            {
                title: 'Unit 2: Conditionals (たら・ば・なら・と)',
                description: 'Learn all four conditional forms and when to use each',
                lessons: [
                    {
                        title: '~たら Conditional', type: 'theory', content: {
                            grammar: '~たら (if/when)',
                            explanation: 'たら is the most versatile conditional. It means "if" or "when" and is formed by adding ら to the past tense. Use たら when the result depends on the condition happening first.',
                            formation: 'Past tense (た/だ) + ら',
                            examples: [
                                { japanese: '雨が降ったら、家にいます', reading: 'ame ga futtara, ie ni imasu', english: 'If it rains, I will stay home' },
                                { japanese: '日本に行ったら、寿司を食べたい', reading: 'nihon ni ittara, sushi wo tabetai', english: 'When I go to Japan, I want to eat sushi' },
                                { japanese: '安かったら、買います', reading: 'yasukattara, kaimasu', english: 'If it is cheap, I will buy it' },
                            ],
                            useCases: [
                                {
                                    correct: '駅に着いたら、電話してください',
                                    incorrect: '駅に着くと、電話してください',
                                    explanation: 'Use たら when asking someone to do something after a condition. と cannot be used for requests.',
                                },
                                {
                                    correct: '暇だったら、遊びに来て',
                                    incorrect: '暇なら、遊びに来て',
                                    explanation: 'Both work, but たら focuses on "if you happen to be free" while なら focuses on "if it is the case that you are free".',
                                },
                            ],
                            commonMistakes: [
                                {
                                    mistake: 'Using と for requests: 着くと、電話して ✗',
                                    correction: 'Use たら for requests: 着いたら、電話して ✓',
                                    why: 'と implies natural/automatic result and cannot be used with commands, requests, or suggestions.',
                                },
                            ],
                            quickCheck: [
                                {
                                    question: 'How do you form ~たら from 食べる?',
                                    options: ['食べるたら', '食べたら', '食べれば', '食べると'],
                                    answer: 1,
                                    explanation: 'Change to past tense (食べた) + ら = 食べたら',
                                },
                                {
                                    question: 'Which conditional can be used with requests?',
                                    options: ['~と', '~たら', 'Both', 'Neither'],
                                    answer: 1,
                                    explanation: '~と cannot be used with requests, only ~たら and other conditionals.',
                                },
                            ],
                        }
                    },
                    {
                        title: '~ば Conditional', type: 'theory', content: {
                            grammar: '~ば (if)',
                            explanation: 'ば is a hypothetical conditional. Verbs: replace the final vowel with えば. い-adj: replace い with ければ.',
                            examples: [
                                { japanese: '安ければ、買います', reading: 'yasukereba, kaimasu', english: 'If it is cheap, I will buy it' },
                                { japanese: '勉強すれば、受かる', reading: 'benkyou sureba, ukaru', english: 'If you study, you will pass' },
                            ]
                        }
                    },
                    {
                        title: '~と Conditional', type: 'theory', content: {
                            grammar: '~と (when/if - natural consequence)',
                            explanation: 'と expresses natural or habitual consequences. The result always follows from the condition.',
                            examples: [
                                { japanese: '春になると、桜が咲く', reading: 'haru ni naru to, sakura ga saku', english: 'When spring comes, cherry blossoms bloom' },
                                { japanese: 'このボタンを押すと、ドアが開く', reading: 'kono botan wo osu to, doa ga aku', english: 'If you press this button, the door opens' },
                            ]
                        }
                    },
                    {
                        title: '~なら Conditional', type: 'theory', content: {
                            grammar: '~なら (if it is the case that)',
                            explanation: 'なら is used for topic-based conditions, often giving advice or making suggestions.',
                            examples: [
                                { japanese: '日本語を勉強するなら、この本がいい', reading: 'nihongo wo benkyou suru nara, kono hon ga ii', english: 'If you are going to study Japanese, this book is good' },
                                { japanese: '行くなら、傘を持っていって', reading: 'iku nara, kasa wo motte itte', english: 'If you are going, take an umbrella' },
                            ]
                        }
                    },
                ]
            },
            {
                title: 'Unit 3: て-Form Extensions',
                description: 'Expand your knowledge with advanced て-form patterns',
                lessons: [
                    {
                        title: '~てある (resultant state)', type: 'theory', content: {
                            grammar: '~てある',
                            explanation: 'てある describes a state resulting from a deliberate action. Used with transitive verbs.',
                            examples: [
                                { japanese: '窓が開けてある', reading: 'mado ga akete aru', english: 'The window has been opened (and is still open)' },
                                { japanese: '予約してあります', reading: 'yoyaku shite arimasu', english: 'A reservation has been made' },
                            ]
                        }
                    },
                    {
                        title: '~ておく (preparation)', type: 'theory', content: {
                            grammar: '~ておく',
                            explanation: 'ておく means to do something in advance or for future convenience.',
                            examples: [
                                { japanese: '明日の準備をしておく', reading: 'ashita no junbi wo shite oku', english: 'I will prepare for tomorrow (in advance)' },
                                { japanese: '調べておきます', reading: 'shirabete okimasu', english: 'I will look it up (beforehand)' },
                            ]
                        }
                    },
                    {
                        title: '~てしまう (completion/regret)', type: 'theory', content: {
                            grammar: '~てしまう',
                            explanation: 'てしまう indicates completion or sometimes expresses regret about an action.',
                            examples: [
                                { japanese: '本を全部読んでしまった', reading: 'hon wo zenbu yonde shimatta', english: 'I finished reading the whole book' },
                                { japanese: '財布を忘れてしまった', reading: 'saifu wo wasurete shimatta', english: 'I (unfortunately) forgot my wallet' },
                            ]
                        }
                    },
                    {
                        title: '~てみる (trying)', type: 'theory', content: {
                            grammar: '~てみる',
                            explanation: 'てみる means to try doing something to see what happens.',
                            examples: [
                                { japanese: '食べてみてください', reading: 'tabete mite kudasai', english: 'Please try eating it' },
                                { japanese: '日本に住んでみたい', reading: 'nihon ni sunde mitai', english: 'I want to try living in Japan' },
                            ]
                        }
                    },
                ]
            },
            {
                title: 'Unit 4: Expressions of Appearance',
                description: 'Learn to express how things appear or seem',
                lessons: [
                    {
                        title: '~そうだ (looks like)', type: 'theory', content: {
                            grammar: '~そうだ (appearance)',
                            explanation: 'そうだ attached to verb stems or adjective stems expresses how something looks or appears.',
                            examples: [
                                { japanese: '雨が降りそうだ', reading: 'ame ga furisou da', english: 'It looks like it will rain' },
                                { japanese: 'このケーキはおいしそう', reading: 'kono keeki wa oishisou', english: 'This cake looks delicious' },
                            ]
                        }
                    },
                    {
                        title: '~ようだ/~みたいだ (seems like)', type: 'theory', content: {
                            grammar: '~ようだ / ~みたいだ',
                            explanation: 'These express conjecture based on evidence. みたいだ is more casual.',
                            examples: [
                                { japanese: '彼は疲れているようだ', reading: 'kare wa tsukarete iru you da', english: 'He seems to be tired' },
                                { japanese: '誰もいないみたいだ', reading: 'dare mo inai mitai da', english: 'It seems like nobody is here' },
                            ]
                        }
                    },
                    {
                        title: '~らしい (I heard that / typical)', type: 'theory', content: {
                            grammar: '~らしい',
                            explanation: 'らしい expresses hearsay or typicality.',
                            examples: [
                                { japanese: '明日は雨らしい', reading: 'ashita wa ame rashii', english: 'I heard it will rain tomorrow' },
                                { japanese: '彼女は先生らしい', reading: 'kanojo wa sensei rashii', english: 'She is like a typical teacher' },
                            ]
                        }
                    },
                ]
            },
            {
                title: 'Unit 5: Giving and Receiving Actions',
                description: 'Master the directional expressions for giving and receiving',
                lessons: [
                    {
                        title: '~てあげる (do for someone)', type: 'theory', content: {
                            grammar: '~てあげる',
                            explanation: 'てあげる means to do something for someone else (as a favor).',
                            examples: [
                                { japanese: '友達に日本語を教えてあげた', reading: 'tomodachi ni nihongo wo oshiete ageta', english: 'I taught Japanese to my friend (as a favor)' },
                                { japanese: '荷物を持ってあげましょうか', reading: 'nimotsu wo motte agemashou ka', english: 'Shall I carry your luggage for you?' },
                            ]
                        }
                    },
                    {
                        title: '~てもらう (have someone do)', type: 'theory', content: {
                            grammar: '~てもらう',
                            explanation: 'てもらう means to have someone do something for you (receive the favor).',
                            examples: [
                                { japanese: '友達に手伝ってもらった', reading: 'tomodachi ni tetsudatte moratta', english: 'I had my friend help me' },
                                { japanese: '医者に診てもらいます', reading: 'isha ni mite moraimasu', english: 'I will have a doctor examine me' },
                            ]
                        }
                    },
                    {
                        title: '~てくれる (someone does for me)', type: 'theory', content: {
                            grammar: '~てくれる',
                            explanation: 'てくれる means someone does something for me/us (giving perspective).',
                            examples: [
                                { japanese: '母が弁当を作ってくれた', reading: 'haha ga bentou wo tsukutte kureta', english: 'My mother made me a bento' },
                                { japanese: '説明してくれませんか', reading: 'setsumei shite kuremasen ka', english: 'Could you please explain it to me?' },
                            ]
                        }
                    },
                ]
            },
            {
                title: 'Unit 6: N4 Kanji Practice',
                description: 'Learn and practice essential N4 kanji characters',
                lessons: [
                    {
                        title: 'N4 Kanji: Actions', type: 'kanji_practice', content: {
                            instructions: 'Learn kanji for common actions',
                            kanji: ['開', '閉', '届', '送', '届', '運', '動', '止', '起', '着'],
                            readings: ['あ-く', 'し-める', 'とど-く', 'おく-る', 'とど-ける', 'はこ-ぶ', 'うご-く', 'と-まる', 'お-きる', 'き-る'],
                            meanings: ['open', 'close', 'reach', 'send', 'deliver', 'carry', 'move', 'stop', 'wake up', 'wear/arrive']
                        }
                    },
                    {
                        title: 'N4 Kanji: Abstract Concepts', type: 'kanji_practice', content: {
                            instructions: 'Learn kanji for abstract concepts',
                            kanji: ['思', '考', '知', '教', '集', '別', '特', '使', '持', '待'],
                            readings: ['おも-う', 'かんが-える', 'し-る', 'おし-える', 'あつ-める', 'わか-れる', 'とく', 'つか-う', 'も-つ', 'ま-つ'],
                            meanings: ['think', 'consider', 'know', 'teach', 'gather', 'separate', 'special', 'use', 'hold', 'wait']
                        }
                    },
                    {
                        title: 'N4 Kanji: Seasons & Colors', type: 'kanji_practice', content: {
                            instructions: 'Learn kanji for seasons and colors',
                            kanji: ['春', '夏', '秋', '冬', '赤', '青', '黒', '色'],
                            readings: ['はる', 'なつ', 'あき', 'ふゆ', 'あか', 'あお', 'くろ', 'いろ'],
                            meanings: ['spring', 'summer', 'autumn', 'winter', 'red', 'blue', 'black', 'color']
                        }
                    },
                ]
            },
            {
                title: 'Unit 7: N4 Vocabulary Practice',
                description: 'Practice essential N4 vocabulary through drills',
                lessons: [
                    {
                        title: 'Transitive/Intransitive Verb Pairs', type: 'vocab_drill', content: {
                            instructions: 'Type the reading for these verb pairs',
                            characters: ['開ける', '開く', '閉める', '閉まる', '始める', '始まる', '終える', '終わる'],
                            romaji: ['akeru', 'aku', 'shimeru', 'shimaru', 'hajimeru', 'hajimaru', 'oeru', 'owaru']
                        }
                    },
                    {
                        title: 'N4 Adjectives', type: 'vocab_drill', content: {
                            instructions: 'Type the reading for these adjectives',
                            characters: ['浅い', '深い', '固い', '柔らかい', '珍しい', '正しい', '悲しい', '嬉しい'],
                            romaji: ['asai', 'fukai', 'katai', 'yawarakai', 'mezurashii', 'tadashii', 'kanashii', 'ureshii']
                        }
                    },
                    {
                        title: 'N4 Expressions', type: 'vocab_drill', content: {
                            instructions: 'Type the reading for these common expressions',
                            characters: ['お疲れ様', 'お待たせしました', 'お大事に', 'よろしくお願いします', 'ご馳走様'],
                            romaji: ['otsukaresama', 'omataseshimashita', 'odaijini', 'yoroshikuonegaishimasu', 'gochisousama']
                        }
                    },
                ]
            },
        ];

        for (let i = 0; i < n4UnitDefinitions.length; i++) {
            const unitDef = n4UnitDefinitions[i];

            const [unit] = await db.insert(units).values({
                courseId: n4Course.id,
                title: unitDef.title,
                description: unitDef.description,
                order: i,
            }).returning();

            console.log(`   📦 Unit ${i}: ${unitDef.title}`);

            for (let j = 0; j < unitDef.lessons.length; j++) {
                const lessonDef = unitDef.lessons[j];
                await db.insert(lessons).values({
                    unitId: unit.id,
                    type: lessonDef.type,
                    title: lessonDef.title,
                    content: lessonDef.content,
                    order: j,
                    requiredVocabulary: [],
                    requiredKanji: [],
                });
            }
            console.log(`      ✓ ${unitDef.lessons.length} lessons created`);
        }

        // ============ SEED MOCK EXAM ============
        console.log('\n📝 Seeding comprehensive mock exam...');

        await db.insert(mockExams).values({
            level: 'N5',
            title: 'N5 Practice Test 1',
            description: 'A comprehensive practice test covering all N5 material',
            sections: [
                {
                    type: 'vocabulary' as const,
                    questionCount: 15,
                    timeLimit: 15,
                    questions: [
                        { id: 1, question: '「学生」の読み方は？', options: ['がくせい', 'せいがく', 'がっせい', 'せいと'], correctAnswer: 0, explanation: '学生 means student' },
                        { id: 2, question: '「食べる」の意味は？', options: ['to drink', 'to eat', 'to sleep', 'to walk'], correctAnswer: 1, explanation: '食べる (たべる) means to eat' },
                        { id: 3, question: 'Which means "good morning"?', options: ['こんばんは', 'こんにちは', 'おはよう', 'さようなら'], correctAnswer: 2, explanation: 'おはよう is the informal way to say good morning' },
                        { id: 4, question: '「飲む」の読み方は？', options: ['たべる', 'のむ', 'いく', 'くる'], correctAnswer: 1, explanation: '飲む means to drink' },
                        { id: 5, question: '「明日」の意味は？', options: ['yesterday', 'today', 'tomorrow', 'next week'], correctAnswer: 2, explanation: '明日 (あした) means tomorrow' },
                        { id: 6, question: '「先生」は何ですか？', options: ['student', 'teacher', 'friend', 'parent'], correctAnswer: 1, explanation: '先生 (せんせい) means teacher' },
                        { id: 7, question: '「大きい」の反対は？', options: ['新しい', '高い', '小さい', '古い'], correctAnswer: 2, explanation: '小さい is the opposite of 大きい (big)' },
                        { id: 8, question: '「月曜日」は何曜日？', options: ['Sunday', 'Monday', 'Tuesday', 'Wednesday'], correctAnswer: 1, explanation: '月曜日 is Monday' },
                        { id: 9, question: '「水」の読み方は？', options: ['ひ', 'みず', 'やま', 'かわ'], correctAnswer: 1, explanation: '水 means water' },
                        { id: 10, question: '「駅」とは何ですか？', options: ['school', 'hospital', 'station', 'shop'], correctAnswer: 2, explanation: '駅 (えき) means train station' },
                    ]
                },
                {
                    type: 'grammar' as const,
                    questionCount: 15,
                    timeLimit: 20,
                    questions: [
                        { id: 1, question: '私___学生です。', questionReading: 'わたし___がくせいです。', options: ['が', 'を', 'は', 'に'], correctAnswer: 2, explanation: 'は is used as the topic marker' },
                        { id: 2, question: 'パン___食べます。', questionReading: 'ぱん___たべます。', options: ['は', 'を', 'に', 'で'], correctAnswer: 1, explanation: 'を marks the direct object' },
                        { id: 3, question: '学校___行きます。', questionReading: 'がっこう___いきます。', options: ['を', 'が', 'に', 'は'], correctAnswer: 2, explanation: 'に indicates direction/destination' },
                        { id: 4, question: '図書館___勉強します。', questionReading: 'としょかん___べんきょうします。', options: ['を', 'に', 'で', 'は'], correctAnswer: 2, explanation: 'で indicates where an action takes place' },
                        { id: 5, question: '友達___映画を見ます。', questionReading: 'ともだち___えいがをみます。', options: ['を', 'と', 'が', 'へ'], correctAnswer: 1, explanation: 'と means "with"' },
                        { id: 6, question: '猫___います。', questionReading: 'ねこ___います。', options: ['は', 'を', 'が', 'に'], correctAnswer: 2, explanation: 'が marks the subject with existence verbs' },
                        { id: 7, question: '昨日、本を___。', questionReading: 'きのう、ほんを___。', options: ['読みます', '読みました', '読む', '読んで'], optionsReading: ['よみます', 'よみました', 'よむ', 'よんで'], correctAnswer: 1, explanation: 'Past tense with 昨日 requires ました' },
                        { id: 8, question: 'この本は___です。', questionReading: 'このほんは___です。', options: ['面白い', '面白', '面白く', '面白な'], optionsReading: ['おもしろい', 'おもしろ', 'おもしろく', 'おもしろな'], correctAnswer: 0, explanation: 'い-adjectives keep their い before です' },
                        { id: 9, question: 'ここに座って___。', questionReading: 'ここにすわって___。', options: ['です', 'ます', 'ください', 'いました'], correctAnswer: 2, explanation: 'て-form + ください makes a polite request' },
                        { id: 10, question: '日本___行きたいです。', questionReading: 'にほん___いきたいです。', options: ['を', 'で', 'に', 'が'], correctAnswer: 2, explanation: 'に marks destination with 行く' },
                    ]
                },
                {
                    type: 'reading' as const,
                    questionCount: 5,
                    timeLimit: 10,
                    questions: [
                        // Kanji reading questions - NO furigana (this is what's being tested)
                        { id: 1, question: '「日」の読み方は？', questionReading: null, options: ['ひ/にち', 'やま', 'かわ', 'つき'], correctAnswer: 0, explanation: '日 can be read as ひ or にち' },
                        { id: 2, question: '「山」の意味は？', questionReading: null, options: ['river', 'mountain', 'tree', 'fire'], correctAnswer: 1, explanation: '山 means mountain' },
                        { id: 3, question: '「人」の読み方は？', questionReading: null, options: ['やま', 'もり', 'ひと', 'かわ'], correctAnswer: 2, explanation: '人 is read as ひと (person)' },
                        { id: 4, question: '「大」の意味は？', questionReading: null, options: ['small', 'big', 'old', 'new'], correctAnswer: 1, explanation: '大 means big/large' },
                        { id: 5, question: '「車」の読み方は？', questionReading: null, options: ['やま', 'くるま', 'みず', 'ほん'], correctAnswer: 1, explanation: '車 is read as くるま (car)' },
                    ]
                },
            ],
            totalTimeLimit: 45,
            passingScore: 60,
            difficulty: 'standard',
        });
        console.log('   ✓ Created comprehensive N5 mock exam\n');

        // ============ SEED CONTEXTS ============
        console.log('🎭 Seeding learning contexts...');

        // Context 1: Restaurant
        await db.insert(contexts).values({
            title: 'At the Restaurant',
            scenario: 'Practice ordering food and drinks at a Japanese restaurant',
            jlptLevel: 'N5',
            vocabularyIds: [],
            grammarPatternIds: [],
            dialogues: [
                { speaker: 'Waiter', japanese: 'いらっしゃいませ！', reading: 'irasshaimase', english: 'Welcome!' },
                { speaker: 'Customer', japanese: 'すみません、メニューをください。', reading: 'sumimasen, menyuu wo kudasai', english: 'Excuse me, please give me a menu.' },
                { speaker: 'Waiter', japanese: 'はい、どうぞ。', reading: 'hai, douzo', english: 'Yes, here you go.' },
                { speaker: 'Customer', japanese: 'ラーメンをお願いします。', reading: 'raamen wo onegaishimasu', english: 'I\'d like ramen, please.' },
            ],
            culturalNotes: 'In Japan, staff greet customers with "いらっしゃいませ" when they enter.',
        });

        // Context 2: Convenience Store
        await db.insert(contexts).values({
            title: 'At the Convenience Store',
            scenario: 'Practice buying items at a Japanese convenience store (コンビニ)',
            jlptLevel: 'N5',
            vocabularyIds: [],
            grammarPatternIds: [],
            dialogues: [
                { speaker: 'Customer', japanese: 'これをください。', reading: 'kore wo kudasai', english: 'I\'ll take this, please.' },
                { speaker: 'Staff', japanese: '袋はいりますか？', reading: 'fukuro wa irimasu ka', english: 'Do you need a bag?' },
                { speaker: 'Customer', japanese: 'いいえ、結構です。', reading: 'iie, kekkou desu', english: 'No, I\'m fine.' },
                { speaker: 'Staff', japanese: '350円になります。', reading: 'sanbyaku gojuu en ni narimasu', english: 'That will be 350 yen.' },
            ],
            culturalNotes: 'Convenience stores (コンビニ) are open 24/7 in Japan and offer many services beyond shopping.',
        });

        // Context 3: Asking Directions
        await db.insert(contexts).values({
            title: 'Asking for Directions',
            scenario: 'Practice asking and giving directions in Japanese',
            jlptLevel: 'N5',
            vocabularyIds: [],
            grammarPatternIds: [],
            dialogues: [
                { speaker: 'Tourist', japanese: 'すみません、駅はどこですか？', reading: 'sumimasen, eki wa doko desu ka', english: 'Excuse me, where is the station?' },
                { speaker: 'Local', japanese: 'まっすぐ行ってください。', reading: 'massugu itte kudasai', english: 'Please go straight.' },
                { speaker: 'Local', japanese: '右に曲がってください。', reading: 'migi ni magatte kudasai', english: 'Please turn right.' },
                { speaker: 'Tourist', japanese: 'ありがとうございます！', reading: 'arigatou gozaimasu', english: 'Thank you very much!' },
            ],
            culturalNotes: 'Japanese people are generally very helpful when asked for directions.',
        });

        // Context 4: Self-Introduction
        await db.insert(contexts).values({
            title: 'Self-Introduction',
            scenario: 'Practice introducing yourself in Japanese (自己紹介)',
            jlptLevel: 'N5',
            vocabularyIds: [],
            grammarPatternIds: [],
            dialogues: [
                { speaker: 'Person A', japanese: 'はじめまして。田中です。', reading: 'hajimemashite. tanaka desu', english: 'Nice to meet you. I\'m Tanaka.' },
                { speaker: 'Person B', japanese: 'はじめまして。山田です。', reading: 'hajimemashite. yamada desu', english: 'Nice to meet you. I\'m Yamada.' },
                { speaker: 'Person A', japanese: 'どうぞよろしくお願いします。', reading: 'douzo yoroshiku onegaishimasu', english: 'Please treat me kindly.' },
                { speaker: 'Person B', japanese: 'こちらこそ、よろしくお願いします。', reading: 'kochira koso, yoroshiku onegaishimasu', english: 'Likewise, pleased to meet you.' },
            ],
            culturalNotes: 'Self-introductions (自己紹介) are very important in Japanese culture, especially in business and school settings.',
        });

        // Context 5: At the Train Station
        await db.insert(contexts).values({
            title: 'At the Train Station',
            scenario: 'Practice buying tickets and navigating train stations',
            jlptLevel: 'N5',
            vocabularyIds: [],
            grammarPatternIds: [],
            dialogues: [
                { speaker: 'Customer', japanese: '東京までいくらですか？', reading: 'toukyou made ikura desu ka', english: 'How much is it to Tokyo?' },
                { speaker: 'Staff', japanese: '1500円です。', reading: 'sen gohyaku en desu', english: 'It\'s 1500 yen.' },
                { speaker: 'Customer', japanese: '切符を一枚ください。', reading: 'kippu wo ichimai kudasai', english: 'One ticket, please.' },
                { speaker: 'Staff', japanese: '3番ホームです。', reading: 'sanban hoomu desu', english: 'It\'s platform 3.' },
            ],
            culturalNotes: 'Japanese trains are famous for their punctuality. Arriving even a minute late is rare.',
        });

        console.log('   ✓ Created 5 learning contexts\n');

        // ============ SUMMARY ============
        const totalN5Lessons = unitDefinitions.reduce((sum, u) => sum + u.lessons.length, 0);
        const totalN4Lessons = n4UnitDefinitions.reduce((sum, u) => sum + u.lessons.length, 0);
        console.log('✅ Seed completed successfully!\n');
        console.log('📊 Summary:');
        console.log(`   - ${hiraganaData.length + katakanaData.length} kana characters`);
        console.log(`   - ${unit1Kanji.length + additionalKanji + n4KanjiCount} kanji (N5 + N4)`);
        console.log(`   - ${vocabCount + n4VocabCount} vocabulary words (N5 + N4)`);
        console.log(`   - ${n5GrammarData.length + n4GrammarData.length} grammar patterns (N5 + N4)`);
        console.log(`   - N5: ${unitDefinitions.length} units with ${totalN5Lessons} lessons`);
        console.log(`   - N4: ${n4UnitDefinitions.length} units with ${totalN4Lessons} lessons`);
        console.log(`   - 5 learning contexts`);
        console.log(`   - 1 comprehensive mock exam (25 questions)`);

    } catch (error) {
        console.error('❌ Seed failed:', error);
        throw error;
    }
}

// Run the seed function
seed()
    .then(() => {
        console.log('\nExiting...');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Fatal error:', error);
        process.exit(1);
    });
