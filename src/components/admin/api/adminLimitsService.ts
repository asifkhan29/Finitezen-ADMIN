import { apiClient } from "./apiClient";

export interface AdminUserLimitDto {
  userId: string;
  name: string;
  email: string;
  country: string;
  role: string;
  searchesUsed: number;
  searchesCap: number;
  grantsUsed: number;
  grantsCap: number;
  emailsUsed: number;
  emailsCap: number;
}

export const adminLimitsApi = {
  getLimits: async (): Promise<AdminUserLimitDto[]> => {
    const res = await apiClient("/api/admin/limits", { method: "GET" });
    if (!res.ok) throw new Error("Failed to load user limits.");
    return res.json();
  }
};