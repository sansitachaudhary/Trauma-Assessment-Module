import type { DemoCase } from "./demo-data";

export function getCaseDescription(
  item: Pick<DemoCase, "summary" | "narrative">,
) {
  const description = [item.summary, item.narrative].find((value) => {
    const normalized =
      typeof value === "string" ? value.trim().toLowerCase() : "";
    return !["", "string", "undefined", "null"].includes(normalized);
  });

  return description ?? "No description provided yet.";
}
