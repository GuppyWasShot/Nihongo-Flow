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
import { n5VocabularyData } from './seed-data/vocabulary';

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
        console.log('📚 Seeding N5 vocabulary...');

        // First insert Unit 1 vocabulary
        for (const v of unit1Vocabulary) {
            await db.insert(vocabulary).values({
                writing: v.writing,
                reading: v.reading,
                meaning: v.meaning,
                partOfSpeech: v.partOfSpeech,
                jlptLevel: 'N5',
                kanjiComponents: [],
                exampleSentences: [],
            });
        }
        console.log(`   ✓ Inserted ${unit1Vocabulary.length} Unit 1 essential vocabulary`);

        // Then insert remaining N5 vocabulary (skip duplicates)
        const unit1Writings = new Set(unit1Vocabulary.map(v => v.writing));
        let additionalVocab = 0;
        for (const v of n5VocabularyData) {
            if (unit1Writings.has(v.writing)) continue; // Skip duplicates
            await db.insert(vocabulary).values({
                writing: v.writing,
                reading: v.reading,
                meaning: v.meaning,
                partOfSpeech: v.partOfSpeech,
                jlptLevel: 'N5',
                kanjiComponents: [],
                exampleSentences: [],
            });
            additionalVocab++;
        }
        console.log(`   ✓ Inserted ${additionalVocab} additional N5 vocabulary\n`);

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

        // ============ SEED COURSE ============
        console.log('🎓 Seeding N5 course...');
        const [n5Course] = await db.insert(courses).values({
            level: 'N5',
            title: 'JLPT N5 - Beginner Japanese',
            description: 'Master the fundamentals of Japanese including hiragana, katakana, basic kanji, vocabulary, and grammar patterns.',
            order: 1,
        }).returning();
        console.log(`   ✓ Created N5 course (ID: ${n5Course.id})\n`);

        // ============ SEED UNITS ============
        console.log('📦 Seeding units and lessons...');

        const unitDefinitions = [
            {
                title: 'Unit 0: Japanese Writing Systems',
                description: 'Learn hiragana and katakana - the foundations of Japanese writing',
                lessons: [
                    {
                        title: 'Introduction to Hiragana (A-row)', type: 'theory', content: {
                            instructions: 'Learn the vowel sounds: あ い う え お',
                            characters: ['あ', 'い', 'う', 'え', 'お'],
                            romaji: ['a', 'i', 'u', 'e', 'o']
                        }
                    },
                    {
                        title: 'Hiragana Practice: A-row', type: 'vocab_drill', content: {
                            instructions: 'Type the romaji for each hiragana',
                            characters: ['あ', 'い', 'う', 'え', 'お'],
                            romaji: ['a', 'i', 'u', 'e', 'o']
                        }
                    },
                    {
                        title: 'Hiragana: K-row', type: 'theory', content: {
                            instructions: 'Learn the K consonant sounds: か き く け こ',
                            characters: ['か', 'き', 'く', 'け', 'こ'],
                            romaji: ['ka', 'ki', 'ku', 'ke', 'ko']
                        }
                    },
                    {
                        title: 'Introduction to Katakana', type: 'theory', content: {
                            instructions: 'Learn katakana for foreign words: ア イ ウ エ オ',
                            characters: ['ア', 'イ', 'ウ', 'エ', 'オ'],
                            romaji: ['a', 'i', 'u', 'e', 'o']
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
                            explanation: 'Japanese has different greetings for different times of day and levels of formality.',
                            examples: [
                                { japanese: 'こんにちは', reading: 'konnichiwa', english: 'Hello / Good afternoon' },
                                { japanese: 'さようなら', reading: 'sayounara', english: 'Goodbye' },
                                { japanese: 'ありがとう', reading: 'arigatou', english: 'Thank you' },
                            ]
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
                description: 'Master Japanese numbers and counting systems',
                lessons: [
                    {
                        title: 'Numbers 1-10', type: 'theory', content: {
                            grammar: 'Japanese Numbers',
                            explanation: 'Japanese has two number systems: native Japanese and Sino-Japanese.',
                            examples: [
                                { japanese: '一、二、三、四、五', reading: 'ichi, ni, san, yon, go', english: '1, 2, 3, 4, 5' },
                                { japanese: '六、七、八、九、十', reading: 'roku, nana, hachi, kyuu, juu', english: '6, 7, 8, 9, 10' },
                            ]
                        }
                    },
                    {
                        title: 'Number Kanji Practice', type: 'kanji_practice', content: {
                            instructions: 'Practice the kanji for numbers',
                            kanji: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'],
                            readings: ['いち', 'に', 'さん', 'よん', 'ご', 'ろく', 'なな', 'はち', 'きゅう', 'じゅう']
                        }
                    },
                ]
            },
            {
                title: 'Unit 3: Time & Daily Routines',
                description: 'Learn to tell time and describe daily activities',
                lessons: [
                    {
                        title: 'Telling Time', type: 'theory', content: {
                            grammar: 'Time expressions with 時 and 分',
                            explanation: 'Hours use 時 (ji) and minutes use 分 (fun/pun).',
                            examples: [
                                { japanese: '今、三時です', reading: 'ima, sanji desu', english: 'It is 3 o\'clock now' },
                                { japanese: '七時半', reading: 'shichiji han', english: 'half past seven' },
                            ]
                        }
                    },
                    {
                        title: 'Daily Activities Verbs', type: 'vocab_drill', content: {
                            instructions: 'Learn verbs for daily routines',
                            characters: ['起きます', '食べます', '行きます', '寝ます'],
                            romaji: ['okimasu', 'tabemasu', 'ikimasu', 'nemasu']
                        }
                    },
                ]
            },
            {
                title: 'Unit 4: Basic Verbs (ます Form)',
                description: 'Learn polite verb conjugation and essential actions',
                lessons: [
                    {
                        title: 'Introduction to ます Form', type: 'theory', content: {
                            grammar: 'Polite verb form (ます)',
                            explanation: 'The ます form is the polite present/future form of verbs.',
                            examples: [
                                { japanese: '食べます', reading: 'tabemasu', english: 'I eat / I will eat' },
                                { japanese: '飲みます', reading: 'nomimasu', english: 'I drink / I will drink' },
                            ]
                        }
                    },
                    {
                        title: 'Verb Drill', type: 'vocab_drill', content: {
                            instructions: 'Type the reading for each verb',
                            characters: ['食べます', '飲みます', '行きます', '来ます', '見ます'],
                            romaji: ['tabemasu', 'nomimasu', 'ikimasu', 'kimasu', 'mimasu']
                        }
                    },
                ]
            },
            {
                title: 'Unit 5: Particles (は, が, を, に)',
                description: 'Master the essential Japanese particles',
                lessons: [
                    {
                        title: 'は vs が', type: 'theory', content: {
                            grammar: 'Topic (は) vs Subject (が)',
                            explanation: 'は marks the topic, が marks the subject.',
                            examples: [
                                { japanese: '私は学生です', reading: 'watashi wa gakusei desu', english: 'I am a student' },
                                { japanese: '誰が来ましたか', reading: 'dare ga kimashita ka', english: 'Who came?' },
                            ]
                        }
                    },
                    {
                        title: 'Particle Practice', type: 'grammar', content: {
                            questionType: 'fill_blank',
                            questions: [
                                { sentence: 'パン{_}食べます', sentenceReading: 'ぱん{_}たべます', answer: 'を', hint: 'Object marker' },
                                { sentence: '学校{_}行きます', sentenceReading: 'がっこう{_}いきます', answer: 'に', hint: 'Direction marker' },
                                { sentence: '私{_}日本人です', sentenceReading: 'わたし{_}にほんじんです', answer: 'は', hint: 'Topic marker' },
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
                        title: 'Location Vocabulary', type: 'vocab_drill', content: {
                            instructions: 'Type the reading for each word',
                            characters: ['上', '下', '中', '前', '後ろ', '右', '左', '隣', '近く'],
                            romaji: ['ue', 'shita', 'naka', 'mae', 'ushiro', 'migi', 'hidari', 'tonari', 'chikaku']
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
                        title: 'Adjective Vocabulary', type: 'vocab_drill', content: {
                            instructions: 'Type the reading for each adjective',
                            characters: ['大きい', '小さい', '新しい', '古い', '高い', '安い', '静か', '元気', '好き'],
                            romaji: ['ookii', 'chiisai', 'atarashii', 'furui', 'takai', 'yasui', 'shizuka', 'genki', 'suki']
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
                        title: 'Time Word Vocabulary', type: 'vocab_drill', content: {
                            instructions: 'Type the reading for each time word',
                            characters: ['昨日', '先週', '先月', '去年', 'さっき', '今朝', '昨夜'],
                            romaji: ['kinou', 'senshuu', 'sengetsu', 'kyonen', 'sakki', 'kesa', 'yuube']
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
                        title: 'Common て-Form Verbs', type: 'vocab_drill', content: {
                            instructions: 'Type the reading for each て-form',
                            characters: ['食べて', '飲んで', '見て', '聞いて', '書いて', '読んで', '話して', '待って'],
                            romaji: ['tabete', 'nonde', 'mite', 'kiite', 'kaite', 'yonde', 'hanashite', 'matte']
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

        // ============ SEED MOCK EXAM ============
        console.log('\n📝 Seeding sample mock exam...');

        await db.insert(mockExams).values({
            level: 'N5',
            title: 'N5 Practice Test 1',
            description: 'A practice test covering all N5 material',
            sections: [
                {
                    type: 'vocabulary' as const,
                    questionCount: 10,
                    timeLimit: 10,
                    questions: [
                        { id: 1, question: '「学生」の読み方は？', options: ['がくせい', 'せいがく', 'がっせい', 'せいと'], correctAnswer: 0, explanation: '学生 means student' },
                        { id: 2, question: '「食べる」の意味は？', options: ['to drink', 'to eat', 'to sleep', 'to walk'], correctAnswer: 1, explanation: '食べる (たべる) means to eat' },
                        { id: 3, question: 'Which means "good morning"?', options: ['こんばんは', 'こんにちは', 'おはよう', 'さようなら'], correctAnswer: 2, explanation: 'おはよう is the informal way to say good morning' },
                    ]
                },
                {
                    type: 'grammar' as const,
                    questionCount: 10,
                    timeLimit: 15,
                    questions: [
                        { id: 1, question: '私___学生です。', options: ['が', 'を', 'は', 'に'], correctAnswer: 2, explanation: 'は is used as the topic marker' },
                        { id: 2, question: 'パン___食べます。', options: ['は', 'を', 'に', 'で'], correctAnswer: 1, explanation: 'を marks the direct object' },
                        { id: 3, question: '学校___行きます。', options: ['を', 'が', 'に', 'は'], correctAnswer: 2, explanation: 'に indicates direction/destination' },
                    ]
                },
            ],
            totalTimeLimit: 60,
            passingScore: 60,
            difficulty: 'standard',
        });
        console.log('   ✓ Created sample N5 mock exam\n');

        // ============ SEED CONTEXTS ============
        console.log('🎭 Seeding learning contexts...');

        await db.insert(contexts).values({
            title: 'At the Restaurant',
            scenario: 'Practice ordering food and drinks at a Japanese restaurant',
            jlptLevel: 'N5',
            vocabularyIds: [],
            grammarPatternIds: [],
            dialogues: [
                { speaker: 'Waiter', japanese: 'いらっしゃいませ！', reading: 'irasshaimase', english: 'Welcome!' },
                { speaker: 'Customer', japanese: 'すみません、メニューをください。', reading: 'sumimasen, menyuu wo kudasai', english: 'Excuse me, please give me a menu.' },
            ],
            culturalNotes: 'In Japan, staff greet customers with "いらっしゃいませ" when they enter.',
        });

        console.log('   ✓ Created learning contexts\n');

        // ============ SUMMARY ============
        const totalLessons = unitDefinitions.reduce((sum, u) => sum + u.lessons.length, 0);
        console.log('✅ Seed completed successfully!\n');
        console.log('📊 Summary:');
        console.log(`   - ${hiraganaData.length + katakanaData.length} kana characters`);
        console.log(`   - ${unit1Kanji.length} Unit 1 core kanji + ${additionalKanji} additional kanji`);
        console.log(`   - ${unit1Vocabulary.length} Unit 1 vocabulary + ${additionalVocab} additional vocabulary`);
        console.log(`   - ${n5GrammarData.length} grammar patterns`);
        console.log(`   - ${unitDefinitions.length} units with ${totalLessons} lessons`);
        console.log(`   - 3 NEW grammar lesson types (fill_blank, word_bank, multiple_choice)`);
        console.log(`   - 1 mock exam`);

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
