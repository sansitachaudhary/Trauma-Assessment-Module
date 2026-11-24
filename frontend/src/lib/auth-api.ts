
import { API_BASE_URL } from "./api";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface CurrentUser {
  id: number;
  full_name: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

const TOKEN_KEY = "sahyog_access_token";

export async function login(
  credentials: LoginRequest,
): Promise<LoginResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(credentials),
    },
  );

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(
      error?.detail || `Login failed (${response.status})`,
    );
  }

  const data: LoginResponse = await response.json();

  localStorage.setItem(TOKEN_KEY, data.access_token);

  return data;
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export async function getCurrentUser(): Promise<CurrentUser> {
  const token = getToken();

  if (!token) {
    throw new Error("You are not logged in.");
  }

  const response = await fetch(
    `${API_BASE_URL}/api/v1/auth/me`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    if (response.status === 401) {
      logout();
    }

    throw new Error(
      `Failed to fetch user profile (${response.status})`,
    );
  }

  return response.json();
}

export function logout(): void {
  localStorage.removeItem(TOKEN_KEY);
}
 
export function isAuthenticated(): boolean {
  return Boolean(getToken());
}
