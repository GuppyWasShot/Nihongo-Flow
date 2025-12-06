CREATE TABLE "contexts" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"scenario" text NOT NULL,
	"jlpt_level" varchar(10) NOT NULL,
	"vocabulary_ids" jsonb DEFAULT '[]'::jsonb,
	"grammar_pattern_ids" jsonb DEFAULT '[]'::jsonb,
	"dialogues" jsonb DEFAULT '[]'::jsonb,
	"cultural_notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "grammar_patterns" (
	"id" serial PRIMARY KEY NOT NULL,
	"pattern" text NOT NULL,
	"meaning" text NOT NULL,
	"jlpt_level" varchar(10) NOT NULL,
	"formation" text,
	"explanation" text,
	"examples" jsonb DEFAULT '[]'::jsonb,
	"notes" text,
	"related_patterns" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "kana_characters" (
	"id" serial PRIMARY KEY NOT NULL,
	"character" varchar(5) NOT NULL,
	"type" varchar(10) NOT NULL,
	"romaji" varchar(10) NOT NULL,
	"row" varchar(10) NOT NULL,
	"column" varchar(10) NOT NULL,
	"stroke_count" integer,
	"stroke_order" jsonb,
	"mnemonic" text,
	"audio_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "kana_characters_character_unique" UNIQUE("character")
);
--> statement-breakpoint
CREATE TABLE "mock_exams" (
	"id" serial PRIMARY KEY NOT NULL,
	"level" varchar(10) NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"sections" jsonb NOT NULL,
	"total_time_limit" integer NOT NULL,
	"passing_score" integer NOT NULL,
	"difficulty" varchar(20) DEFAULT 'standard',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "study_sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"session_type" varchar(50) NOT NULL,
	"duration" integer NOT NULL,
	"items_reviewed" integer DEFAULT 0 NOT NULL,
	"correct_count" integer DEFAULT 0 NOT NULL,
	"accuracy" real,
	"xp_earned" integer DEFAULT 0 NOT NULL,
	"metadata" jsonb,
	"started_at" timestamp NOT NULL,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_exam_attempts" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"exam_id" integer NOT NULL,
	"score" integer NOT NULL,
	"section_scores" jsonb NOT NULL,
	"answers" jsonb NOT NULL,
	"time_taken" integer NOT NULL,
	"completed_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "kanji" ADD COLUMN "mnemonic" text;--> statement-breakpoint
ALTER TABLE "kanji" ADD COLUMN "stroke_order" jsonb;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD COLUMN "longest_streak" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD COLUMN "daily_goal" integer DEFAULT 20;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD COLUMN "total_study_time" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "user_progress" ADD COLUMN "mastery_level" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "user_exam_attempts" ADD CONSTRAINT "user_exam_attempts_exam_id_mock_exams_id_fk" FOREIGN KEY ("exam_id") REFERENCES "public"."mock_exams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "contexts_jlpt_level_idx" ON "contexts" USING btree ("jlpt_level");--> statement-breakpoint
CREATE INDEX "grammar_patterns_jlpt_level_idx" ON "grammar_patterns" USING btree ("jlpt_level");--> statement-breakpoint
CREATE INDEX "mock_exams_level_idx" ON "mock_exams" USING btree ("level");--> statement-breakpoint
CREATE INDEX "study_sessions_user_id_idx" ON "study_sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "study_sessions_started_at_idx" ON "study_sessions" USING btree ("started_at");--> statement-breakpoint
CREATE INDEX "user_exam_attempts_user_id_idx" ON "user_exam_attempts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_exam_attempts_exam_id_idx" ON "user_exam_attempts" USING btree ("exam_id");