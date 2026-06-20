import { apiClient } from "./apiClient";

export interface AdminFeedbackDto {
  id: string;
  email: string;
  role: string;
  message: string;
  images: string[] | null;
  status: string;
  ts: string;
}

export const adminFeedbackApi = {
  getFeedbacks: async (): Promise<AdminFeedbackDto[]> => {
    const res = await apiClient("/api/admin/feedback", { method: "GET" });
    if (!res.ok) throw new Error("Failed to load feedback");
    return res.json();
  },
  
  resolve: async (id: string): Promise<void> => {
    const res = await apiClient(`/api/admin/feedback/${id}/resolve`, { method: "PATCH" });
    if (!res.ok) throw new Error("Failed to resolve feedback");
  }
};