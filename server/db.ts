import { and, desc, eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  capstoneReviews,
  certificateRecords,
  evidenceItems,
  finalExamAttempts,
  InsertUser,
  learningProfiles,
  lessonProgress,
  mentorFeedback,
  practiceAttempts,
  projectSubmissions,
  quizAttempts,
  studentNotes,
  userBadges,
  users,
} from "../drizzle/schema";
import { courseModules } from "../shared/courseContent";
import { certificateRules, finalExam, practiceCases } from "../shared/assessmentContent";
import { ENV } from "./_core/env";
import { deriveCapstoneLevel, meetsCapstoneLevel, type CapstoneCriteria, type CapstoneLevel } from "./capstone";
import { gradeFinalExam, gradeQuiz } from "./grading";
import { buildModuleProgress, calculateProgramScore, groupPracticeByModule } from "./learningMetrics";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

function requireDb(db: Awaited<ReturnType<typeof getDb>>) {
  if (!db) throw new Error("Database connection is unavailable");
  return db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;
  const values: InsertUser = { openId: user.openId, lastSignedIn: user.lastSignedIn ?? new Date() };
  const updateSet: Record<string, unknown> = { lastSignedIn: values.lastSignedIn };
  for (const field of ["name", "email", "loginMethod"] as const) {
    if (user[field] !== undefined) {
      values[field] = user[field] ?? null;
      updateSet[field] = user[field] ?? null;
    }
  }
  values.role = user.role ?? (user.openId === ENV.ownerOpenId ? "admin" : "user");
  updateSet.role = values.role;
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function ensureLearningProfile(userId: number) {
  const db = requireDb(await getDb());
  await db.insert(learningProfiles).values({ userId }).onDuplicateKeyUpdate({
    set: { userId },
  });
  const profile = await db.select().from(learningProfiles).where(eq(learningProfiles.userId, userId)).limit(1);
  return profile[0]!;
}

export async function updateProfileLocale(userId: number, locale: "es" | "pt" | "en") {
  const db = requireDb(await getDb());
  await ensureLearningProfile(userId);
  await db.update(learningProfiles).set({ locale }).where(eq(learningProfiles.userId, userId));
  return (await db.select().from(learningProfiles).where(eq(learningProfiles.userId, userId)).limit(1))[0]!;
}

export async function getLearningDashboard(userId: number) {
  const db = requireDb(await getDb());
  const profile = await ensureLearningProfile(userId);
  const [progressRows, badges, quizRows, submissions, notes, certificate, finalExamRows, practiceRows] = await Promise.all([
    db.select().from(lessonProgress).where(eq(lessonProgress.userId, userId)),
    db.select().from(userBadges).where(eq(userBadges.userId, userId)),
    db.select().from(quizAttempts).where(eq(quizAttempts.userId, userId)).orderBy(desc(quizAttempts.completedAt)),
    db.select().from(projectSubmissions).where(eq(projectSubmissions.userId, userId)),
    db.select().from(studentNotes).where(eq(studentNotes.userId, userId)).orderBy(desc(studentNotes.updatedAt)),
    db.select().from(certificateRecords).where(eq(certificateRecords.userId, userId)).limit(1),
    db.select().from(finalExamAttempts).where(eq(finalExamAttempts.userId, userId)).orderBy(desc(finalExamAttempts.completedAt)).limit(1),
    db.select().from(practiceAttempts).where(eq(practiceAttempts.userId, userId)),
  ]);
  const completedIds = new Set(progressRows.filter(row => row.status === "completed").map(row => row.lessonId));
  const allLessons = courseModules.flatMap(module => module.lessons);
  const moduleProgress = buildModuleProgress(courseModules, completedIds);
  const nextLesson = allLessons.find(item => !completedIds.has(item.id)) ?? null;
  const capstoneSubmission = submissions.find(item => item.projectId === "capstone");
  const capstoneReview = capstoneSubmission
    ? (await db.select().from(capstoneReviews).where(eq(capstoneReviews.submissionId, capstoneSubmission.id)).limit(1))[0] ?? null
    : null;
  const latestQuizByModule = quizRows.reduce<Record<string, number>>((acc, item) => {
    if (acc[item.moduleId] === undefined) acc[item.moduleId] = item.score;
    return acc;
  }, {});
  const programScore = calculateProgramScore(latestQuizByModule);
  return {
    profile,
    completedLessonIds: Array.from(completedIds),
    completedLessons: completedIds.size,
    totalLessons: allLessons.length,
    programProgress: Math.round((completedIds.size / allLessons.length) * 100),
    moduleProgress,
    nextLessonId: nextLesson?.id ?? null,
    badges: badges.map(item => item.badgeId),
    latestQuizByModule,
    programScore,
    projects: submissions,
    notes,
    certificate: certificate[0] ?? null,
    capstoneReview,
    finalExamScore: finalExamRows[0]?.score ?? null,
    practiceByModule: groupPracticeByModule(practiceRows),
  };
}

async function awardBadges(userId: number, completedCount: number) {
  const db = requireDb(await getDb());
  const earned = [
    completedCount >= 1 ? "first-step" : null,
    completedCount >= 6 ? "learning-rhythm" : null,
    completedCount >= 17 ? "research-ready" : null,
    completedCount >= courseModules.flatMap(module => module.lessons).length ? "curriculum-complete" : null,
  ].filter((badge): badge is string => Boolean(badge));
  for (const badgeId of earned) {
    await db.insert(userBadges).values({ userId, badgeId }).onDuplicateKeyUpdate({ set: { badgeId } });
  }
  return earned;
}

export async function setLessonStatus(userId: number, lessonId: string, status: "in_progress" | "completed") {
  if (!courseModules.some(module => module.lessons.some(item => item.id === lessonId))) {
    throw new Error("Unknown lesson");
  }
  const db = requireDb(await getDb());
  const existing = await db.select().from(lessonProgress).where(and(eq(lessonProgress.userId, userId), eq(lessonProgress.lessonId, lessonId))).limit(1);
  const wasCompleted = existing[0]?.status === "completed";
  await db.insert(lessonProgress).values({
    userId,
    lessonId,
    status,
    timeSpentMinutes: status === "completed" ? 34 : 0,
    completedAt: status === "completed" ? new Date() : null,
  }).onDuplicateKeyUpdate({
    set: {
      status,
      timeSpentMinutes: status === "completed" ? 34 : sql`${lessonProgress.timeSpentMinutes}`,
      completedAt: status === "completed" ? new Date() : sql`${lessonProgress.completedAt}`,
    },
  });
  await ensureLearningProfile(userId);
  if (status === "completed" && !wasCompleted) {
    await db.update(learningProfiles).set({ totalPoints: sql`${learningProfiles.totalPoints} + 40` }).where(eq(learningProfiles.userId, userId));
  }
  const completed = await db.select().from(lessonProgress).where(and(eq(lessonProgress.userId, userId), eq(lessonProgress.status, "completed")));
  await awardBadges(userId, completed.length);
  return getLearningDashboard(userId);
}

export async function saveStudentNote(userId: number, input: { id?: number; lessonId?: string; title: string; body: string }) {
  const db = requireDb(await getDb());
  if (input.id) {
    const owned = await db.select().from(studentNotes).where(and(eq(studentNotes.id, input.id), eq(studentNotes.userId, userId))).limit(1);
    if (!owned[0]) throw new Error("Note not found");
    await db.update(studentNotes).set({ title: input.title, body: input.body, lessonId: input.lessonId ?? null }).where(eq(studentNotes.id, input.id));
    return (await db.select().from(studentNotes).where(eq(studentNotes.id, input.id)).limit(1))[0]!;
  }
  await db.insert(studentNotes).values({ userId, lessonId: input.lessonId ?? null, title: input.title, body: input.body });
  return (await db.select().from(studentNotes).where(eq(studentNotes.userId, userId)).orderBy(desc(studentNotes.id)).limit(1))[0]!;
}

export async function removeStudentNote(userId: number, noteId: number) {
  const db = requireDb(await getDb());
  await db.delete(studentNotes).where(and(eq(studentNotes.id, noteId), eq(studentNotes.userId, userId)));
  return { success: true as const };
}

export async function recordQuizAttempt(userId: number, moduleId: string, answers: number[]) {
  const module = courseModules.find(item => item.id === moduleId);
  if (!module) throw new Error("Unknown module");
  const grade = gradeQuiz(module.quiz, answers);
  const score = grade.score;
  const db = requireDb(await getDb());
  await db.insert(quizAttempts).values({ userId, moduleId, answers, score, passed: score >= 60 });
  if (score >= 60) {
    await ensureLearningProfile(userId);
    await db.update(learningProfiles).set({ totalPoints: sql`${learningProfiles.totalPoints} + 20` }).where(eq(learningProfiles.userId, userId));
  }
  return grade;
}

export async function recordFinalExamAttempt(userId: number, answers: string[]) {
  if (answers.length !== finalExam.length) throw new Error("All final exam answers are required");
  const grade = gradeFinalExam(answers);
  const score = grade.score;
  const db = requireDb(await getDb());
  await db.insert(finalExamAttempts).values({ userId, answers, score, passed: score >= 70 });
  return grade;
}

export async function saveProjectSubmission(userId: number, input: { projectId: string; summary: string; reflection?: string; selfScore?: number; submit?: boolean }) {
  const db = requireDb(await getDb());
  const status = input.submit ? "submitted" as const : "draft" as const;
  await db.insert(projectSubmissions).values({
    userId,
    projectId: input.projectId,
    summary: input.summary,
    reflection: input.reflection ?? null,
    selfScore: input.selfScore ?? null,
    status,
    submittedAt: input.submit ? new Date() : null,
  }).onDuplicateKeyUpdate({
    set: { summary: input.summary, reflection: input.reflection ?? null, selfScore: input.selfScore ?? null, status, submittedAt: input.submit ? new Date() : sql`${projectSubmissions.submittedAt}` },
  });
  return (await db.select().from(projectSubmissions).where(and(eq(projectSubmissions.userId, userId), eq(projectSubmissions.projectId, input.projectId))).limit(1))[0]!;
}

export async function getSubmissionWithEvidence(userId: number, projectId: string) {
  const db = requireDb(await getDb());
  const submission = await db.select().from(projectSubmissions).where(and(eq(projectSubmissions.userId, userId), eq(projectSubmissions.projectId, projectId))).limit(1);
  if (!submission[0]) return null;
  const evidence = await db.select().from(evidenceItems).where(and(eq(evidenceItems.submissionId, submission[0].id), eq(evidenceItems.userId, userId)));
  return { submission: submission[0], evidence };
}

export async function addEvidenceItem(userId: number, input: { projectId: string; evidenceType: "file" | "link"; label: string; externalUrl?: string; storageKey?: string; storageUrl?: string; mimeType?: string; fileSize?: number }) {
  const db = requireDb(await getDb());
  const submission = await db.select().from(projectSubmissions).where(and(eq(projectSubmissions.userId, userId), eq(projectSubmissions.projectId, input.projectId))).limit(1);
  if (!submission[0]) throw new Error("Save a project draft before adding evidence");
  if (input.evidenceType === "link" && !input.externalUrl) throw new Error("Evidence link is required");
  if (input.evidenceType === "file" && (!input.storageKey || !input.storageUrl)) throw new Error("Stored evidence file is required");
  await db.insert(evidenceItems).values({ submissionId: submission[0].id, userId, evidenceType: input.evidenceType, label: input.label, externalUrl: input.externalUrl ?? null, storageKey: input.storageKey ?? null, storageUrl: input.storageUrl ?? null, mimeType: input.mimeType ?? null, fileSize: input.fileSize ?? null });
  return (await db.select().from(evidenceItems).where(and(eq(evidenceItems.submissionId, submission[0].id), eq(evidenceItems.userId, userId))).orderBy(desc(evidenceItems.id)).limit(1))[0]!;
}

export async function getCapstoneSubmissions() {
  const db = requireDb(await getDb());
  const submissions = await db.select().from(projectSubmissions).where(eq(projectSubmissions.projectId, "capstone")).orderBy(desc(projectSubmissions.updatedAt));
  const reviews = submissions.length ? await db.select().from(capstoneReviews) : [];
  return submissions.map(submission => ({ ...submission, review: reviews.find(review => review.submissionId === submission.id) ?? null }));
}

export async function reviewCapstone(reviewerId: number, input: { submissionId: number; decision: "revise" | "pass"; feedback: string; criteria: CapstoneCriteria }) {
  const db = requireDb(await getDb());
  const submission = await db.select().from(projectSubmissions).where(eq(projectSubmissions.id, input.submissionId)).limit(1);
  if (!submission[0] || submission[0].projectId !== "capstone") throw new Error("Capstone submission not found");
  if (submission[0].status === "draft") throw new Error("Only submitted capstones may be reviewed");
  const level = deriveCapstoneLevel(input.criteria);
  await db.insert(capstoneReviews).values({ submissionId: input.submissionId, reviewerId, level, decision: input.decision, criteria: input.criteria, feedback: input.feedback }).onDuplicateKeyUpdate({ set: { reviewerId, level, decision: input.decision, criteria: input.criteria, feedback: input.feedback, reviewedAt: new Date() } });
  await db.update(projectSubmissions).set({ status: "reviewed" }).where(eq(projectSubmissions.id, input.submissionId));
  return (await db.select().from(capstoneReviews).where(eq(capstoneReviews.submissionId, input.submissionId)).limit(1))[0]!;
}

export async function issueInternalCertificate(userId: number) {
  const dashboard = await getLearningDashboard(userId);
  const completedProjects = dashboard.projects.filter(item => item.projectId !== "capstone" && (item.status === "submitted" || item.status === "reviewed")).length;
  const capstonePasses = dashboard.capstoneReview?.decision === "pass" && meetsCapstoneLevel(dashboard.capstoneReview.level as CapstoneLevel, certificateRules.capstoneMinimumLevel as CapstoneLevel);
  if (dashboard.programProgress < certificateRules.lessonCompletion || dashboard.programScore < certificateRules.minimumProgramScore || (dashboard.finalExamScore ?? 0) < certificateRules.minimumFinalExam || completedProjects < certificateRules.requiredProjects || !capstonePasses) {
    throw new Error("Certificate requirements are not yet satisfied");
  }
  const db = requireDb(await getDb());
  const certificateCode = `UXA-${userId}-${Date.now().toString(36).toUpperCase()}`;
  await db.insert(certificateRecords).values({ userId, certificateCode, programScore: dashboard.programScore, finalExamScore: dashboard.finalExamScore ?? 0 }).onDuplicateKeyUpdate({ set: { programScore: dashboard.programScore, finalExamScore: dashboard.finalExamScore ?? 0 } });
  return (await db.select().from(certificateRecords).where(eq(certificateRecords.userId, userId)).limit(1))[0]!;
}

export async function createPracticeAttempt(userId: number, practiceCaseId: string, response: string) {
  const practiceCase = practiceCases.find(item => item.id === practiceCaseId);
  if (!practiceCase) throw new Error("Practice case not found");
  const db = requireDb(await getDb());
  await db.insert(practiceAttempts).values({ userId, practiceCaseId, moduleId: practiceCase.moduleId, response });
  return (await db.select().from(practiceAttempts).where(eq(practiceAttempts.userId, userId)).orderBy(desc(practiceAttempts.id)).limit(1))[0]!;
}

export async function saveMentorFeedback(userId: number, attemptId: number, phase: "review" | "hint" | "approach", content: string, model?: string) {
  const db = requireDb(await getDb());
  await db.insert(mentorFeedback).values({ userId, attemptId, phase, content, model: model ?? null });
  return (await db.select().from(mentorFeedback).where(and(eq(mentorFeedback.attemptId, attemptId), eq(mentorFeedback.userId, userId))).orderBy(desc(mentorFeedback.id)).limit(1))[0]!;
}

export async function getPracticeAttempt(userId: number, attemptId: number) {
  const db = requireDb(await getDb());
  return (await db.select().from(practiceAttempts).where(and(eq(practiceAttempts.id, attemptId), eq(practiceAttempts.userId, userId))).limit(1))[0] ?? null;
}

export async function getPracticeHistory(userId: number) {
  const db = requireDb(await getDb());
  const attempts = await db.select().from(practiceAttempts).where(eq(practiceAttempts.userId, userId)).orderBy(desc(practiceAttempts.createdAt));
  const feedback = attempts.length ? await db.select().from(mentorFeedback).where(eq(mentorFeedback.userId, userId)).orderBy(desc(mentorFeedback.createdAt)) : [];
  return attempts.map(attempt => ({ ...attempt, feedback: feedback.filter(item => item.attemptId === attempt.id) }));
}
