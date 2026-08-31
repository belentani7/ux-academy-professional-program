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

    return { moduleProgress, latestQuizByModule };
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