import { apiClient } from "./apiClient";

export interface NylasGrantDto {
  grantId: string;
  hrId: string;
  ownerEmail: string;
  mailbox: string;
  country: string;
  status: string;
  lastSync: string | null;
}

export interface NylasMonitorResponse {
  totalGrants: number;
  activeGrants: number;
  revokedGrants: number;
  grants: NylasGrantDto[];
}

export const adminNylasApi = {
  getMonitorData: async (): Promise<NylasMonitorResponse> => {
    const res = await apiClient("/api/admin/nylas", { method: "GET" });
    if (!res.ok) throw new Error("Failed to load Nylas telemetry.");
    return res.json();
  }
};