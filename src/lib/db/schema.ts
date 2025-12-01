import { pgTable, serial, text, integer, timestamp, varchar, jsonb, uuid, index } from 'drizzle-orm/pg-core';

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
  type: varchar('type', { length: 50 }).notNull(), // e.g., 'grammar', 'vocabulary', 'kanji', 'practice'
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
}));

// ==================== User Progress (SRS System) ====================

export const userProgress = pgTable('user_progress', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').notNull(), // Supabase Auth UUID
  itemType: varchar('item_type', { length: 20 }).notNull(), // 'vocabulary', 'kanji', 'grammar'
  itemId: integer('item_id').notNull(), // Foreign key to vocabulary/kanji/lessons
  srsStage: integer('srs_stage').notNull().default(0), // 0-8 (SRS stages)
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
  currentCourseId: integer('current_course_id').references(() => courses.id),
  totalXp: integer('total_xp').notNull().default(0),
  studyStreak: integer('study_streak').notNull().default(0),
  lastStudyDate: timestamp('last_study_date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

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

export type UserProgress = typeof userProgress.$inferSelect;
export type NewUserProgress = typeof userProgress.$inferInsert;

export type UserProfile = typeof userProfiles.$inferSelect;
export type NewUserProfile = typeof userProfiles.$inferInsert;
