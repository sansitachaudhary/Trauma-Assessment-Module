
const API_BASE_URL = "http://127.0.0.1:8000";

export type ComplaintCreate = {
  description: string;
  language: string;
};

export type ComplaintResponse = {
  id: number;
  description: string;
  language: string;
  status: string;
  created_at: string;
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
    const message = await response.text();
    throw new Error(
      `Failed to create complaint (${response.status}): ${message}`,
    );
  }

  return (await response.json()) as ComplaintResponse;
}
