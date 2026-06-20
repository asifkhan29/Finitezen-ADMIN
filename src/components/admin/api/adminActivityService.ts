import { apiClient } from "./apiClient";

export interface ResumeLogDto {
  file: string;
  by: string;
  country: string;
  method: string;
  ts: string;
}

export interface EmailLogDto {
  hrEmail: string; // ✅ NEW
  from: string;
  to: string;
  country: string;
  status: string;
  ts: string;
}

export const adminActivityApi = {
  getResumeLogs: async (): Promise<ResumeLogDto[]> => {
    const response = await apiClient("/api/admin/activity/resumes", { method: "GET" });
    if (!response.ok) throw new Error("Failed to fetch resume logs.");
    return response.json();
  },
  
  getEmailLogs: async (): Promise<EmailLogDto[]> => {
    const response = await apiClient("/api/admin/activity/emails", { method: "GET" });
    if (!response.ok) throw new Error("Failed to fetch email logs.");
    return response.json();
  }
};