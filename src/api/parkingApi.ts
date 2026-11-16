import api from "./axios";

export interface ParkingCategoryOverview {
  capacity: number;
  parked: number;
  available: number;
  occupancyRate: number;
}

export interface ParkingOverviewData {
  totalCapacity: number;
  totalOccupied: number;
  availableSpaces: number;
  occupancyRate: number;
  cars: ParkingCategoryOverview;
  motorcycles: ParkingCategoryOverview;
}

export interface ParkingCapacityData {
  carCapacity: number;
  motorcycleCapacity: number;
  totalCapacity: number;
  carParked: number;
  motorcycleParked: number;
  totalOccupied: number;
  utilizationPercentage: number;
}

export interface ParkingHistoryItem {
  id: number;
  date: string;
  rawEntryTime: string;
  rawExitTime: string | null;
  vehicleName: string;
  type: string;
  plateNo: string;
  entryTime: string;
  exitTime: string;
  duration: string;
  status: string;
  guardName: string;
  ownerName: string;
}

export interface ParkingHistoryResponse {
  success: boolean;
  history: ParkingHistoryItem[];
  availableDates: string[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ParkingHistoryParams {
  search?: string;
  type?: string;
  date?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface ParkingAnalyticsData {
  vehiclesEntering24h: number;
  vehiclesExiting24h: number;
  peakParkingHour: string;
  distribution: {
    cars: number;
    motorcycles: number;
    total: number;
    carPercentage: number;
    motorcyclePercentage: number;
  };
  weeklyUtilization: {
    Mon: number;
    Tue: number;
    Wed: number;
    Thu: number;
    Fri: number;
    Sat: number;
    Sun: number;
  };
}

/**
 * Fetch live parking overview stats and occupancy
 */
export async function getParkingOverview(): Promise<{ success: boolean; data: ParkingOverviewData }> {
  const res = await api.get("/admin/parking/overview");
  return res.data;
}

/**
 * Fetch configured parking capacities and real-time occupied spaces
 */
export async function getParkingCapacity(): Promise<{ success: boolean; data: ParkingCapacityData }> {
  const res = await api.get("/admin/parking/capacity");
  return res.data;
}

/**
 * Update car and motorcycle parking capacity
 */
export async function updateParkingCapacity(payload: {
  carCapacity: number;
  motorcycleCapacity: number;
}): Promise<{ success: boolean; message: string; data: { carCapacity: number; motorcycleCapacity: number; totalCapacity: number } }> {
  const res = await api.put("/admin/parking/capacity", payload);
  return res.data;
}

/**
 * Fetch paginated parking history logs with search & filters
 */
export async function getParkingHistory(params?: ParkingHistoryParams): Promise<ParkingHistoryResponse> {
  const res = await api.get("/admin/parking/history", { params });
  return res.data;
}

/**
 * Fetch parking analytics, 24h stats, peak hours, and vehicle distribution
 */
export async function getParkingAnalytics(): Promise<{ success: boolean; data: ParkingAnalyticsData }> {
  const res = await api.get("/admin/parking/analytics");
  return res.data;
}
