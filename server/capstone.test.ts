import { describe, expect, it } from "vitest";
import { capstoneCriteriaKeys, deriveCapstoneLevel, meetsCapstoneLevel, type CapstoneCriteria } from "./capstone";

const competent: CapstoneCriteria = { research: "competent", ai: "competent", wireframes: "competent", ui: "competent", accessibility: "competent", testing: "competent", documentation: "competent", portfolio: "competent" };

describe("capstone rubric", () => {
  it("contains the eight published review dimensions", () => {
    expect(capstoneCriteriaKeys).toEqual(["research", "ai", "wireframes", "ui", "accessibility", "testing", "documentation", "portfolio"]);
  });
  it("derives the overall level from the least-developed required criterion", () => {
    expect(deriveCapstoneLevel({ ...competent, accessibility: "novice", ui: "professional" })).toBe("novice");
    expect(deriveCapstoneLevel({ ...competent, ui: "advanced" })).toBe("competent");
  });
  it("tests an explicit minimum level without relying on student self-scores", () => {
    expect(meetsCapstoneLevel("advanced", "competent")).toBe(true);
    expect(meetsCapstoneLevel("novice", "competent")).toBe(false);
  });
});
