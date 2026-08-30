import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { courseModules, resourceLibrary } from "../shared/courseContent";
import { certificateRules, finalExam, practiceCases, rubrics } from "../shared/assessmentContent";
import {
  addEvidenceItem,
  createPracticeAttempt,
  getPracticeAttempt,
  getPracticeHistory,
  getLearningDashboard,
  getCapstoneSubmissions,
  issueInternalCertificate,
  getSubmissionWithEvidence,
  recordFinalExamAttempt,
  recordQuizAttempt,
  removeStudentNote,
  saveProjectSubmission,
  saveStudentNote,
  saveMentorFeedback,
  setLessonStatus,
  updateProfileLocale,
  reviewCapstone,
} from "./db";
import { storeEvidenceFile } from "./evidence";
import { generateFormativeFeedback } from "./mentor";
import { answerLearner, improveLearnerText } from "./ai";
import { COOKIE_NAME } from "../shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";

const localeSchema = z.enum(["es", "pt", "en"]);

function assertAdmin(role: string) {
  if (role !== "admin") throw new TRPCError({ code: "FORBIDDEN", message: "Administrator access required" });
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  course: router({
    catalog: publicProcedure.query(() => ({ modules: courseModules, resources: resourceLibrary, rubrics, certificateRules, finalExam })),
    practiceCases: publicProcedure.query(() => practiceCases),
  }),
  ai: router({
    ask: publicProcedure.input(z.object({ question: z.string().trim().min(2).max(4000), locale: localeSchema, page: z.string().trim().min(1).max(120) })).mutation(({ input }) => answerLearner(input)),
    rewrite: publicProcedure.input(z.object({ text: z.string().trim().min(2).max(12000), locale: localeSchema, purpose: z.string().trim().min(2).max(240) })).mutation(({ input }) => improveLearnerText(input)),
  }),
  learning: router({
    dashboard: protectedProcedure.query(({ ctx }) => getLearningDashboard(ctx.user.id)),
    updateLocale: protectedProcedure.input(z.object({ locale: localeSchema })).mutation(({ ctx, input }) => updateProfileLocale(ctx.user.id, input.locale)),
    updateLesson: protectedProcedure.input(z.object({ lessonId: z.string().min(1).max(64), status: z.enum(["in_progress", "completed"]) })).mutation(({ ctx, input }) => setLessonStatus(ctx.user.id, input.lessonId, input.status)),
  }),
  notes: router({
    save: protectedProcedure.input(z.object({ id: z.number().int().positive().optional(), lessonId: z.string().min(1).max(64).optional(), title: z.string().trim().min(1).max(160), body: z.string().trim().min(1).max(12000) })).mutation(({ ctx, input }) => saveStudentNote(ctx.user.id, input)),
    remove: protectedProcedure.input(z.object({ id: z.number().int().positive() })).mutation(({ ctx, input }) => removeStudentNote(ctx.user.id, input.id)),
  }),
  quizzes: router({
    submit: protectedProcedure.input(z.object({ moduleId: z.string().min(1).max(64), answers: z.array(z.number().int().min(0).max(8)).min(1).max(20) })).mutation(({ ctx, input }) => recordQuizAttempt(ctx.user.id, input.moduleId, input.answers)),
  }),
  finalExam: router({
    submit: protectedProcedure.input(z.object({ answers: z.array(z.string().trim().min(80).max(5000)).length(finalExam.length) })).mutation(({ ctx, input }) => recordFinalExamAttempt(ctx.user.id, input.answers)),
  }),
  projects: router({
    save: protectedProcedure.input(z.object({ projectId: z.string().min(1).max(64), summary: z.string().trim().min(20).max(15000), reflection: z.string().trim().max(8000).optional(), selfScore: z.number().int().min(0).max(100).optional(), submit: z.boolean().optional() })).mutation(({ ctx, input }) => saveProjectSubmission(ctx.user.id, input)),
    evidence: router({
      addLink: protectedProcedure.input(z.object({ projectId: z.string().min(1).max(64), label: z.string().trim().min(1).max(160), url: z.string().url().refine(value => new URL(value).protocol === "https:", "Only HTTPS evidence links are allowed") })).mutation(({ ctx, input }) => addEvidenceItem(ctx.user.id, { projectId: input.projectId, evidenceType: "link", label: input.label, externalUrl: input.url })),
      addFile: protectedProcedure.input(z.object({ projectId: z.string().min(1).max(64), label: z.string().trim().min(1).max(160), fileName: z.string().min(1).max(120), mimeType: z.enum(["application/pdf", "image/png", "image/jpeg", "image/webp", "text/plain"]), dataBase64: z.string().min(4).max(9800000) })).mutation(async ({ ctx, input }) => {
        const bytes = Buffer.from(input.dataBase64, "base64");
        const stored = await storeEvidenceFile(ctx.user.id, input.projectId, input);
        return addEvidenceItem(ctx.user.id, { projectId: input.projectId, evidenceType: "file", label: input.label, storageKey: stored.key, storageUrl: stored.url, mimeType: input.mimeType, fileSize: bytes.length });
      }),
      get: protectedProcedure.input(z.object({ projectId: z.string().min(1).max(64) })).query(({ ctx, input }) => getSubmissionWithEvidence(ctx.user.id, input.projectId)),
    }),
  }),
  practice: router({
    history: protectedProcedure.query(({ ctx }) => getPracticeHistory(ctx.user.id)),
    submit: protectedProcedure.input(z.object({ practiceCaseId: z.string().min(1).max(64), response: z.string().trim().min(40).max(12000), locale: localeSchema })).mutation(async ({ ctx, input }) => {
      const attempt = await createPracticeAttempt(ctx.user.id, input.practiceCaseId, input.response);
      const content = await generateFormativeFeedback({ caseId: input.practiceCaseId, response: input.response, locale: input.locale, phase: "review" });
      const feedback = await saveMentorFeedback(ctx.user.id, attempt.id, "review", content, "gpt-5-mini");
      return { attempt, feedback };
    }),
    reveal: protectedProcedure.input(z.object({ attemptId: z.number().int().positive(), phase: z.enum(["hint", "approach"]), locale: localeSchema })).mutation(async ({ ctx, input }) => {
      const attempt = await getPracticeAttempt(ctx.user.id, input.attemptId);
      if (!attempt) throw new Error("Practice attempt not found");
      const content = await generateFormativeFeedback({ caseId: attempt.practiceCaseId, response: attempt.response, locale: input.locale, phase: input.phase });
      const feedback = await saveMentorFeedback(ctx.user.id, attempt.id, input.phase, content, "gpt-5-mini");
      return feedback;
    }),
  }),
  admin: router({
    capstoneSubmissions: protectedProcedure.query(({ ctx }) => {
      assertAdmin(ctx.user.role);
      return getCapstoneSubmissions();
    }),
    reviewCapstone: protectedProcedure.input(z.object({ submissionId: z.number().int().positive(), decision: z.enum(["revise", "pass"]), feedback: z.string().trim().min(20).max(12000), criteria: z.object({ research: z.enum(["novice", "competent", "advanced", "professional"]), ai: z.enum(["novice", "competent", "advanced", "professional"]), wireframes: z.enum(["novice", "competent", "advanced", "professional"]), ui: z.enum(["novice", "competent", "advanced", "professional"]), accessibility: z.enum(["novice", "competent", "advanced", "professional"]), testing: z.enum(["novice", "competent", "advanced", "professional"]), documentation: z.enum(["novice", "competent", "advanced", "professional"]), portfolio: z.enum(["novice", "competent", "advanced", "professional"]) }) })).mutation(({ ctx, input }) => {
      assertAdmin(ctx.user.role);
      return reviewCapstone(ctx.user.id, input);
    }),
    issueCertificate: protectedProcedure.input(z.object({ userId: z.number().int().positive() })).mutation(({ ctx, input }) => {
      assertAdmin(ctx.user.role);
      return issueInternalCertificate(input.userId);
    }),
  }),
});

export type AppRouter = typeof appRouter;
