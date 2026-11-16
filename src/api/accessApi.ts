import api from "./axios";

export interface AccessRecordItem {
  id: number;
  plateNo: string;
  vehicleDesc: string;
  owner: string;
  dateTime: string;
  rawTime: string | null;
  guard: string;
  type: string;
  category: "Entries" | "Exits" | "Currently Inside" | string;
  status: string;
}

export interface AccessMetrics {
  todayEntries: number;
  todayExits: number;
  currentlyInside: number;
}

export interface AccessRecordsResponse {
  success: boolean;
  metrics: AccessMetrics;
  records: AccessRecordItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface AccessRecordsParams {
  search?: string;
  tab?: string;
  page?: number;
  limit?: number;
}

export interface AccessHistoryItem {
  id: string;
  logId: number;
  plateNo: string;
  vehicleDesc: string;
  owner: string;
  action: "Entry" | "Exit";
  dateTime: string;
  rawDate: string;
  guard: string;
  source: "User registration" | "Gate registration";
}

export interface AccessHistoryResponse {
  success: boolean;
  history: AccessHistoryItem[];
  availableDates: string[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface AccessHistoryParams {
  search?: string;
  action?: string;
  source?: string;
  dateRange?: string;
  page?: number;
  limit?: number;
}

/**
 * Fetch real-time access records & metrics for Admin / Super Admin
 */
export async function getAdminAccessRecords(
  params?: AccessRecordsParams
): Promise<AccessRecordsResponse> {
  const res = await api.get("/admin/access/records", { params });
  return res.data;
}

/**
 * Fetch detailed access entry/exit history logs with multi-filters
 */
export async function getAdminAccessHistory(
  params?: AccessHistoryParams
): Promise<AccessHistoryResponse> {
  const res = await api.get("/admin/access/history", { params });
  return res.data;
}
