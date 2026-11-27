
import { API_BASE_URL } from "./api";
import { getToken } from "./auth-api";

export interface PendingAssessment {
  id: number;
  case_id: number;
  svi: number;
  indicators: string[];
  safety_review_required: boolean;
  review_status: string;
  model_version: string;
  created_at: string;
  case_description: string;
  case_language: string;
  case_created_at: string;
}

export interface AssessmentReviewRequest {
  review_status: "approved" | "rejected";
}

export async function getPendingAssessments(): Promise<PendingAssessment[]> {
  const token = getToken();

  if (!token) {
    throw new Error("You are not logged in.");
  }

  const response = await fetch(
    `${API_BASE_URL}/api/v1/assessments/pending`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(
      error?.detail || `Failed to fetch assessments (${response.status})`,
    );
  }

  return response.json();
}

export async function reviewAssessment(
  assessmentId: number,
  payload: AssessmentReviewRequest,
): Promise<void> {
  const token = getToken();

  if (!token) {
    throw new Error("You are not logged in.");
  }

  const response = await fetch(
    `${API_BASE_URL}/api/v1/assessments/${assessmentId}/review`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(
      error?.detail || `Failed to submit review (${response.status})`,
    );
  }
}
