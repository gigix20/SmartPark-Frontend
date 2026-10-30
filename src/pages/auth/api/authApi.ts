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
  identifier: string;
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

export interface AdminRegisterData {
  firstName: string;
  lastName: string;
  email: string;
  schoolId: string;
  phone?: string;
  password: string;
  role: "GUARD" | "ADMIN";
}

export interface ForgotPasswordData {
  email: string;
}

export interface VerifyOtpData {
  email: string;
  otp: string;
}

export interface ResetPasswordData {
  email: string;
  otp: string;
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

// 4. Log out user - clear all auth storage
export function logoutUser(): void {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  // Clear any additional auth-related items if added in future
}

// 5. Admin-only register privileged account
export async function registerAdminUser(data: AdminRegisterData): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>("/admin-register", data);
  return response.data;
}

// ==========================================
// PASSWORD RESET API FUNCTIONS
// ==========================================

// 6. Send forgot password OTP
export async function forgotPassword(data: ForgotPasswordData): Promise<{ success: boolean; message: string }> {
  const response = await api.post<{ success: boolean; message: string }>("/forgot-password", data);
  return response.data;
}

// 7. Verify OTP code
export async function verifyOtp(data: VerifyOtpData): Promise<{ success: boolean; message: string }> {
  const response = await api.post<{ success: boolean; message: string }>("/verify-otp", data);
  return response.data;
}

// 8. Reset password with verified OTP
export async function resetPassword(data: ResetPasswordData): Promise<{ success: boolean; message: string }> {
  const response = await api.post<{ success: boolean; message: string }>("/reset-password", data);
  return response.data;
}

// 9. Logout endpoint (server-side notification)
export async function logoutUserServer(): Promise<{ success: boolean; message: string }> {
  const response = await api.post<{ success: boolean; message: string }>("/logout");
  return response.data;
}

// 10. Change password for authenticated user
export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export async function changePassword(data: ChangePasswordData): Promise<{ success: boolean; message: string }> {
  const response = await api.post<{ success: boolean; message: string }>("/change-password", data);
  return response.data;
}
