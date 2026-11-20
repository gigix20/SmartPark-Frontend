import api from "@/api/axios";

export interface StudentDashboardData {
  success: boolean;
  parkingOverview: {
    occupied: number;
    available: number;
    totalCapacity: number;
    occupancyRate: number;
    availabilityLevel: "High" | "Moderate" | "Limited" | "Full";
    remainingSlots: number;
  };
  vehiclesCount: number;
  recentHistory: {
    id: string;
    vehicleTitle: string;
    plateNumber: string;
    dateTime: string;
    action: "ENTRY" | "EXIT";
    status: string;
  }[];
}

export interface StudentParkingOverviewData {
  success: boolean;
  overview: {
    occupied: number;
    totalCapacity: number;
    available: number;
    occupancyRatio: number;
    carsCount: number;
    carsCapacity: number;
    carsPercentage: string;
    motorcycleCount: number;
    motorcycleCapacity: string | number;
    motorcyclePercentage: string;
  };
}

/**
 * Fetch live data for StudentHome.tsx dashboard
 */
export async function getStudentDashboard(): Promise<StudentDashboardData> {
  const response = await api.get("/student/dashboard");
  return response.data;
}

/**
 * Fetch live data for Parking.tsx parking page
 */
export async function getStudentParkingOverview(): Promise<StudentParkingOverviewData> {
  try {
    const response = await api.get("/parking");
    return response.data;
  } catch {
    const fallback = await api.get("/student/parking");
    return fallback.data;
  }
}
