import api from "./axios";

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  type: "alert" | "update" | "warning";
  read: boolean;
  link?: string | null;
}

export interface NotificationsResponse {
  success: boolean;
  notifications: NotificationItem[];
  unreadCount: number;
  totalCount: number;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface NotificationsParams {
  search?: string;
  tab?: "all" | "unread" | "alerts" | "updates";
  page?: number;
  limit?: number;
}

/**
 * Fetch live notifications for admin
 */
export async function getAdminNotifications(
  params?: NotificationsParams
): Promise<NotificationsResponse> {
  const res = await api.get("/admin/notifications", { params });
  return res.data;
}

/**
 * Mark a single notification as read
 */
export async function markNotificationAsRead(
  id: string | number
): Promise<{ success: boolean; unreadCount: number }> {
  const res = await api.patch(`/admin/notifications/${id}/read`);
  return res.data;
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsAsRead(): Promise<{ success: boolean; unreadCount: number }> {
  const res = await api.patch("/admin/notifications/mark-all-read");
  return res.data;
}

/**
 * Delete a notification
 */
export async function deleteNotification(
  id: string | number
): Promise<{ success: boolean; unreadCount: number }> {
  const res = await api.delete(`/admin/notifications/${id}`);
  return res.data;
}

/**
 * Fetch live notifications for guard
 */
export async function getGuardNotifications(
  params?: NotificationsParams
): Promise<NotificationsResponse> {
  const res = await api.get("/guard/notifications", { params });
  return res.data;
}

/**
 * Mark a guard notification as read
 */
export async function markGuardNotificationAsRead(
  id: string | number
): Promise<{ success: boolean; unreadCount: number }> {
  const res = await api.patch(`/guard/notifications/${id}/read`);
  return res.data;
}

/**
 * Mark all guard notifications as read
 */
export async function markAllGuardNotificationsAsRead(): Promise<{ success: boolean; unreadCount: number }> {
  const res = await api.patch("/guard/notifications/mark-all-read");
  return res.data;
}
