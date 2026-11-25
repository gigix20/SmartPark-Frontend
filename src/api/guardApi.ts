import api from "./axios";

export interface MonitoringRecord {
  id: string;
  owner: string;
  plate: string;
  vehicleType?: "Car" | "Motorcycle";
  timeOrDate: string;
  rawDate?: string;
  registrationSource?: string;
  guard?: string;
  duration?: string;
  action?: "ENTRY" | "EXIT";
  result?: "GRANTED" | "DENIED";
}

export interface GuardMonitoringMetrics {
  entriesToday: number;
  exitsToday: number;
  currentlyInside: number;
}

export interface GuardMonitoringResponse {
  success: boolean;
  tab: string;
  metrics: GuardMonitoringMetrics;
  records: MonitoringRecord[];
  allFilteredRecords?: MonitoringRecord[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface GuardMonitoringParams {
  tab?: "entries" | "exits" | "inside" | "history";
  search?: string;
  vehicleType?: string;
  date?: string;
  page?: number;
  limit?: number;
}

export interface GuardDashboardMetrics {
  vehiclesInside: number;
  totalCapacity: number;
  entriesToday: number;
  exitsToday: number;
  unreadNotifications: number;
}

export interface GuardActivityItem {
  id: string | number;
  plateNo: string;
  type: string;
  action: "ENTRY" | "EXIT";
  time: string;
}

export interface GuardDashboardResponse {
  success: boolean;
  metrics: GuardDashboardMetrics;
  recentActivities: GuardActivityItem[];
}

export interface GuardScanResponse {
  success: boolean;
  reason?: string;
  message?: string;
  vehicle?: {
    id: number;
    plateNumber: string;
    type: string;
    brand: string;
    model: string;
    color: string;
    year: string;
    ownerName: string;
    schoolId: string;
    role: string;
    email?: string;
    phone?: string;
    photo?: string | null;
    registrationSource?: string;
  };
  isCurrentlyParked?: boolean;
  activeLog?: {
    id: number;
    entryTime: string;
    formattedEntryTime: string;
    duration: string;
  } | null;
}

/**
 * 1. Fetch live records for Gate Monitoring
 */
export async function getGuardMonitoring(params: GuardMonitoringParams = {}): Promise<GuardMonitoringResponse> {
  const res = await api.get("/guard/monitoring", { params });
  return res.data;
}

export interface GateRegistrationPayload {
  ownerName: string;
  vehicleType: string;
  plateNumber: string;
  brand?: string;
  model: string;
  color?: string;
  idType?: string;
  idNumber?: string;
}

export async function registerGateVehicle(data: GateRegistrationPayload) {
  const res = await api.post("/guard/register-vehicle", data);
  return res.data;
}

/**
 * 2. Fetch live metrics & activities for Guard Dashboard
 */
export async function getGuardDashboard(): Promise<GuardDashboardResponse> {
  const res = await api.get("/guard/dashboard");
  return res.data;
}

/**
 * 3. Verify vehicle code (plate or QR)
 */
export async function scanGuardCode(code: string): Promise<GuardScanResponse> {
  const res = await api.post("/guard/scan", { code });
  return res.data;
}

/**
 * 4. Record vehicle entry
 */
export async function recordGuardEntry(vehicleId: number) {
  const res = await api.post("/guard/record-entry", { vehicleId });
  return res.data;
}

/**
 * 5. Record vehicle exit
 */
export async function recordGuardExit(vehicleId: number) {
  const res = await api.post("/guard/record-exit", { vehicleId });
  return res.data;
}

/**
 * 6. Get registered vehicles list
 */
export async function getGuardVehicles(params: { search?: string; status?: string; vehicleType?: string } = {}) {
  const res = await api.get("/guard/vehicles", { params });
  return res.data;
}

/**
 * 7. Deactivate vehicle pass
 */
export async function deactivateGuardVehicle(id: string | number) {
  const res = await api.patch(`/guard/vehicles/${id}/deactivate`);
  return res.data;
}

/**
 * 8. Activate vehicle pass
 */
export async function activateGuardVehicle(id: string | number) {
  const res = await api.patch(`/guard/vehicles/${id}/activate`);
  return res.data;
}
