import { courseModules } from "@shared/courseContent";
import { googleLearningTracks } from "@shared/googleEcosystemContent";
import { youtubeCourses } from "@shared/youtubeCourses";

export const useStaticData = () => {
  const getModuleProgress = (moduleId: string) => {
    const saved = localStorage.getItem(`ux-academy-progress-${moduleId}`);
    return saved ? parseInt(saved, 10) : 0;
  };

  const setModuleProgress = (moduleId: string, percentage: number) => {
    localStorage.setItem(`ux-academy-progress-${moduleId}`, percentage.toString());
  };

  const getLatestQuizByModule = (moduleId: string) => {
    const saved = localStorage.getItem(`ux-academy-quiz-${moduleId}`);
    return saved ? JSON.parse(saved) : null;
  };

  const setLatestQuizByModule = (moduleId: string, score: { correct: number; total: number }) => {
    localStorage.setItem(`ux-academy-quiz-${moduleId}`, JSON.stringify(score));
  };

  const getDashboardData = () => {
    const moduleProgress = courseModules.map(module => ({
      moduleId: module.id,
      percentage: getModuleProgress(module.id),
    }));

    const latestQuizByModule: Record<string, { correct: number; total: number }> = {};
    courseModules.forEach(module => {
      const quiz = getLatestQuizByModule(module.id);
      if (quiz) latestQuizByModule[module.id] = quiz;
    });

    const totalLessons = courseModules.reduce((sum, module) => sum + module.lessons.length, 0);

    const completedLessons = courseModules.reduce(
      (sum, module) =>
        sum + Math.round((getModuleProgress(module.id) / 100) * module.lessons.length),
      0,
    );

    const programProgress = totalLessons
      ? Math.round((completedLessons / totalLessons) * 100)
      : 0;

    const totalMinutes = Math.round(
      courseModules.reduce(
        (sum, module) =>
          sum +
          module.lessons.reduce(
            (inner, lesson) => inner + (getModuleProgress(module.id) / 100) * lesson.duration,
            0,
          ),
        0,
      ),
    );

    const nextLessonId =
      courseModules
        .flatMap(module =>
          module.lessons.map(lesson => ({ moduleId: module.id, lessonId: lesson.id })),
        )
        .find(entry => getModuleProgress(entry.moduleId) < 100)?.lessonId ?? null;

    const certificatesEarned = programProgress >= 100 ? 1 : 0;

    return {
      moduleProgress,
      latestQuizByModule,
      programProgress,
      completedLessons,
      totalLessons,
      totalMinutes,
      nextLessonId,
      certificatesEarned,
    };
  };

  return {
    courseModules,
    googleLearningTracks,
    youtubeCourses,
    getModuleProgress,
    setModuleProgress,
    getLatestQuizByModule,
    setLatestQuizByModule,
    getDashboardData,
  };
};

export type StaticData = ReturnType<typeof useStaticData>;
/** ModuleCard renders `{score}/100`, so a stored quiz result must become a percentage. */
export const quizPercent = (score?: { correct: number; total: number }): number | undefined =>
  score && score.total > 0 ? Math.round((score.correct / score.total) * 100) : undefined;
