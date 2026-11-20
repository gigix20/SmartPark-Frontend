import api from "@/api/axios";

export interface Vehicle {
  id: number | string;
  userId?: number;
  type: "Car" | "Motorcycle" | string;
  plateNumber: string;
  plateNo?: string;
  brand: string;
  model: string;
  brandModel?: string;
  color: string;
  year: string;
  status: "Approved" | "Pending" | "Rejected" | "Inactive" | string;
  rejectionReason?: string | null;
  qrCode?: string | null;
  registrationSource?: string;
  approvedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  regDate?: string;
  owner?: string;
  ownerFullName?: string;
  user?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    schoolId: string;
    avatar?: string | null;
  };
}

export async function getMyVehicles(): Promise<{ success: boolean; vehicles: Vehicle[] }> {
  const response = await api.get("/vehicles/my-vehicles");
  return response.data;
}

export async function registerVehicle(data: {
  type: string;
  plateNumber: string;
  brand: string;
  model: string;
  color: string;
  year: string;
}): Promise<{ success: boolean; message: string; vehicle: Vehicle }> {
  const response = await api.post("/vehicles", data);
  return response.data;
}

export async function updateVehicle(
  id: string | number,
  data: Partial<{
    type: string;
    plateNumber: string;
    brand: string;
    model: string;
    color: string;
    year: string;
  }>
): Promise<{ success: boolean; message: string; vehicle: Vehicle }> {
  const response = await api.patch(`/vehicles/${id}`, data);
  return response.data;
}

export async function deactivateVehicle(
  id: string | number
): Promise<{ success: boolean; message: string; vehicle: Vehicle }> {
  const response = await api.post(`/vehicles/${id}/deactivate`);
  return response.data;
}

export async function getVehicleQr(
  id: string | number
): Promise<{ success: boolean; qrCode: string; plateNumber: string; status: string }> {
  const response = await api.get(`/vehicles/${id}/qr`);
  return response.data;
}

export async function generateVehicleQr(
  id: string | number
): Promise<{ success: boolean; message: string; qrCode: string; vehicle: Vehicle }> {
  const response = await api.post(`/vehicles/${id}/generate-qr`);
  return response.data;
}

export async function getAdminVehicles(params?: {
  search?: string;
  tab?: string;
  status?: string;
  type?: string;
  page?: number;
  limit?: number;
}): Promise<{
  success: boolean;
  vehicles: Vehicle[];
  metrics: {
    totalRegistered: number;
    totalCars: number;
    totalMotorcycles: number;
  };
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}> {
  const response = await api.get("/admin/vehicles", { params });
  return response.data;
}

export async function getAdminVehicleRegistrations(params?: {
  search?: string;
  filter?: string;
}): Promise<{
  success: boolean;
  registrations: any[];
  metrics: {
    totalRegistered: number;
    pendingApprovals: number;
    activePasses: number;
  };
}> {
  const response = await api.get("/admin/vehicles/registrations", { params });
  return response.data;
}

export async function getAdminVehicleById(
  id: string | number
): Promise<{ success: boolean; vehicle: any }> {
  const response = await api.get(`/admin/vehicles/${id}`);
  return response.data;
}

export async function approveVehicle(
  id: string | number
): Promise<{ success: boolean; message: string; vehicle: Vehicle }> {
  const response = await api.post(`/admin/vehicles/${id}/approve`);
  return response.data;
}

export async function rejectVehicle(
  id: string | number,
  reason: string
): Promise<{ success: boolean; message: string; vehicle: Vehicle }> {
  const response = await api.post(`/admin/vehicles/${id}/reject`, { rejectionReason: reason });
  return response.data;
}

export async function updateAdminVehicleStatus(
  id: string | number,
  status: string
): Promise<{ success: boolean; message: string; vehicle: Vehicle }> {
  const response = await api.patch(`/admin/vehicles/${id}/status`, { status });
  return response.data;
}

export async function getVehicleParkingHistory(
  id: string | number,
  params?: {
    search?: string;
    date?: string;
    timeFilter?: string;
    page?: number;
    limit?: number;
  }
): Promise<{
  success: boolean;
  history: Array<{
    id: number;
    date: string;
    entryTime: string;
    exitTime: string;
    duration: string;
    status: string;
    registeredBy: string;
  }>;
  availableDates: string[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}> {
  const response = await api.get(`/admin/vehicles/${id}/history`, { params });
  return response.data;
}

