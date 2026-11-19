import { apiFetch } from "@/lib/api";

export interface AuthResponse {
  token: string;
  tokenType: string;
  userId: number;
  fullName: string;
  email: string;
  role: UserRole;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
  inviteCode?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

const AUTH_STORAGE_KEY = "dropzone_auth";
const AUTH_CHANGE_EVENT = "dropzone-auth-change";

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
  if (typeof window === "undefined") return;

  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

export function getAuthSession(): AuthResponse | null {
  if (typeof window === "undefined") return null;

  const stored = localStorage.getItem(AUTH_STORAGE_KEY);

  if (!stored) return null;

  try {
    return JSON.parse(stored) as AuthResponse;
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

export function getDashboardPath(role: UserRole): string {
  switch (role) {
    case "ORGANIZER":
      return "/organizer/dashboard";

    case "TEAM_MANAGER":
      return "/manager/dashboard";

    case "PLAYER":
      return "/players";

    case "VIEWER":
      return "/";
  }
}

export function getPostLoginPath(
  role: AuthResponse["role"],
  redirectTo: string | null
): string {
  if (redirectTo) {
    try {
      const destination = new URL(
        redirectTo,
        "https://dropzone.local"
      );

      if (
        destination.origin === "https://dropzone.local" &&
        redirectTo.startsWith("/") &&
        !redirectTo.startsWith("//") &&
        !redirectTo.includes("\\")
      ) {
        return (
          destination.pathname +
          destination.search +
          destination.hash
        );
      }
    } catch {
      // Use the role-based dashboard for an invalid redirect.
    }
  }

  return getDashboardPath(role);
}

export function getLoginRedirectUrl(currentPath: string): string {
  return `/login?redirectTo=${encodeURIComponent(currentPath)}`;
}

export function logout(): void {
  if (typeof window === "undefined") return;

  localStorage.removeItem(AUTH_STORAGE_KEY);
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}
export type UserRole =
  | "TEAM_MANAGER"
  | "ORGANIZER"
  | "PLAYER"
  | "VIEWER";