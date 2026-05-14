CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "recipes" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"ingredients" text NOT NULL,
	"instructions" text NOT NULL,
	"cooking_time" integer NOT NULL,
	"servings" integer NOT NULL,
	"tags" text DEFAULT '[]',
	"category" varchar(100),
	"user_id" integer NOT NULL,
	"date_created" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
