import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

const mocks = vi.hoisted(() => ({
  createAttempt: vi.fn(),
  getAttempt: vi.fn(),
  getHistory: vi.fn(),
  saveFeedback: vi.fn(),
  generateFeedback: vi.fn(),
}));

vi.mock("./db", () => ({
  addEvidenceItem: vi.fn(), createPracticeAttempt: mocks.createAttempt, getPracticeAttempt: mocks.getAttempt, getPracticeHistory: mocks.getHistory,
  getLearningDashboard: vi.fn(), getCapstoneSubmissions: vi.fn(), issueInternalCertificate: vi.fn(), recordFinalExamAttempt: vi.fn(), recordQuizAttempt: vi.fn(),
  removeStudentNote: vi.fn(), reviewCapstone: vi.fn(), saveMentorFeedback: mocks.saveFeedback, saveProjectSubmission: vi.fn(), saveStudentNote: vi.fn(), setLessonStatus: vi.fn(), updateProfileLocale: vi.fn(), getSubmissionWithEvidence: vi.fn(),
}));
vi.mock("./mentor", () => ({ generateFormativeFeedback: mocks.generateFeedback }));

import { appRouter } from "./routers";

function context(): TrpcContext {
  return { user: { id: 7, openId: "learner", name: "Learner", email: null, loginMethod: "manus", role: "user", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() }, req: {} as TrpcContext["req"], res: {} as TrpcContext["res"] };
}

describe("practice procedures", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.createAttempt.mockResolvedValue({ id: 41, practiceCaseId: "checkout" });
    mocks.saveFeedback.mockResolvedValue({ id: 81, phase: "review", content: "Formative review" });
    mocks.generateFeedback.mockResolvedValue("Formative review");
    mocks.getAttempt.mockResolvedValue({ id: 41, practiceCaseId: "checkout", response: "A sufficiently detailed learner response that explains evidence and a first research step." });
    mocks.getHistory.mockResolvedValue([{ id: 41 }]);
  });

  it("records an attempt before generating the first formative review", async () => {
    const caller = appRouter.createCaller(context());
    const result = await caller.practice.submit({ practiceCaseId: "checkout", response: "A sufficiently detailed learner response that explains evidence and a first research step.", locale: "en" });
    expect(mocks.createAttempt).toHaveBeenCalledWith(7, "checkout", expect.any(String));
    expect(mocks.generateFeedback).toHaveBeenCalledWith(expect.objectContaining({ caseId: "checkout", locale: "en", phase: "review" }));
    expect(mocks.saveFeedback).toHaveBeenCalledWith(7, 41, "review", "Formative review", "gpt-5-mini");
    expect(result.feedback.content).toBe("Formative review");
  });

  it("reveals hint and possible approach only for an owned existing attempt", async () => {
    const caller = appRouter.createCaller(context());
    mocks.generateFeedback.mockResolvedValueOnce("A focused hint").mockResolvedValueOnce("A possible approach");
    await caller.practice.reveal({ attemptId: 41, phase: "hint", locale: "en" });
    await caller.practice.reveal({ attemptId: 41, phase: "approach", locale: "en" });
    expect(mocks.getAttempt).toHaveBeenCalledWith(7, 41);
    expect(mocks.generateFeedback).toHaveBeenNthCalledWith(1, expect.objectContaining({ phase: "hint" }));
    expect(mocks.generateFeedback).toHaveBeenNthCalledWith(2, expect.objectContaining({ phase: "approach" }));
  });

  it("returns only the authenticated learner history", async () => {
    const caller = appRouter.createCaller(context());
    await expect(caller.practice.history()).resolves.toEqual([{ id: 41 }]);
    expect(mocks.getHistory).toHaveBeenCalledWith(7);
  });
});
