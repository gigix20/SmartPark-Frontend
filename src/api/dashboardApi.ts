import api from "./axios";

export interface DashboardMetrics {
  totalCapacity: number;
  availableSpaces: number;
  currentlyInside: number;
  occupancyRate: number;
  availabilityStatus: "High" | "Moderate" | "Low";
  todayEntries: number;
  todayExits: number;
  lastExitTimeFormatted: string;
  pendingIncidentCount: number;
  pendingVehicleCount: number;
}

export type DayOfWeek = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

export interface DashboardTrends {
  weeklyUtilization: Record<DayOfWeek, number>;
  totalWeeklyLogs: number;
}

export interface DashboardAwaitingAction {
  latestIncident: {
    id: number;
    referenceId: string;
    reportType: string;
    model: string;
    plate: string;
  } | null;
  pendingIncidentCount: number;
  latestVehicle: {
    id: number;
    plateNumber: string;
    brand: string;
    model: string;
    ownerName: string;
  } | null;
  pendingVehicleCount: number;
}

export interface DashboardActivityItem {
  id: string;
  title: string;
  time: string;
  dotColor: string;
  type: "entry" | "exit" | "incident" | "registration";
}

export interface DashboardData {
  metrics: DashboardMetrics;
  trends: DashboardTrends;
  awaitingAction: DashboardAwaitingAction;
  recentActivities: DashboardActivityItem[];
}

export interface DashboardResponse {
  success: boolean;
  data: DashboardData;
}

/**
 * Fetch unified live metrics and activities for Admin Dashboard
 */
export async function getAdminDashboard(): Promise<DashboardResponse> {
  const res = await api.get("/admin/dashboard");
  return res.data;
}

export interface SidebarCountsResponse {
  success: boolean;
  counts: {
    pendingVehicles: number;
    pendingIncidents: number;
    unreadNotifications: number;
  };
}

export async function getSidebarCounts(): Promise<SidebarCountsResponse> {
  const res = await api.get("/admin/dashboard/sidebar-counts");
  return res.data;
}
