import api from "@/api/axios";

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  schoolId: string;
  phone?: string | null;
  role: string;
  accountStatus: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

export interface LoginCredentials {
  identifier: string; // Email or School ID
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  schoolId: string;
  phone?: string;
  password: string;
}

// 1. Log in existing user
export async function loginUser(credentials: LoginCredentials): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>("/login", credentials);
  return response.data;
}

// 2. Register new user
export async function registerUser(data: RegisterData): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>("/register", data);
  return response.data;
}

// 3. Fetch currently logged in user profile
export async function getCurrentUser(): Promise<{ success: boolean; user: User }> {
  const response = await api.get<{ success: boolean; user: User }>("/me");
  return response.data;
}

// 4. Log out user
export function logoutUser(): void {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}
