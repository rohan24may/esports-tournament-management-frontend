
import { apiFetch } from "@/lib/api";

export interface AuthResponse {
  token: string;
  tokenType: string;
  userId: number;
  fullName: string;
  email: string;
  role: "TEAM_MANAGER" | "ORGANIZER";
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

const AUTH_STORAGE_KEY = "dropzone_auth";

export async function login(
  credentials: LoginRequest
): Promise<AuthResponse> {
  const response = await apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });

  saveAuthSession(response);
  return response;
}

export async function register(
  details: RegisterRequest
): Promise<AuthResponse> {
  const response = await apiFetch<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(details),
  });

  saveAuthSession(response);
  return response;
}

export function saveAuthSession(user: AuthResponse): void {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
}

export function getAuthSession(): AuthResponse | null {
  const stored = localStorage.getItem(AUTH_STORAGE_KEY);

  if (!stored) return null;

  try {
    return JSON.parse(stored) as AuthResponse;
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

export function getDashboardPath(role: string): string {
  if (role === "ORGANIZER") return "/organizer/dashboard";
  return "/manager/dashboard";
}

export function logout(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}
