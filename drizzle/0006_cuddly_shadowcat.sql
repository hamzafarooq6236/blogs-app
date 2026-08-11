ALTER TABLE "blog" DROP CONSTRAINT "status_check";--> statement-breakpoint
ALTER TABLE "blog" ADD CONSTRAINT "status_check" CHECK ("blog"."status" IN ('draft', 'public', 'private'));