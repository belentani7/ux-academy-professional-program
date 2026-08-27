import { describe, expect, it } from "vitest";
import { growthStatement, growthTracks, videoLibrary } from "./growthContent";

describe("growth curriculum and video curation", () => {
  it("provides four original trilingual tracks with applied lessons and portfolio work", () => {
    expect(growthTracks).toHaveLength(4);
    for (const track of growthTracks) {
      expect(track.lessons).toHaveLength(4);
      expect(track.rubric).toHaveLength(3);
      for (const locale of ["es", "pt", "en"] as const) {
        expect(track.title[locale]).toBeTruthy();
        expect(track.portfolioBrief[locale]).toBeTruthy();
      }
    }
  });

  it("keeps audiovisual resources linked, categorized, and traceable to their publisher", () => {
    expect(videoLibrary.length).toBeGreaterThanOrEqual(20);
    for (const resource of videoLibrary) {
      expect(resource.publisher).toBeTruthy();
      expect(resource.url).toMatch(/^https:\/\//);
      expect(resource.topics.length).toBeGreaterThan(0);
      expect(["public-link", "open-documentation"]).toContain(resource.access);
    }
    expect(growthStatement.en).toContain("not copied");
  });

  it("connects every growth track to curated source material", () => {
    const knownIds = new Set(videoLibrary.map(resource => resource.id));
    for (const track of growthTracks) {
      expect(track.resourceIds.length).toBeGreaterThanOrEqual(4);
      expect(track.resourceIds.every(id => knownIds.has(id))).toBe(true);
    }
  });
});
