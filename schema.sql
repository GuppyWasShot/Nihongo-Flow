-- Nihongo Flow Database Schema
-- Generated from src/lib/db/schema.ts
-- PostgreSQL / Supabase

-- ==================== Courses & Curriculum ====================

CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    level VARCHAR(10) NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS units (
    id SERIAL PRIMARY KEY,
    course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    "order" INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS units_course_id_idx ON units(course_id);

CREATE TABLE IF NOT EXISTS lessons (
    id SERIAL PRIMARY KEY,
    unit_id INTEGER NOT NULL REFERENCES units(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title TEXT NOT NULL,
    content JSONB NOT NULL,
    "order" INTEGER NOT NULL,
    required_vocabulary JSONB DEFAULT '[]'::jsonb,
    required_kanji JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS lessons_unit_id_idx ON lessons(unit_id);

-- ==================== Kanji ====================

CREATE TABLE IF NOT EXISTS kanji (
    id SERIAL PRIMARY KEY,
    character VARCHAR(1) NOT NULL UNIQUE,
    meanings JSONB NOT NULL,
    onyomi JSONB,
    kunyomi JSONB,
    jlpt_level VARCHAR(10) NOT NULL,
    stroke_count INTEGER,
    radicals JSONB,
    mnemonic TEXT,
    stroke_order JSONB,
    example_words JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS kanji_jlpt_level_idx ON kanji(jlpt_level);

-- ==================== Vocabulary ====================

CREATE TABLE IF NOT EXISTS vocabulary (
    id SERIAL PRIMARY KEY,
    writing TEXT NOT NULL,
    reading TEXT NOT NULL,
    meaning TEXT NOT NULL,
    part_of_speech VARCHAR(50),
    jlpt_level VARCHAR(10) NOT NULL,
    kanji_components JSONB DEFAULT '[]'::jsonb,
    example_sentences JSONB,
    audio_url TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS vocabulary_jlpt_level_idx ON vocabulary(jlpt_level);

-- ==================== Grammar Patterns ====================

CREATE TABLE IF NOT EXISTS grammar_patterns (
    id SERIAL PRIMARY KEY,
    pattern TEXT NOT NULL,
    meaning TEXT NOT NULL,
    jlpt_level VARCHAR(10) NOT NULL,
    formation TEXT,
    explanation TEXT,
    examples JSONB DEFAULT '[]'::jsonb,
    notes TEXT,
    related_patterns JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS grammar_patterns_jlpt_level_idx ON grammar_patterns(jlpt_level);

-- ==================== Contexts (Scenarios) ====================

CREATE TABLE IF NOT EXISTS contexts (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    scenario TEXT NOT NULL,
    jlpt_level VARCHAR(10) NOT NULL,
    vocabulary_ids JSONB DEFAULT '[]'::jsonb,
    grammar_pattern_ids JSONB DEFAULT '[]'::jsonb,
    dialogues JSONB DEFAULT '[]'::jsonb,
    cultural_notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS contexts_jlpt_level_idx ON contexts(jlpt_level);

-- ==================== Kana Characters ====================

CREATE TABLE IF NOT EXISTS kana_characters (
    id SERIAL PRIMARY KEY,
    character VARCHAR(5) NOT NULL UNIQUE,
    type VARCHAR(10) NOT NULL,
    romaji VARCHAR(10) NOT NULL,
    "row" VARCHAR(10) NOT NULL,
    "column" VARCHAR(10) NOT NULL,
    stroke_count INTEGER,
    stroke_order JSONB,
    mnemonic TEXT,
    audio_url TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ==================== Mock Exams ====================

CREATE TABLE IF NOT EXISTS mock_exams (
    id SERIAL PRIMARY KEY,
    level VARCHAR(10) NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    sections JSONB NOT NULL,
    total_time_limit INTEGER NOT NULL,
    passing_score INTEGER NOT NULL,
    difficulty VARCHAR(20) DEFAULT 'standard',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS mock_exams_level_idx ON mock_exams(level);

-- ==================== User Exam Attempts ====================

CREATE TABLE IF NOT EXISTS user_exam_attempts (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    exam_id INTEGER NOT NULL REFERENCES mock_exams(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    section_scores JSONB NOT NULL,
    answers JSONB NOT NULL,
    time_taken INTEGER NOT NULL,
    completed_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS user_exam_attempts_user_id_idx ON user_exam_attempts(user_id);
CREATE INDEX IF NOT EXISTS user_exam_attempts_exam_id_idx ON user_exam_attempts(exam_id);

-- ==================== Study Sessions ====================

CREATE TABLE IF NOT EXISTS study_sessions (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    session_type VARCHAR(50) NOT NULL,
    duration INTEGER NOT NULL,
    items_reviewed INTEGER NOT NULL DEFAULT 0,
    correct_count INTEGER NOT NULL DEFAULT 0,
    accuracy REAL,
    xp_earned INTEGER NOT NULL DEFAULT 0,
    metadata JSONB,
    started_at TIMESTAMP NOT NULL,
    completed_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS study_sessions_user_id_idx ON study_sessions(user_id);
CREATE INDEX IF NOT EXISTS study_sessions_started_at_idx ON study_sessions(started_at);

-- ==================== User Progress (SRS System) ====================

CREATE TABLE IF NOT EXISTS user_progress (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    item_type VARCHAR(20) NOT NULL,
    item_id INTEGER NOT NULL,
    srs_stage INTEGER NOT NULL DEFAULT 0,
    mastery_level INTEGER NOT NULL DEFAULT 0,
    correct_count INTEGER NOT NULL DEFAULT 0,
    incorrect_count INTEGER NOT NULL DEFAULT 0,
    next_review TIMESTAMP NOT NULL,
    last_reviewed TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS user_progress_user_id_idx ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS user_progress_next_review_idx ON user_progress(next_review);
CREATE INDEX IF NOT EXISTS user_progress_user_item_idx ON user_progress(user_id, item_type, item_id);

-- ==================== User Profiles ====================

CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    display_name TEXT,
    avatar_url TEXT,
    location TEXT,
    bio TEXT,
    current_course_id INTEGER REFERENCES courses(id),
    total_xp INTEGER NOT NULL DEFAULT 0,
    study_streak INTEGER NOT NULL DEFAULT 0,
    longest_streak INTEGER NOT NULL DEFAULT 0,
    last_study_date TIMESTAMP,
    daily_goal INTEGER DEFAULT 20,
    total_study_time INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ==================== Row Level Security (RLS) Policies ====================
-- Note: Enable RLS on tables and create policies as needed for your Supabase setup

-- Example RLS policies for user_profiles:
-- ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
-- CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);

-- Example RLS policies for user_progress:
-- ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Users can view own progress" ON user_progress FOR SELECT USING (auth.uid() = user_id);
-- CREATE POLICY "Users can insert own progress" ON user_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
-- CREATE POLICY "Users can update own progress" ON user_progress FOR UPDATE USING (auth.uid() = user_id);
