import { describe, expect, it } from "vitest";
import { courseModules, resourceLibrary } from "./courseContent";

describe("published curriculum", () => {
  it("offers a complete seventeen-module program with lessons and checks", () => {
    expect(courseModules).toHaveLength(17);
    for (const module of courseModules) {
      expect(module.lessons.length).toBeGreaterThan(0);
      expect(module.quiz.length).toBeGreaterThan(0);
      expect(module.competencies.length).toBeGreaterThan(0);
      expect(module.miniProject.es.length).toBeGreaterThan(20);
    }
  });
  it("keeps the three editorial languages available for all module titles", () => {
    for (const module of courseModules) {
      expect(module.title.es).toBeTruthy();
      expect(module.title.pt).toBeTruthy();
      expect(module.title.en).toBeTruthy();
    }
  });
  it("keeps a library with official and educational references", () => {
    expect(resourceLibrary.length).toBeGreaterThanOrEqual(12);
    expect(resourceLibrary.some(item => item.type.en === "Official")).toBe(true);
  });
});
