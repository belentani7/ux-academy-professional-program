CREATE TABLE `capstone_reviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`submissionId` int NOT NULL,
	`reviewerId` int NOT NULL,
	`capstone_level` enum('novice','competent','advanced','professional') NOT NULL,
	`capstone_decision` enum('revise','pass') NOT NULL,
	`feedback` text NOT NULL,
	`reviewedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `capstone_reviews_id` PRIMARY KEY(`id`),
	CONSTRAINT `capstone_reviews_submission_unique` UNIQUE(`submissionId`)
);
--> statement-breakpoint
ALTER TABLE `capstone_reviews` ADD CONSTRAINT `capstone_reviews_submissionId_project_submissions_id_fk` FOREIGN KEY (`submissionId`) REFERENCES `project_submissions`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `capstone_reviews` ADD CONSTRAINT `capstone_reviews_reviewerId_users_id_fk` FOREIGN KEY (`reviewerId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `capstone_reviews_reviewer_idx` ON `capstone_reviews` (`reviewerId`);