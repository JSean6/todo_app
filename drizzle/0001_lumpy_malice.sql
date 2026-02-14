ALTER TABLE "taks" RENAME TO "tasks";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "cerated_at" TO "created_at";--> statement-breakpoint
ALTER TABLE "tasks" DROP CONSTRAINT "taks_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;