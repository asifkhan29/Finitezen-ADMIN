import { apiClient } from "./apiClient"; // Adjust your local import path here

export const adminAuthApi = {
  login: async (username: string, password: string) => {
    // Backend expects data over @RequestParam (application/x-www-form-urlencoded)
    const params = new URLSearchParams({ username, password }).toString();
    
    // ✅ Uses your wrapper cleanly and lets apiClient append the base URL automatically
    const response = await apiClient(`/api/auth/admin/login?${params}`, {
      method: "POST"
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || "Authentication failed.");
    }

    // Returns payload containing: { accessToken: "eyJhb..." }
    return response.json();
  }
};