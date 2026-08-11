CREATE TABLE "blog" (
	"userId" text NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text,
	"slug" text NOT NULL,
	"coverImagePath" text,
	"content" jsonb,
	"status" text DEFAULT 'draft' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"publishedAt" timestamp NOT NULL,
	CONSTRAINT "status_check" CHECK ("blog"."status" IN ('active', 'public', 'private'))
);
--> statement-breakpoint
ALTER TABLE "blog" ADD CONSTRAINT "blog_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "blogs_slug_unique" ON "blog" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "blogs_author_id_idx" ON "blog" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "blogs_status_idx" ON "blog" USING btree ("status");--> statement-breakpoint
CREATE INDEX "blogs_published_at_idx" ON "blog" USING btree ("publishedAt");