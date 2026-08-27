import { describe, expect, it } from "vitest";
import { gradeFinalExam, gradeQuiz } from "./grading";
import { t, type QuizQuestion } from "../shared/courseContent";

const questions: QuizQuestion[] = [
  { prompt: t("A", "A", "A"), options: [t("x", "x", "x"), t("y", "y", "y")], correctIndex: 1, rationale: t("R", "R", "R") },
  { prompt: t("B", "B", "B"), options: [t("x", "x", "x"), t("y", "y", "y")], correctIndex: 0, rationale: t("R", "R", "R") },
];

describe("assessment grading", () => {
  it("calculates quiz correctness and a passing score", () => expect(gradeQuiz(questions, [1, 0])).toEqual({ score: 100, passed: true, correct: [true, true] }));
  it("does not pass an incomplete quiz", () => expect(gradeQuiz(questions, [1, 1])).toEqual({ score: 50, passed: false, correct: [true, false] }));
  it("requires reasoned final-exam responses to meet the threshold", () => {
    expect(gradeFinalExam(["a".repeat(80), "b".repeat(80), "short"])).toEqual({ score: 67, passed: false });
    expect(gradeFinalExam(["a".repeat(80), "b".repeat(80), "c".repeat(80)])).toEqual({ score: 100, passed: true });
  });
});
