CREATE TABLE `awards` (
	`id` text PRIMARY KEY NOT NULL,
	`profile_id` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`profile_id`) REFERENCES `profiles`(`id`) ON UPDATE no action ON DELETE no action
);

CREATE TABLE `profiles` (
	`id` text PRIMARY KEY NOT NULL,
	`stars` integer DEFAULT 0 NOT NULL,
	`hits` integer DEFAULT 0 NOT NULL,
	`lessons` integer DEFAULT 0 NOT NULL
);

CREATE TABLE `score_events` (
	`id` text PRIMARY KEY NOT NULL,
	`profile_id` text NOT NULL,
	`round_id` text NOT NULL,
	`kind` text NOT NULL,
	`note_index` integer,
	`points` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`profile_id`) REFERENCES `profiles`(`id`) ON UPDATE no action ON DELETE no action
);

ALTER TABLE `profiles` ADD `points` integer DEFAULT 0 NOT NULL;
ALTER TABLE `profiles` ADD `practice_day` text DEFAULT '' NOT NULL;
ALTER TABLE `profiles` ADD `practice_seconds` integer DEFAULT 0 NOT NULL;
ALTER TABLE `profiles` ADD `settings_json` text DEFAULT '{}' NOT NULL;