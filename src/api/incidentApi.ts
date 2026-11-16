import api from "./axios";

export interface IncidentItem {
  id: number;
  ref: string;
  reporter: string;
  reporterEmail: string;
  reporterPhone: string;
  type: string;
  model: string;
  color: string;
  plate: string;
  reportType: string;
  status: "Pending" | "Reviewed" | "Rejected" | "Unidentified";
  desc: string;
  evidenceImg: string;
  submitted: string;
  action: "Review" | "View";
  rejectionReason?: string | null;
  reviewedBy?: string | null;
  reviewedAt?: string | null;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
}

export interface IncidentMetrics {
  waitingForReview: number;
  reviewedThisWeek: number;
  reviewedToday: number;
  totalIncidents: number;
}

export interface AdminIncidentsResponse {
  success: boolean;
  incidents: IncidentItem[];
  metrics: IncidentMetrics;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface AdminIncidentsParams {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}

/**
 * Fetch incident reports list with search, status tabs, pagination, and metrics
 */
export async function getAdminIncidents(params?: AdminIncidentsParams): Promise<AdminIncidentsResponse> {
  const res = await api.get("/admin/incidents", { params });
  return res.data;
}

/**
 * Fetch single incident report details by ID
 */
export async function getAdminIncidentDetails(id: string | number): Promise<{ success: boolean; incident: IncidentItem }> {
  const res = await api.get(`/admin/incidents/${id}`);
  return res.data;
}

/**
 * Review an incident: Mark as Reviewed or Rejected with a recorded reason
 */
export async function reviewAdminIncident(
  id: string | number,
  payload: { action: "Reviewed" | "Rejected"; rejectionReason?: string }
): Promise<{ success: boolean; message: string; incident: any }> {
  const res = await api.patch(`/admin/incidents/${id}/review`, payload);
  return res.data;
}

/**
 * Submit an incident report from the student portal
 */
export async function submitIncidentReport(payload: {
  vehicleType: string;
  color: string;
  model: string;
  plateNumber: string;
  reportType: string;
  description: string;
  evidenceImage?: string | null;
}): Promise<{ success: boolean; message: string; incident: any }> {
  const res = await api.post("/incidents", payload);
  return res.data;
}

/**
 * Get reports filed by the logged-in student
 */
export async function getMyIncidentReports(): Promise<{ success: boolean; reports: any[] }> {
  const res = await api.get("/incidents/my-reports");
  return res.data;
}
