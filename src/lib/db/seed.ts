/**
 * Nihongo Flow - Comprehensive N5 Database Seed Script
 * 
 * Populates the database with complete N5 curriculum including:
 * - Hiragana and Katakana (92 characters)
 * - 103 N5 Kanji with mnemonics
 * - 200+ Vocabulary words
 * - 50+ Grammar patterns
 * - 10 Complete units with lessons
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

        for (const k of n5KanjiData) {
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
        }
        console.log(`   ✓ Inserted ${n5KanjiData.length} kanji\n`);

        // ============ SEED VOCABULARY ============
        console.log('📚 Seeding N5 vocabulary...');

        for (const v of n5VocabularyData) {
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
        console.log(`   ✓ Inserted ${n5VocabularyData.length} vocabulary words\n`);

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
                title: 'Unit 1: Greetings & Self-Introduction',
                description: 'Learn essential greetings and how to introduce yourself',
                lessons: [
                    {
                        title: 'Basic Greetings', type: 'theory', content: {
                            grammar: 'Basic Japanese Greetings',
                            explanation: 'Japanese has different greetings for different times of day. The level of formality matters too.',
                            examples: [
                                { japanese: 'おはようございます', reading: 'ohayou gozaimasu', english: 'Good morning (polite)' },
                                { japanese: 'こんにちは', reading: 'konnichiwa', english: 'Hello/Good afternoon' },
                                { japanese: 'こんばんは', reading: 'konbanwa', english: 'Good evening' },
                            ]
                        }
                    },
                    {
                        title: 'Greetings Drill', type: 'vocab_drill', content: {
                            instructions: 'Type the reading for each greeting',
                            characters: ['おはよう', 'こんにちは', 'こんばんは', 'さようなら'],
                            romaji: ['ohayou', 'konnichiha', 'konbanha', 'sayounara']
                        }
                    },
                    {
                        title: 'Self-Introduction Grammar', type: 'theory', content: {
                            grammar: 'は topic particle + です',
                            explanation: 'Use は (wa) to mark the topic and です (desu) for polite endings.',
                            examples: [
                                { japanese: '私は田中です', reading: 'watashi wa tanaka desu', english: 'I am Tanaka' },
                            ]
                        }
                    },
                    {
                        title: 'Self-Introduction Practice', type: 'grammar_drill', content: {
                            sentences: [
                                { q: '私_学生です', a: 'は', hint: 'Topic particle' },
                                { q: '田中さん_先生です', a: 'は', hint: 'Topic particle' },
                            ]
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
                    {
                        title: 'Counting Objects', type: 'theory', content: {
                            grammar: 'Counter Words',
                            explanation: 'Japanese uses counter words when counting objects. The counter depends on the type of object.',
                            examples: [
                                { japanese: '本を一冊', reading: 'hon wo issatsu', english: 'one book' },
                                { japanese: '人が三人', reading: 'hito ga sannin', english: 'three people' },
                            ]
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
                        title: 'Days of the Week', type: 'vocab_drill', content: {
                            instructions: 'Match the day with its reading',
                            characters: ['月曜日', '火曜日', '水曜日', '木曜日', '金曜日'],
                            romaji: ['getsuyoubi', 'kayoubi', 'suiyoubi', 'mokuyoubi', 'kinyoubi']
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
                            explanation: 'The ます form is the polite present/future form of verbs. It\'s used in formal situations.',
                            examples: [
                                { japanese: '食べます', reading: 'tabemasu', english: 'I eat / I will eat' },
                                { japanese: '飲みます', reading: 'nomimasu', english: 'I drink / I will drink' },
                            ]
                        }
                    },
                    {
                        title: 'Verb Conjugation: Negative', type: 'theory', content: {
                            grammar: 'ません - Negative form',
                            explanation: 'Change ます to ません to make the negative form.',
                            examples: [
                                { japanese: '食べません', reading: 'tabemasen', english: 'I don\'t eat' },
                                { japanese: '行きません', reading: 'ikimasen', english: 'I don\'t go' },
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
                            explanation: 'は marks the topic (what we\'re talking about), が marks the subject (who/what does the action or is described).',
                            examples: [
                                { japanese: '私は学生です', reading: 'watashi wa gakusei desu', english: 'I am a student (topic)' },
                                { japanese: '誰が来ましたか', reading: 'dare ga kimashita ka', english: 'Who came? (subject)' },
                            ]
                        }
                    },
                    {
                        title: 'を and に', type: 'theory', content: {
                            grammar: 'Object (を) and Direction/Time (に)',
                            explanation: 'を marks the direct object. に marks destination, time, or indirect object.',
                            examples: [
                                { japanese: 'パンを食べます', reading: 'pan wo tabemasu', english: 'I eat bread' },
                                { japanese: '学校に行きます', reading: 'gakkou ni ikimasu', english: 'I go to school' },
                            ]
                        }
                    },
                    {
                        title: 'Particle Practice', type: 'grammar_drill', content: {
                            sentences: [
                                { q: 'パン_食べます', a: 'を', hint: 'Object marker' },
                                { q: '学校_行きます', a: 'に', hint: 'Direction marker' },
                                { q: '私_日本人です', a: 'は', hint: 'Topic marker' },
                            ]
                        }
                    },
                ]
            },
            {
                title: 'Unit 6: Adjectives (い and な)',
                description: 'Learn to describe things using Japanese adjectives',
                lessons: [
                    {
                        title: 'い-Adjectives', type: 'theory', content: {
                            grammar: 'い-Adjectives',
                            explanation: 'Adjectives ending in い conjugate by changing the い.',
                            examples: [
                                { japanese: '大きい', reading: 'ookii', english: 'big' },
                                { japanese: '大きくない', reading: 'ookikunai', english: 'not big' },
                            ]
                        }
                    },
                    {
                        title: 'な-Adjectives', type: 'theory', content: {
                            grammar: 'な-Adjectives',
                            explanation: 'These adjectives need な when modifying nouns.',
                            examples: [
                                { japanese: '静かな部屋', reading: 'shizuka na heya', english: 'quiet room' },
                                { japanese: '綺麗な花', reading: 'kirei na hana', english: 'beautiful flower' },
                            ]
                        }
                    },
                    {
                        title: 'Adjective Drill', type: 'vocab_drill', content: {
                            instructions: 'Type the reading for each adjective',
                            characters: ['大きい', '小さい', '新しい', '古い', '高い'],
                            romaji: ['ookii', 'chiisai', 'atarashii', 'furui', 'takai']
                        }
                    },
                ]
            },
            {
                title: 'Unit 7: Existence (あります / います)',
                description: 'Express existence and location of things and people',
                lessons: [
                    {
                        title: 'あります vs います', type: 'theory', content: {
                            grammar: 'Existence verbs',
                            explanation: 'あります for inanimate objects, います for living things.',
                            examples: [
                                { japanese: '本があります', reading: 'hon ga arimasu', english: 'There is a book' },
                                { japanese: '猫がいます', reading: 'neko ga imasu', english: 'There is a cat' },
                            ]
                        }
                    },
                    {
                        title: 'Location Words', type: 'vocab_drill', content: {
                            instructions: 'Learn location words',
                            characters: ['上', '下', '中', '横', '前', '後ろ'],
                            romaji: ['ue', 'shita', 'naka', 'yoko', 'mae', 'ushiro']
                        }
                    },
                ]
            },
            {
                title: 'Unit 8: て-Form and Requests',
                description: 'Learn the connective て-form and making requests',
                lessons: [
                    {
                        title: 'Introduction to て-Form', type: 'theory', content: {
                            grammar: 'て-Form Formation',
                            explanation: 'The て-form connects actions and is used for requests.',
                            examples: [
                                { japanese: '食べて', reading: 'tabete', english: 'eat and...' },
                                { japanese: '見て', reading: 'mite', english: 'look and...' },
                            ]
                        }
                    },
                    {
                        title: 'ください - Please do', type: 'theory', content: {
                            grammar: 'てください',
                            explanation: 'Add ください to て-form to make polite requests.',
                            examples: [
                                { japanese: '見てください', reading: 'mite kudasai', english: 'Please look' },
                                { japanese: '待ってください', reading: 'matte kudasai', english: 'Please wait' },
                            ]
                        }
                    },
                ]
            },
            {
                title: 'Unit 9: Past Tense and Review',
                description: 'Learn past tense and review all grammar patterns',
                lessons: [
                    {
                        title: 'Past Tense (ました)', type: 'theory', content: {
                            grammar: 'Past tense verb form',
                            explanation: 'Change ます to ました for past tense.',
                            examples: [
                                { japanese: '食べました', reading: 'tabemashita', english: 'I ate' },
                                { japanese: '行きました', reading: 'ikimashita', english: 'I went' },
                            ]
                        }
                    },
                    {
                        title: 'Negative Past (ませんでした)', type: 'theory', content: {
                            grammar: 'Negative past tense',
                            explanation: 'ません becomes ませんでした.',
                            examples: [
                                { japanese: '食べませんでした', reading: 'tabemasendeshita', english: 'I didn\'t eat' },
                            ]
                        }
                    },
                    {
                        title: 'Comprehensive Review', type: 'mixed_review', content: {
                            instructions: 'Review all grammar patterns learned',
                            sections: ['particles', 'verbs', 'adjectives', 'existence']
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
                { speaker: 'Waiter', japanese: 'はい、どうぞ。', reading: 'hai, douzo', english: 'Yes, here you go.' },
                { speaker: 'Customer', japanese: 'ラーメンをお願いします。', reading: 'raamen wo onegaishimasu', english: 'Ramen, please.' },
            ],
            culturalNotes: 'In Japan, staff greet customers with "いらっしゃいませ" when they enter a restaurant.',
        });

        await db.insert(contexts).values({
            title: 'At the Train Station',
            scenario: 'Navigate the train station and buy tickets',
            jlptLevel: 'N5',
            vocabularyIds: [],
            grammarPatternIds: [],
            dialogues: [
                { speaker: 'Customer', japanese: '東京までいくらですか？', reading: 'toukyou made ikura desu ka', english: 'How much is it to Tokyo?' },
                { speaker: 'Staff', japanese: '五百円です。', reading: 'gohyaku en desu', english: 'It\'s 500 yen.' },
                { speaker: 'Customer', japanese: '一枚ください。', reading: 'ichimai kudasai', english: 'One ticket, please.' },
            ],
            culturalNotes: 'Train stations in Japan are very organized. Follow the signs and don\'t be afraid to ask for help.',
        });

        console.log('   ✓ Created 2 learning contexts\n');

        // ============ SUMMARY ============
        console.log('✅ Seed completed successfully!\n');
        console.log('📊 Summary:');
        console.log(`   - ${hiraganaData.length + katakanaData.length} kana characters`);
        console.log(`   - ${n5KanjiData.length} kanji`);
        console.log(`   - ${n5VocabularyData.length} vocabulary words`);
        console.log(`   - ${n5GrammarData.length} grammar patterns`);
        console.log(`   - 10 units with ${unitDefinitions.reduce((sum, u) => sum + u.lessons.length, 0)} lessons`);
        console.log(`   - 1 mock exam`);
        console.log(`   - 2 learning contexts`);

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
