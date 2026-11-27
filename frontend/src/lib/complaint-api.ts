import type { DemoCase, Indicator, Priority, ReviewStatus } from "./demo-data";

const API_BASE_URL = "http://127.0.0.1:8000";

export type ComplaintCreate = {
  description: string;
  language: string;
  notes: string;
  rule_based_score: number;
  rule_based_priority: Priority;
  rule_based_indicators: Indicator[];
};

export type ComplaintResponse = {
  id: number;
  description: string;
  language: string;
  status: string;
  created_at: string;
  assigned: string;
  notes: string;
  rule_based_score: number;
  rule_based_priority: Priority;
  rule_based_indicators: Indicator[];
  history: string[];
};

export type ComplaintUpdate = {
  status?: ReviewStatus;
  assigned?: string;
  notes?: string;
  rule_based_score?: number;
  rule_based_priority?: Priority;
  rule_based_indicators?: Indicator[];
  history_message?: string;
};

export async function createComplaint(
  payload: ComplaintCreate,
): Promise<ComplaintResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/complaints`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to create complaint (${response.status})`);
  }

  return (await response.json()) as ComplaintResponse;
}

export async function updateComplaint(
  id: number,
  payload: ComplaintUpdate,
): Promise<ComplaintResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/complaints/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to update complaint (${response.status})`);
  }

  return (await response.json()) as ComplaintResponse;
}

export async function getComplaints(): Promise<ComplaintResponse[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/complaints`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch complaints (${response.status})`);
  }

  return (await response.json()) as ComplaintResponse[];
}

export function complaintToDemoCase(complaint: ComplaintResponse): DemoCase {
  const mappedStatus =
    complaint.status === "pending_review" ? "Pending review" : complaint.status;
  const statusOptions: ReviewStatus[] = [
    "New",
    "Pending review",
    "In review",
    "Reviewed",
    "Referred",
    "Follow-up requested",
    "Closed",
  ];
  const status = statusOptions.find((option) => option === mappedStatus);
  if (!status) {
    throw new Error("The backend returned an unsupported case status.");
  }

  const language =
    complaint.language === "en"
      ? "English"
      : complaint.language === "hi"
        ? "Hindi"
        : complaint.language;

  return {
    id: `DB-${complaint.id}`,
    date: new Date(complaint.created_at).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    language,
    status,
    assigned: complaint.assigned,
    score: complaint.rule_based_score,
    priority: complaint.rule_based_priority,
    summary: complaint.description.slice(0, 100),
    narrative: complaint.description,
    indicators: complaint.rule_based_indicators,
    notes: complaint.notes,
    followUpDate: "",
    history: complaint.history,
  };
}

export function mergeSavedCases(
  complaints: ComplaintResponse[],
  existingCases: DemoCase[],
): DemoCase[] {
  const savedCasesById = new Map<string, DemoCase>();

  for (const complaint of complaints) {
    const savedCase = complaintToDemoCase(complaint);
    savedCasesById.set(savedCase.id, savedCase);
  }

  for (const existingCase of existingCases) {
    if (existingCase.id.startsWith("DB-")) {
      savedCasesById.set(existingCase.id, existingCase);
    }
  }

  const demoCases = existingCases.filter(
    (item) => !item.id.startsWith("DB-"),
  );
  return [...savedCasesById.values(), ...demoCases];
}
