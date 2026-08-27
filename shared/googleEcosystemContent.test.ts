import { describe, expect, it } from "vitest";
import { googleEcosystemStatement, googleLearningTracks } from "./googleEcosystemContent";

describe("google ecosystem learning catalog", () => {
  it("provides sixteen original companion tracks across core Google domains", () => {
    expect(googleLearningTracks).toHaveLength(16);
    expect(new Set(googleLearningTracks.map(track => track.id)).size).toBe(16);
    for (const track of googleLearningTracks) {
      expect(track.units).toHaveLength(3);
      expect(track.resources.length).toBeGreaterThanOrEqual(2);
      expect(track.studioBrief.es.length).toBeGreaterThan(40);
    }
  });

  it("keeps core learning content available in all three program languages", () => {
    for (const track of googleLearningTracks) {
      for (const locale of ["es", "pt", "en"] as const) {
        expect(track.title[locale]).toBeTruthy();
        expect(track.overview[locale]).toBeTruthy();
        expect(track.guardrail[locale]).toBeTruthy();
      }
    }
  });

  it("requires source URLs and clear reuse categories for every linked resource", () => {
    for (const resource of googleLearningTracks.flatMap(track => track.resources)) {
      expect(resource.url).toMatch(/^https:\/\//);
      expect(["open", "public-link"]).toContain(resource.access);
      expect(resource.license.length).toBeGreaterThan(5);
    }
    expect(googleEcosystemStatement.en).toContain("not affiliated");
  });
});
