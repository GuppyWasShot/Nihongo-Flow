import { pgTable, serial, text, integer, timestamp, varchar, jsonb, uuid, index, real, boolean } from 'drizzle-orm/pg-core';

// ==================== Courses & Curriculum ====================

export const courses = pgTable('courses', {
  id: serial('id').primaryKey(),
  level: varchar('level', { length: 10 }).notNull(), // e.g., 'N5', 'N4', 'N3'
  title: text('title').notNull(),
  description: text('description'),
  order: integer('order').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const units = pgTable('units', {
  id: serial('id').primaryKey(),
  courseId: integer('course_id').notNull().references(() => courses.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  order: integer('order').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  courseIdIdx: index('units_course_id_idx').on(table.courseId),
}));

export const lessons = pgTable('lessons', {
  id: serial('id').primaryKey(),
  unitId: integer('unit_id').notNull().references(() => units.id, { onDelete: 'cascade' }),
  // Lesson types: 'theory', 'vocab_drill', 'kanji_practice', 'grammar_drill', 'reading', 'mixed_review', 'conversation'
  type: varchar('type', { length: 50 }).notNull(),
  title: text('title').notNull(),
  content: jsonb('content').notNull(), // Flexible JSON structure for different lesson types
  order: integer('order').notNull(),
  // Dependency system: array of vocabulary/kanji IDs required before unlocking
  requiredVocabulary: jsonb('required_vocabulary').$type<number[]>().default([]),
  requiredKanji: jsonb('required_kanji').$type<number[]>().default([]),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  unitIdIdx: index('lessons_unit_id_idx').on(table.unitId),
}));

// ==================== Kanji ====================

export const kanji = pgTable('kanji', {
  id: serial('id').primaryKey(),
  character: varchar('character', { length: 1 }).notNull().unique(),
  meanings: jsonb('meanings').$type<string[]>().notNull(), // e.g., ['one', 'ichi']
  onyomi: jsonb('onyomi').$type<string[]>(), // Chinese reading
  kunyomi: jsonb('kunyomi').$type<string[]>(), // Japanese reading
  jlptLevel: varchar('jlpt_level', { length: 10 }).notNull(), // 'N5', 'N4', etc.
  strokeCount: integer('stroke_count'),
  radicals: jsonb('radicals').$type<string[]>(), // Component radicals
  mnemonic: text('mnemonic'), // Memory aid for learning
  strokeOrder: jsonb('stroke_order').$type<string[]>(), // SVG paths or stroke data
  exampleWords: jsonb('example_words').$type<{ word: string; reading: string; meaning: string }[]>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  jlptLevelIdx: index('kanji_jlpt_level_idx').on(table.jlptLevel),
}));

// ==================== Vocabulary ====================

export const vocabulary = pgTable('vocabulary', {
  id: serial('id').primaryKey(),
  writing: text('writing').notNull(), // Kanji/Kana form: e.g., '学生'
  reading: text('reading').notNull(), // Hiragana reading: e.g., 'がくせい'
  meaning: text('meaning').notNull(), // English meaning
  partOfSpeech: varchar('part_of_speech', { length: 50 }), // 'noun', 'verb', 'adjective', etc.
  jlptLevel: varchar('jlpt_level', { length: 10 }).notNull(),
  unitId: integer('unit_id').references(() => units.id), // Unit this vocabulary belongs to
  kanjiComponents: jsonb('kanji_components').$type<number[]>().default([]), // Foreign keys to kanji.id
  exampleSentences: jsonb('example_sentences').$type<{
    japanese: string;
    reading: string;
    english: string
  }[]>(),
  audioUrl: text('audio_url'), // URL to pronunciation audio
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  jlptLevelIdx: index('vocabulary_jlpt_level_idx').on(table.jlptLevel),
  unitIdIdx: index('vocabulary_unit_id_idx').on(table.unitId),
}));

// ==================== Grammar Patterns ====================

export const grammarPatterns = pgTable('grammar_patterns', {
  id: serial('id').primaryKey(),
  pattern: text('pattern').notNull(), // e.g., 'は (wa)', 'てください'
  meaning: text('meaning').notNull(), // English meaning
  jlptLevel: varchar('jlpt_level', { length: 10 }).notNull(),
  formation: text('formation'), // How to form the pattern
  explanation: text('explanation'), // Detailed explanation
  examples: jsonb('examples').$type<{
    japanese: string;
    reading: string;
    english: string;
  }[]>().default([]),
  notes: text('notes'), // Additional usage notes
  relatedPatterns: jsonb('related_patterns').$type<number[]>().default([]), // IDs of related grammar
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  jlptLevelIdx: index('grammar_patterns_jlpt_level_idx').on(table.jlptLevel),
}));

// ==================== Contexts (Scenarios) ====================

