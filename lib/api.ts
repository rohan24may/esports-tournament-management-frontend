
const API_URL =
  typeof window === "undefined"
    ? process.env.API_INTERNAL_URL
    : process.env.NEXT_PUBLIC_API_URL;
const AUTH_STORAGE_KEY = "dropzone_auth";

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = new Headers(options.headers);

  headers.set("Content-Type", "application/json");

  // Automatically attach JWT when running in the browser.
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);

    if (stored) {
      try {
        const session = JSON.parse(stored);

        if (session.token) {
          headers.set(
            "Authorization",
            `${session.tokenType || "Bearer"} ${session.token}`
          );
        }
      } catch {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();

    let message = errorText || `API Error: ${response.status}`;

    try {
      const parsed = JSON.parse(errorText);
      message = parsed.message || parsed.detail || parsed.error || message;
    } catch {
      // Keep original error text.
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}
