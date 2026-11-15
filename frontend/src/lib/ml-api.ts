
const API_BASE_URL = "http://127.0.0.1:8000";

export interface MLPredictionResponse {
  predicted_label: number;
  class_probabilities: Record<string, number>;
  model_version: string;
  research_only: boolean;
  clinical_use: boolean;
  label_meaning: string;
}

export async function predictWithML(
  text: string,
): Promise<MLPredictionResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/ml/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(
      error?.detail || `ML prediction failed (${response.status})`,
    );
  }

  return response.json();
}
