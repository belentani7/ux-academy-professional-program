import type { QuizQuestion } from "../shared/courseContent";

export function gradeQuiz(questions: QuizQuestion[], answers: number[]) {
  const correct = questions.map((question, index) => answers[index] === question.correctIndex);
  const score = Math.round((correct.filter(Boolean).length / questions.length) * 100);
  return { score, passed: score >= 60, correct };
}

export function gradeFinalExam(answers: string[]) {
  const completed = answers.filter(answer => answer.trim().length >= 80).length;
  const score = Math.round((completed / answers.length) * 100);
  return { score, passed: score >= 70 };
}
