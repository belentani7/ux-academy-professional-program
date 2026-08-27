CREATE TABLE `certificate_records` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`certificateCode` varchar(64) NOT NULL,
	`programScore` int NOT NULL,
	`finalExamScore` int NOT NULL,
	`issuedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `certificate_records_id` PRIMARY KEY(`id`),
	CONSTRAINT `certificate_records_certificateCode_unique` UNIQUE(`certificateCode`),
	CONSTRAINT `certificate_records_user_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `evidence_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`submissionId` int NOT NULL,
	`userId` int NOT NULL,
	`evidence_type` enum('file','link') NOT NULL,
	`label` varchar(160) NOT NULL,
	`externalUrl` text,
	`storageKey` varchar(512),
	`storageUrl` text,
	`mimeType` varchar(128),
	`fileSize` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `evidence_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `learning_profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`locale` enum('es','pt','en') NOT NULL DEFAULT 'es',
	`totalPoints` int NOT NULL DEFAULT 0,
	`weeklyGoal` int NOT NULL DEFAULT 3,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `learning_profiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `learning_profiles_user_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `lesson_progress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`lessonId` varchar(64) NOT NULL,
	`status` enum('not_started','in_progress','completed') NOT NULL DEFAULT 'not_started',
	`timeSpentMinutes` int NOT NULL DEFAULT 0,
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `lesson_progress_id` PRIMARY KEY(`id`),
	CONSTRAINT `lesson_progress_user_lesson_unique` UNIQUE(`userId`,`lessonId`)
);
--> statement-breakpoint
CREATE TABLE `mentor_feedback` (
	`id` int AUTO_INCREMENT NOT NULL,
	`attemptId` int NOT NULL,
	`userId` int NOT NULL,
	`feedback_phase` enum('review','hint','approach') NOT NULL,
	`content` text NOT NULL,
	`model` varchar(128),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `mentor_feedback_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `practice_attempts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`practiceCaseId` varchar(64) NOT NULL,
	`response` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `practice_attempts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `project_submissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`projectId` varchar(64) NOT NULL,
	`summary` text NOT NULL,
	`reflection` text,
	`selfScore` int,
	`submission_status` enum('draft','submitted','reviewed') NOT NULL DEFAULT 'draft',
	`submittedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `project_submissions_id` PRIMARY KEY(`id`),
	CONSTRAINT `project_submission_user_project_unique` UNIQUE(`userId`,`projectId`)
);
--> statement-breakpoint
CREATE TABLE `quiz_attempts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`moduleId` varchar(64) NOT NULL,
	`answers` json NOT NULL,
	`score` int NOT NULL,
	`passed` boolean NOT NULL,
	`completedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `quiz_attempts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `student_notes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`lessonId` varchar(64),
	`title` varchar(160) NOT NULL,
	`body` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `student_notes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_badges` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`badgeId` varchar(64) NOT NULL,
	`earnedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_badges_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_badges_user_badge_unique` UNIQUE(`userId`,`badgeId`)
);
--> statement-breakpoint
ALTER TABLE `certificate_records` ADD CONSTRAINT `certificate_records_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `evidence_items` ADD CONSTRAINT `evidence_items_submissionId_project_submissions_id_fk` FOREIGN KEY (`submissionId`) REFERENCES `project_submissions`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `evidence_items` ADD CONSTRAINT `evidence_items_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `learning_profiles` ADD CONSTRAINT `learning_profiles_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `lesson_progress` ADD CONSTRAINT `lesson_progress_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `mentor_feedback` ADD CONSTRAINT `mentor_feedback_attemptId_practice_attempts_id_fk` FOREIGN KEY (`attemptId`) REFERENCES `practice_attempts`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `mentor_feedback` ADD CONSTRAINT `mentor_feedback_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `practice_attempts` ADD CONSTRAINT `practice_attempts_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `project_submissions` ADD CONSTRAINT `project_submissions_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `quiz_attempts` ADD CONSTRAINT `quiz_attempts_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `student_notes` ADD CONSTRAINT `student_notes_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_badges` ADD CONSTRAINT `user_badges_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `evidence_items_submission_idx` ON `evidence_items` (`submissionId`);--> statement-breakpoint
CREATE INDEX `evidence_items_user_idx` ON `evidence_items` (`userId`);--> statement-breakpoint
CREATE INDEX `lesson_progress_user_idx` ON `lesson_progress` (`userId`);--> statement-breakpoint
CREATE INDEX `mentor_feedback_attempt_idx` ON `mentor_feedback` (`attemptId`);--> statement-breakpoint
CREATE INDEX `practice_attempts_user_case_idx` ON `practice_attempts` (`userId`,`practiceCaseId`);--> statement-breakpoint
CREATE INDEX `project_submissions_user_idx` ON `project_submissions` (`userId`);--> statement-breakpoint
CREATE INDEX `quiz_attempts_user_module_idx` ON `quiz_attempts` (`userId`,`moduleId`);--> statement-breakpoint
CREATE INDEX `student_notes_user_idx` ON `student_notes` (`userId`);