import type { CourseModule } from "../shared/courseContent";

export function buildModuleProgress(modules: CourseModule[], completedLessonIds: Set<string>) {
  return modules.map(module => {
    const completed = module.lessons.filter(lesson => completedLessonIds.has(lesson.id)).length;
    return { moduleId: module.id, completed, total: module.lessons.length, percentage: Math.round((completed / module.lessons.length) * 100) };
  });
}

export function calculateProgramScore(latestQuizByModule: Record<string, number>) {
  const scores = Object.values(latestQuizByModule);
  return scores.length ? Math.round(scores.reduce((total, score) => total + score, 0) / scores.length) : 0;
}

export function groupPracticeByModule(attempts: Array<{ moduleId: string }>) {
  return attempts.reduce<Record<string, number>>((acc, attempt) => ({ ...acc, [attempt.moduleId]: (acc[attempt.moduleId] ?? 0) + 1 }), {});
}
