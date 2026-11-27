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

  it("prefers the complete narrative over a short summary", () => {
    expect(
      getCaseDescription({
        summary: "A real summary",
        narrative: "The complete description.",
      }),
    ).toBe("The complete description.");
  });

  it("uses a summary when no narrative is available", () => {
    expect(
      getCaseDescription({
        summary: "A real summary",
        narrative: "",
      }),
    ).toBe("A real summary");
  });
});
