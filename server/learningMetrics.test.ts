import { describe, expect, it } from "vitest";
import { buildModuleProgress, calculateProgramScore, groupPracticeByModule } from "./learningMetrics";
import { courseModules } from "../shared/courseContent";

describe("learning metrics", () => {
  it("reports progress for every module from completed lessons", () => {
    const first = courseModules[0];
    const progress = buildModuleProgress(courseModules.slice(0, 1), new Set(first.lessons.map(item => item.id)));
    expect(progress).toEqual([{ moduleId: first.id, completed: first.lessons.length, total: first.lessons.length, percentage: 100 }]);
  });
  it("averages latest program scores and groups practice by module", () => {
    expect(calculateProgramScore({ research: 80, accessibility: 60 })).toBe(70);
    expect(calculateProgramScore({})).toBe(0);
    expect(groupPracticeByModule([{ moduleId: "research" }, { moduleId: "research" }, { moduleId: "accessibility" }])).toEqual({ research: 2, accessibility: 1 });
  });
});
