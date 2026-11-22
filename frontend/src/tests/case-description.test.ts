import { describe, expect, it } from "vitest";
import { getCaseDescription } from "@/lib/case-description";

describe("getCaseDescription", () => {
  it("uses the narrative when the summary is only a placeholder", () => {
    expect(
      getCaseDescription({
        summary: "string",
        narrative: "A person’s actual intake description.",
      }),
    ).toBe("A person’s actual intake description.");
  });

  it("shows a friendly fallback for empty or placeholder descriptions", () => {
    expect(
      getCaseDescription({ summary: "undefined", narrative: "null" }),
    ).toBe("No description provided yet.");
  });

  it("preserves a real description", () => {
    expect(
      getCaseDescription({
        summary: "A real summary",
        narrative: "The complete description.",
      }),
    ).toBe("A real summary");
  });
});
