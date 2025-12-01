CREATE TABLE "courses" (
	"id" serial PRIMARY KEY NOT NULL,
	"level" varchar(10) NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "kanji" (
	"id" serial PRIMARY KEY NOT NULL,
	"character" varchar(1) NOT NULL,
	"meanings" jsonb NOT NULL,
	"onyomi" jsonb,
	"kunyomi" jsonb,
	"jlpt_level" varchar(10) NOT NULL,
	"stroke_count" integer,
	"radicals" jsonb,
	"example_words" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "kanji_character_unique" UNIQUE("character")
);
--> statement-breakpoint
CREATE TABLE "lessons" (
	"id" serial PRIMARY KEY NOT NULL,
	"unit_id" integer NOT NULL,
	"type" varchar(50) NOT NULL,
	"title" text NOT NULL,
	"content" jsonb NOT NULL,
	"order" integer NOT NULL,
	"required_vocabulary" jsonb DEFAULT '[]'::jsonb,
	"required_kanji" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "units" (
	"id" serial PRIMARY KEY NOT NULL,
	"course_id" integer NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"order" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"display_name" text,
	"avatar_url" text,
	"current_course_id" integer,
	"total_xp" integer DEFAULT 0 NOT NULL,
	"study_streak" integer DEFAULT 0 NOT NULL,
	"last_study_date" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_profiles_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "user_progress" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"item_type" varchar(20) NOT NULL,
	"item_id" integer NOT NULL,
	"srs_stage" integer DEFAULT 0 NOT NULL,
	"correct_count" integer DEFAULT 0 NOT NULL,
	"incorrect_count" integer DEFAULT 0 NOT NULL,
	"next_review" timestamp NOT NULL,
	"last_reviewed" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vocabulary" (
	"id" serial PRIMARY KEY NOT NULL,
	"writing" text NOT NULL,
	"reading" text NOT NULL,
	"meaning" text NOT NULL,
	"part_of_speech" varchar(50),
	"jlpt_level" varchar(10) NOT NULL,
	"kanji_components" jsonb DEFAULT '[]'::jsonb,
	"example_sentences" jsonb,
	"audio_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_unit_id_units_id_fk" FOREIGN KEY ("unit_id") REFERENCES "public"."units"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "units" ADD CONSTRAINT "units_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_current_course_id_courses_id_fk" FOREIGN KEY ("current_course_id") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "kanji_jlpt_level_idx" ON "kanji" USING btree ("jlpt_level");--> statement-breakpoint
CREATE INDEX "lessons_unit_id_idx" ON "lessons" USING btree ("unit_id");--> statement-breakpoint
CREATE INDEX "units_course_id_idx" ON "units" USING btree ("course_id");--> statement-breakpoint
CREATE INDEX "user_progress_user_id_idx" ON "user_progress" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_progress_next_review_idx" ON "user_progress" USING btree ("next_review");--> statement-breakpoint
CREATE INDEX "user_progress_user_item_idx" ON "user_progress" USING btree ("user_id","item_type","item_id");--> statement-breakpoint
CREATE INDEX "vocabulary_jlpt_level_idx" ON "vocabulary" USING btree ("jlpt_level");