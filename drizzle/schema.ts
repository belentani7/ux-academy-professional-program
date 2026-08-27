import { boolean, index, int, json, mysqlEnum, mysqlTable, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const learningProfiles = mysqlTable("learning_profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  locale: mysqlEnum("locale", ["es", "pt", "en"]).default("es").notNull(),
  totalPoints: int("totalPoints").default(0).notNull(),
  weeklyGoal: int("weeklyGoal").default(3).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => [uniqueIndex("learning_profiles_user_unique").on(table.userId)]);

export const lessonProgress = mysqlTable("lesson_progress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  lessonId: varchar("lessonId", { length: 64 }).notNull(),
  status: mysqlEnum("status", ["not_started", "in_progress", "completed"]).default("not_started").notNull(),
  timeSpentMinutes: int("timeSpentMinutes").default(0).notNull(),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => [uniqueIndex("lesson_progress_user_lesson_unique").on(table.userId, table.lessonId), index("lesson_progress_user_idx").on(table.userId)]);

export const studentNotes = mysqlTable("student_notes", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  lessonId: varchar("lessonId", { length: 64 }),
  title: varchar("title", { length: 160 }).notNull(),
  body: text("body").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => [index("student_notes_user_idx").on(table.userId)]);

export const quizAttempts = mysqlTable("quiz_attempts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  moduleId: varchar("moduleId", { length: 64 }).notNull(),
  answers: json("answers").$type<number[]>().notNull(),
  score: int("score").notNull(),
  passed: boolean("passed").notNull(),
  completedAt: timestamp("completedAt").defaultNow().notNull(),
}, table => [index("quiz_attempts_user_module_idx").on(table.userId, table.moduleId)]);

export const finalExamAttempts = mysqlTable("final_exam_attempts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  answers: json("answers").$type<string[]>().notNull(),
  score: int("score").notNull(),
  passed: boolean("passed").notNull(),
  completedAt: timestamp("completedAt").defaultNow().notNull(),
}, table => [index("final_exam_attempts_user_idx").on(table.userId)]);

export const projectSubmissions = mysqlTable("project_submissions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  projectId: varchar("projectId", { length: 64 }).notNull(),
  summary: text("summary").notNull(),
  reflection: text("reflection"),
  selfScore: int("selfScore"),
  status: mysqlEnum("submission_status", ["draft", "submitted", "reviewed"]).default("draft").notNull(),
  submittedAt: timestamp("submittedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => [uniqueIndex("project_submission_user_project_unique").on(table.userId, table.projectId), index("project_submissions_user_idx").on(table.userId)]);

export const capstoneReviews = mysqlTable("capstone_reviews", {
  id: int("id").autoincrement().primaryKey(),
  submissionId: int("submissionId").notNull().references(() => projectSubmissions.id, { onDelete: "cascade" }),
  reviewerId: int("reviewerId").notNull().references(() => users.id, { onDelete: "cascade" }),
  level: mysqlEnum("capstone_level", ["novice", "competent", "advanced", "professional"]).notNull(),
  decision: mysqlEnum("capstone_decision", ["revise", "pass"]).notNull(),
  criteria: json("criteria").$type<Record<string, "novice" | "competent" | "advanced" | "professional">>().notNull(),
  feedback: text("feedback").notNull(),
  reviewedAt: timestamp("reviewedAt").defaultNow().notNull(),
}, table => [uniqueIndex("capstone_reviews_submission_unique").on(table.submissionId), index("capstone_reviews_reviewer_idx").on(table.reviewerId)]);

export const evidenceItems = mysqlTable("evidence_items", {
  id: int("id").autoincrement().primaryKey(),
  submissionId: int("submissionId").notNull().references(() => projectSubmissions.id, { onDelete: "cascade" }),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  evidenceType: mysqlEnum("evidence_type", ["file", "link"]).notNull(),
  label: varchar("label", { length: 160 }).notNull(),
  externalUrl: text("externalUrl"),
  storageKey: varchar("storageKey", { length: 512 }),
  storageUrl: text("storageUrl"),
  mimeType: varchar("mimeType", { length: 128 }),
  fileSize: int("fileSize"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, table => [index("evidence_items_submission_idx").on(table.submissionId), index("evidence_items_user_idx").on(table.userId)]);

export const practiceAttempts = mysqlTable("practice_attempts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  practiceCaseId: varchar("practiceCaseId", { length: 64 }).notNull(),
  moduleId: varchar("moduleId", { length: 64 }).notNull().default("foundations"),
  response: text("response").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, table => [index("practice_attempts_user_case_idx").on(table.userId, table.practiceCaseId), index("practice_attempts_user_module_idx").on(table.userId, table.moduleId)]);

export const mentorFeedback = mysqlTable("mentor_feedback", {
  id: int("id").autoincrement().primaryKey(),
  attemptId: int("attemptId").notNull().references(() => practiceAttempts.id, { onDelete: "cascade" }),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  phase: mysqlEnum("feedback_phase", ["review", "hint", "approach"]).notNull(),
  content: text("content").notNull(),
  model: varchar("model", { length: 128 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, table => [index("mentor_feedback_attempt_idx").on(table.attemptId)]);

export const userBadges = mysqlTable("user_badges", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  badgeId: varchar("badgeId", { length: 64 }).notNull(),
  earnedAt: timestamp("earnedAt").defaultNow().notNull(),
}, table => [uniqueIndex("user_badges_user_badge_unique").on(table.userId, table.badgeId)]);

export const certificateRecords = mysqlTable("certificate_records", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  certificateCode: varchar("certificateCode", { length: 64 }).notNull().unique(),
  programScore: int("programScore").notNull(),
  finalExamScore: int("finalExamScore").notNull(),
  issuedAt: timestamp("issuedAt").defaultNow().notNull(),
}, table => [uniqueIndex("certificate_records_user_unique").on(table.userId)]);

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
