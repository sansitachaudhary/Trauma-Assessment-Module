
import { API_BASE_URL } from "./api";

export interface RegisterPayload {
  full_name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  id: number;
  full_name: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

export async function registerUser(
  payload: RegisterPayload,
): Promise<RegisterResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(
      error?.detail || `Registration failed (${response.status})`,
    );
  }

  return (await response.json()) as RegisterResponse;
}

