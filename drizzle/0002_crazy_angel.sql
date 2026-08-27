CREATE TABLE `final_exam_attempts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`answers` json NOT NULL,
	`score` int NOT NULL,
	`passed` boolean NOT NULL,
	`completedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `final_exam_attempts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `final_exam_attempts` ADD CONSTRAINT `final_exam_attempts_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `final_exam_attempts_user_idx` ON `final_exam_attempts` (`userId`);