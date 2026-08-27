import { describe, expect, it } from "vitest";
import { validateEvidenceFile } from "./evidence";

describe("evidence validation", () => {
  it("accepts a small permitted PDF with a safe file name", () => {
    const bytes = validateEvidenceFile({ fileName: "research-notes.pdf", mimeType: "application/pdf", dataBase64: Buffer.from("sample").toString("base64") });
    expect(bytes.toString()).toBe("sample");
  });
  it("rejects non-permitted types and path-like file names", () => {
    expect(() => validateEvidenceFile({ fileName: "evidence.exe", mimeType: "application/octet-stream", dataBase64: "c2FtcGxl" })).toThrow("Unsupported evidence file type");
    expect(() => validateEvidenceFile({ fileName: "../evidence.pdf", mimeType: "application/pdf", dataBase64: "c2FtcGxl" })).toThrow("Invalid evidence file name");
  });
});
