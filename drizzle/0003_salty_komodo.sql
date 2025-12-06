CREATE TABLE "flashcard_decks" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"is_public" boolean DEFAULT false,
	"item_type" varchar(20) NOT NULL,
	"item_ids" jsonb DEFAULT '[]'::jsonb,
	"jlpt_level" varchar(10),
	"unit_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "flashcard_sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"deck_id" integer,
	"study_mode" varchar(20) NOT NULL,
	"total_cards" integer DEFAULT 0 NOT NULL,
	"correct" integer DEFAULT 0 NOT NULL,
	"incorrect" integer DEFAULT 0 NOT NULL,
	"accuracy" real,
	"duration" integer,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "vocabulary" ADD COLUMN "unit_id" integer;--> statement-breakpoint
ALTER TABLE "flashcard_decks" ADD CONSTRAINT "flashcard_decks_unit_id_units_id_fk" FOREIGN KEY ("unit_id") REFERENCES "public"."units"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "flashcard_sessions" ADD CONSTRAINT "flashcard_sessions_deck_id_flashcard_decks_id_fk" FOREIGN KEY ("deck_id") REFERENCES "public"."flashcard_decks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "flashcard_decks_user_id_idx" ON "flashcard_decks" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "flashcard_decks_public_idx" ON "flashcard_decks" USING btree ("is_public");--> statement-breakpoint
CREATE INDEX "flashcard_sessions_user_id_idx" ON "flashcard_sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "flashcard_sessions_deck_id_idx" ON "flashcard_sessions" USING btree ("deck_id");--> statement-breakpoint
ALTER TABLE "vocabulary" ADD CONSTRAINT "vocabulary_unit_id_units_id_fk" FOREIGN KEY ("unit_id") REFERENCES "public"."units"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "vocabulary_unit_id_idx" ON "vocabulary" USING btree ("unit_id");