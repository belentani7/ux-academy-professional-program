import { describe, expect, it } from "vitest";
import { parseMentorFeedback } from "./mentor";

describe("mentor feedback parsing", () => {
  it("accepts valid structured feedback", () => expect(parseMentorFeedback(JSON.stringify({ feedback: "Focus on the evidence gap." }), "fallback")).toBe("Focus on the evidence gap."));
  it("uses a safe editorial fallback for missing, malformed, or non-string model responses", () => {
    expect(parseMentorFeedback('{"other":"value"}', "fallback")).toBe("fallback");
    expect(parseMentorFeedback("not json", "fallback")).toBe("fallback");
    expect(parseMentorFeedback([], "fallback")).toBe("fallback");
  });
});
