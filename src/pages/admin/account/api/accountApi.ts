import api from "@/api/axios";

export async function getAccounts(params?: { search?: string; tab?: string; status?: string; page?: number; limit?: number }) {
  const response = await api.get("/admin/accounts", { params });
  return response.data;
}

export async function getAccountById(id: string | number) {
  const response = await api.get(`/admin/accounts/${id}`);
  return response.data;
}

export async function updateAccount(id: string | number, data: any) {
  const response = await api.patch(`/admin/accounts/${id}`, data);
  return response.data;
}

export async function updateAccountStatus(id: string | number, status: string) {
  const response = await api.patch(`/admin/accounts/${id}/status`, { status });
  return response.data;
}
