CREATE TYPE "public"."message_status_enum" AS ENUM('sent', 'delivered', 'seen');--> statement-breakpoint
CREATE TYPE "public"."friendship_status" AS ENUM('pending', 'accepted', 'rejected', 'blocked');--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"lastseen" timestamp with time zone DEFAULT now(),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"username" text,
	"display_username" text,
	CONSTRAINT "user_email_unique" UNIQUE("email"),
	CONSTRAINT "user_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "conversation" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"name" text,
	"is_group" boolean DEFAULT false NOT NULL,
	"created_by" text NOT NULL,
	"last_message_id" text
);
--> statement-breakpoint
CREATE TABLE "conversation_participant" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"conversation_id" text NOT NULL,
	"user_id" text NOT NULL,
	"last_read_message_id" text,
	"is_muted" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "message" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"conversation_id" text NOT NULL,
	"sender_id" text NOT NULL,
	"content" text,
	"reply_to_message_id" text,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "message_attachment" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"message_id" text NOT NULL,
	"file_url" text NOT NULL,
	"file_type" text,
	"file_name" text,
	"file_size" text
);
--> statement-breakpoint
CREATE TABLE "message_status" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"message_id" text NOT NULL,
	"user_id" text NOT NULL,
	"status" "message_status_enum" DEFAULT 'sent' NOT NULL,
	"delivered_at" timestamp,
	"seen_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "friend" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"user_one_id" text NOT NULL,
	"user_two_id" text NOT NULL,
	"action_user_id" text NOT NULL,
	"status" "friendship_status" DEFAULT 'pending' NOT NULL,
	CONSTRAINT "friendships_no_self" CHECK ("friend"."user_one_id" <> "friend"."user_two_id")
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversation" ADD CONSTRAINT "conversation_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversation_participant" ADD CONSTRAINT "conversation_participant_conversation_id_conversation_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversation"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversation_participant" ADD CONSTRAINT "conversation_participant_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message" ADD CONSTRAINT "message_conversation_id_conversation_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversation"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message" ADD CONSTRAINT "message_sender_id_user_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message_attachment" ADD CONSTRAINT "message_attachment_message_id_message_id_fk" FOREIGN KEY ("message_id") REFERENCES "public"."message"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message_status" ADD CONSTRAINT "message_status_message_id_message_id_fk" FOREIGN KEY ("message_id") REFERENCES "public"."message"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message_status" ADD CONSTRAINT "message_status_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "friend" ADD CONSTRAINT "friend_user_one_id_user_id_fk" FOREIGN KEY ("user_one_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "friend" ADD CONSTRAINT "friend_user_two_id_user_id_fk" FOREIGN KEY ("user_two_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "friend" ADD CONSTRAINT "friend_action_user_id_user_id_fk" FOREIGN KEY ("action_user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");--> statement-breakpoint
CREATE INDEX "conversation_created_by_idx" ON "conversation" USING btree ("created_by");--> statement-breakpoint
CREATE UNIQUE INDEX "conversation_user_unique" ON "conversation_participant" USING btree ("conversation_id","user_id");--> statement-breakpoint
CREATE INDEX "conversation_participant_user_idx" ON "conversation_participant" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "message_conversation_idx" ON "message" USING btree ("conversation_id");--> statement-breakpoint
CREATE INDEX "message_sender_idx" ON "message" USING btree ("sender_id");--> statement-breakpoint
CREATE INDEX "message_created_idx" ON "message" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "message_attachment_message_idx" ON "message_attachment" USING btree ("message_id");--> statement-breakpoint
CREATE UNIQUE INDEX "message_user_unique" ON "message_status" USING btree ("message_id","user_id");--> statement-breakpoint
CREATE INDEX "message_status_user_idx" ON "message_status" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "friendships_unique_pair" ON "friend" USING btree ("user_one_id","user_two_id");--> statement-breakpoint
CREATE INDEX "friendships_user_one_status_idx" ON "friend" USING btree ("user_one_id","status");--> statement-breakpoint
CREATE INDEX "friendships_user_two_status_idx" ON "friend" USING btree ("user_two_id","status");--> statement-breakpoint
CREATE INDEX "friendships_action_user_idx" ON "friend" USING btree ("action_user_id");--> statement-breakpoint
CREATE INDEX "friendships_status_idx" ON "friend" USING btree ("status");