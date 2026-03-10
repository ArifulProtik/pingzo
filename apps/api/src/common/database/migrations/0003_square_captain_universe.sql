ALTER TABLE "friendships" RENAME TO "friend";--> statement-breakpoint
ALTER TABLE "friend" DROP CONSTRAINT "friendships_no_self";--> statement-breakpoint
ALTER TABLE "friend" DROP CONSTRAINT "friendships_user_one_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "friend" DROP CONSTRAINT "friendships_user_two_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "friend" DROP CONSTRAINT "friendships_action_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "friend" ADD CONSTRAINT "friend_user_one_id_user_id_fk" FOREIGN KEY ("user_one_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "friend" ADD CONSTRAINT "friend_user_two_id_user_id_fk" FOREIGN KEY ("user_two_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "friend" ADD CONSTRAINT "friend_action_user_id_user_id_fk" FOREIGN KEY ("action_user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "friend" ADD CONSTRAINT "friendships_no_self" CHECK ("friend"."user_one_id" <> "friend"."user_two_id");