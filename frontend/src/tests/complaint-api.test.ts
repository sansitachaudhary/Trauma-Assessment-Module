import { afterEach, describe, expect, it, vi } from "vitest";
import {
  complaintToDemoCase,
  mergeSavedCases,
  updateComplaint,
  type ComplaintResponse,
} from "@/lib/complaint-api";

const complaint: ComplaintResponse = {
  id: 3,
  description: "A complete fictional intake narrative with its ending.",
  language: "en",
  status: "Reviewed",
  created_at: "2026-11-24T10:00:00Z",
  assigned: "Placeholder responder",
  notes: "Follow-up recorded.",
  rule_based_score: 20,
  rule_based_priority: "Low",
  rule_based_indicators: [
    { key: "fear", label: "Expressed fear", evidence: "fictional evidence" },
  ],
  history: ["24 Nov 2026 · Responder assigned"],
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("complaint API data flow", () => {
  it("maps persisted workflow fields and keeps the full narrative", () => {
    const item = complaintToDemoCase(complaint);

    expect(item.status).toBe("Reviewed");
    expect(item.assigned).toBe("Placeholder responder");
    expect(item.score).toBe(20);
    expect(item.notes).toBe("Follow-up recorded.");
    expect(item.history).toEqual(["24 Nov 2026 · Responder assigned"]);
    expect(item.narrative).toBe(complaint.description);
    expect(item.indicators).toEqual(complaint.rule_based_indicators);
  });

  it("maps the legacy backend review status", () => {
    expect(
      complaintToDemoCase({ ...complaint, status: "pending_review" }).status,
    ).toBe("Pending review");
  });

  it("keeps a local saved case when the initial list response is stale", () => {
    const currentCase = complaintToDemoCase(complaint);
    const staleComplaint = {
      ...complaint,
      status: "New",
      assigned: "Unassigned",
      rule_based_score: 0,
    };

    const merged = mergeSavedCases([staleComplaint], [currentCase]);

    expect(merged).toHaveLength(1);
    expect(merged[0].status).toBe("Reviewed");
    expect(merged[0].assigned).toBe("Placeholder responder");
    expect(merged[0].score).toBe(20);
    expect(merged[0].narrative).toBe(complaint.description);
  });

  it("sends a partial patch without replacing unrelated case fields", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(complaint), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await updateComplaint(3, {
      assigned: "Placeholder responder",
      history_message: "Responder assigned",
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "http://127.0.0.1:8000/api/v1/complaints/3",
      expect.objectContaining({
        method: "PATCH",
        body: JSON.stringify({
          assigned: "Placeholder responder",
          history_message: "Responder assigned",
        }),
      }),
    );
  });
});
