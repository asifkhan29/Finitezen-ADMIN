import { apiClient } from "./apiClient";

export interface ActivityLogDto {
  who: string;
  action: string;
  ts: string;
}

export interface DashboardMetricsResponse {
  totalUsers: number;
  eliteUsers: number;
  proUsers: number;
  normalUsers: number;
  totalResumes: number;
  byMail: number;
  byBulk: number;
  emailsSent: number;
  activeGrants: number;
  totalGrants: number;
  totalRevenue: number;
  transactionCount: number;
  recentActivity: ActivityLogDto[];
}

export const adminDashboardApi = {
  getMetrics: async (): Promise<DashboardMetricsResponse> => {
    // Automatically attaches the Bearer token configured in your apiClient
    const response = await apiClient("/api/admin/dashboard/metrics", {
      method: "GET"
    });
    
    if (!response.ok) {
      throw new Error("Failed to fetch dashboard metrics");
    }
    
    return response.json();
  }
};