export const contexts = pgTable('contexts', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(), // e.g., 'At the Restaurant'
  scenario: text('scenario').notNull(), // Description of the context
  jlptLevel: varchar('jlpt_level', { length: 10 }).notNull(),
  vocabularyIds: jsonb('vocabulary_ids').$type<number[]>().default([]),
  grammarPatternIds: jsonb('grammar_pattern_ids').$type<number[]>().default([]),
  dialogues: jsonb('dialogues').$type<{
    speaker: string;
    japanese: string;
    reading: string;
    english: string;
  }[]>().default([]),
  culturalNotes: text('cultural_notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  jlptLevelIdx: index('contexts_jlpt_level_idx').on(table.jlptLevel),
}));

// ==================== Mock Exams ====================

export const mockExams = pgTable('mock_exams', {
  id: serial('id').primaryKey(),
  level: varchar('level', { length: 10 }).notNull(), // 'N5', 'N4', etc.
  title: text('title').notNull(),
  description: text('description'),
  // Sections: vocabulary, grammar, reading (listening future)
  sections: jsonb('sections').$type<{
    type: 'vocabulary' | 'grammar' | 'reading';
    questionCount: number;
    timeLimit: number; // minutes
    questions: {
      id: number;
      question: string;
      questionReading?: string | null; // Furigana reading (null = no furigana, e.g., for kanji reading tests)
      options: string[];
      optionsReading?: string[]; // Furigana for options
      correctAnswer: number;
      explanation?: string;
      passage?: string; // for reading comprehension
      passageReading?: string; // Furigana for passage
    }[];
  }[]>().notNull(),
  totalTimeLimit: integer('total_time_limit').notNull(), // Total minutes
  passingScore: integer('passing_score').notNull(), // Percentage
  difficulty: varchar('difficulty', { length: 20 }).default('standard'), // 'easy', 'standard', 'hard'
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  levelIdx: index('mock_exams_level_idx').on(table.level),
}));

// ==================== User Exam Attempts ====================

export const userExamAttempts = pgTable('user_exam_attempts', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').notNull(),
  examId: integer('exam_id').notNull().references(() => mockExams.id, { onDelete: 'cascade' }),
  score: integer('score').notNull(), // Percentage
  sectionScores: jsonb('section_scores').$type<{
    type: string;
    score: number;
    correct: number;
    total: number;
  }[]>().notNull(),
  answers: jsonb('answers').$type<{
    questionId: number;
    selectedAnswer: number;
    isCorrect: boolean;
  }[]>().notNull(),
  timeTaken: integer('time_taken').notNull(), // Seconds
  completedAt: timestamp('completed_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('user_exam_attempts_user_id_idx').on(table.userId),
  examIdIdx: index('user_exam_attempts_exam_id_idx').on(table.examId),
}));

// ==================== Study Sessions ====================

export const studySessions = pgTable('study_sessions', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').notNull(),
  sessionType: varchar('session_type', { length: 50 }).notNull(), // 'lesson', 'review', 'exam'
  duration: integer('duration').notNull(), // Seconds
  itemsReviewed: integer('items_reviewed').notNull().default(0),
  correctCount: integer('correct_count').notNull().default(0),
  accuracy: real('accuracy'), // 0-100 percentage
  xpEarned: integer('xp_earned').notNull().default(0),
  metadata: jsonb('metadata').$type<Record<string, any>>(), // Additional session data
  startedAt: timestamp('started_at').notNull(),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('study_sessions_user_id_idx').on(table.userId),
  startedAtIdx: index('study_sessions_started_at_idx').on(table.startedAt),
}));

// ==================== User Progress (SRS System) ====================

export const userProgress = pgTable('user_progress', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').notNull(), // Supabase Auth UUID
  itemType: varchar('item_type', { length: 20 }).notNull(), // 'vocabulary', 'kanji', 'grammar'
  itemId: integer('item_id').notNull(), // Foreign key to vocabulary/kanji/grammar_patterns
  srsStage: integer('srs_stage').notNull().default(0), // 0-8 (SRS stages)
  masteryLevel: integer('mastery_level').notNull().default(0), // 0-100 percentage
  correctCount: integer('correct_count').notNull().default(0),
  incorrectCount: integer('incorrect_count').notNull().default(0),
  nextReview: timestamp('next_review').notNull(),
  lastReviewed: timestamp('last_reviewed'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('user_progress_user_id_idx').on(table.userId),
  nextReviewIdx: index('user_progress_next_review_idx').on(table.nextReview),
  userItemIdx: index('user_progress_user_item_idx').on(table.userId, table.itemType, table.itemId),
}));

// ==================== User Profiles ====================

