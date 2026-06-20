const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://resume-ai-m37c.onrender.com";

export const apiClient = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("token");
  
  const baseHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const finalHeaders: Record<string, string> = {
    ...baseHeaders,
    ...(options.headers as Record<string, string>),
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: finalHeaders,
  });

  // If access is explicitly unauthorized, clear the token and force user out
  if (response.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/login";
    throw new Error("Administrative session expired or token rejected.");
  }
  
  return response;
};