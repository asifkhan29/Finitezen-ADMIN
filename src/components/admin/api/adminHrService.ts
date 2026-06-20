import { apiClient } from "./apiClient";

export interface HrUserDto {
  id: string;
  name: string;
  email: string;
  country: string;
  role: string;
  status: string;
  joined: string;
  activeNylas: number;   // ✅
  inactiveNylas: number; // ✅
}

export interface HrDetailStatsDto {
  resumesByMail: number;
  resumesByBulk: number;
  dailyEmailsSent: number;    // Renamed from emailsSent
  emailLimit: number;
  lifetimeEmailsSent: number; // New field
  activeGrants: number;
  dailySearchesUsed: number;  // Renamed from searchesUsed
}

export interface HrDetailResponse {
  profile: HrUserDto;
  stats: HrDetailStatsDto;
  recentResumes: any[];
  recentEmails: any[];
}

export const adminHrApi = {
  getUsers: async (): Promise<HrUserDto[]> => {
    const res = await apiClient("/api/admin/hr", { method: "GET" });
    if (!res.ok) throw new Error("Failed to load HR directory.");
    return res.json();
  },
  
  getDetail: async (id: string): Promise<HrDetailResponse> => {
    const res = await apiClient(`/api/admin/hr/${id}`, { method: "GET" });
    if (!res.ok) throw new Error("Failed to load HR detail.");
    return res.json();
  },

  toggleStatus: async (id: string): Promise<void> => {
    const res = await apiClient(`/api/admin/hr/${id}/toggle-status`, { method: "POST" });
    if (!res.ok) throw new Error("Failed to toggle status.");
  }
};