export const userProfiles = pgTable('user_profiles', {
  id: uuid('id').primaryKey(), // Matches Supabase Auth user ID
  email: text('email').notNull().unique(),
  displayName: text('display_name'),
  avatarUrl: text('avatar_url'),
  location: text('location'), // User's location/city
  bio: text('bio'), // User's bio/description
  currentCourseId: integer('current_course_id').references(() => courses.id),
  totalXp: integer('total_xp').notNull().default(0),
  studyStreak: integer('study_streak').notNull().default(0),
  longestStreak: integer('longest_streak').notNull().default(0),
  lastStudyDate: timestamp('last_study_date'),
  dailyGoal: integer('daily_goal').default(20), // Items per day
  totalStudyTime: integer('total_study_time').notNull().default(0), // Seconds
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ==================== Hiragana/Katakana Characters ====================

export const kanaCharacters = pgTable('kana_characters', {
  id: serial('id').primaryKey(),
  character: varchar('character', { length: 5 }).notNull().unique(),
  type: varchar('type', { length: 10 }).notNull(), // 'hiragana' or 'katakana'
  romaji: varchar('romaji', { length: 10 }).notNull(),
  row: varchar('row', { length: 10 }).notNull(), // vowel row (a, ka, sa, etc.)
  column: varchar('column', { length: 10 }).notNull(), // vowel column (a, i, u, e, o)
  strokeCount: integer('stroke_count'),
  strokeOrder: jsonb('stroke_order').$type<string[]>(), // SVG paths
  mnemonic: text('mnemonic'),
  audioUrl: text('audio_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ==================== Flashcard System ====================

export const flashcardDecks = pgTable('flashcard_decks', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').notNull(),
  name: text('name').notNull(),
  description: text('description'),
  isPublic: boolean('is_public').default(false),
  itemType: varchar('item_type', { length: 20 }).notNull(), // 'kanji', 'vocabulary', 'grammar', 'mixed'
  itemIds: jsonb('item_ids').$type<number[]>().default([]),
  jlptLevel: varchar('jlpt_level', { length: 10 }), // Optional level filter
  unitId: integer('unit_id').references(() => units.id), // Optional unit filter
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('flashcard_decks_user_id_idx').on(table.userId),
  isPublicIdx: index('flashcard_decks_public_idx').on(table.isPublic),
}));

export const flashcardSessions = pgTable('flashcard_sessions', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').notNull(),
  deckId: integer('deck_id').references(() => flashcardDecks.id, { onDelete: 'cascade' }),
  studyMode: varchar('study_mode', { length: 20 }).notNull(), // 'recognition', 'production', 'cram', 'test'
  totalCards: integer('total_cards').notNull().default(0),
  correct: integer('correct').notNull().default(0),
  incorrect: integer('incorrect').notNull().default(0),
  accuracy: real('accuracy'), // 0-100 percentage
  duration: integer('duration'), // Seconds
  startedAt: timestamp('started_at').defaultNow().notNull(),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('flashcard_sessions_user_id_idx').on(table.userId),
  deckIdIdx: index('flashcard_sessions_deck_id_idx').on(table.deckId),
}));

// ==================== Type Exports ====================

export type Course = typeof courses.$inferSelect;
export type NewCourse = typeof courses.$inferInsert;

export type Unit = typeof units.$inferSelect;
export type NewUnit = typeof units.$inferInsert;

export type Lesson = typeof lessons.$inferSelect;
export type NewLesson = typeof lessons.$inferInsert;

export type Kanji = typeof kanji.$inferSelect;
export type NewKanji = typeof kanji.$inferInsert;

export type Vocabulary = typeof vocabulary.$inferSelect;
export type NewVocabulary = typeof vocabulary.$inferInsert;

export type GrammarPattern = typeof grammarPatterns.$inferSelect;
export type NewGrammarPattern = typeof grammarPatterns.$inferInsert;

export type Context = typeof contexts.$inferSelect;
export type NewContext = typeof contexts.$inferInsert;

export type MockExam = typeof mockExams.$inferSelect;
export type NewMockExam = typeof mockExams.$inferInsert;

export type UserExamAttempt = typeof userExamAttempts.$inferSelect;
export type NewUserExamAttempt = typeof userExamAttempts.$inferInsert;

export type StudySession = typeof studySessions.$inferSelect;
export type NewStudySession = typeof studySessions.$inferInsert;

export type UserProgress = typeof userProgress.$inferSelect;
export type NewUserProgress = typeof userProgress.$inferInsert;

export type UserProfile = typeof userProfiles.$inferSelect;
export type NewUserProfile = typeof userProfiles.$inferInsert;

export type KanaCharacter = typeof kanaCharacters.$inferSelect;
export type NewKanaCharacter = typeof kanaCharacters.$inferInsert;

export type FlashcardDeck = typeof flashcardDecks.$inferSelect;
export type NewFlashcardDeck = typeof flashcardDecks.$inferInsert;

export type FlashcardSession = typeof flashcardSessions.$inferSelect;
export type NewFlashcardSession = typeof flashcardSessions.$inferInsert;
