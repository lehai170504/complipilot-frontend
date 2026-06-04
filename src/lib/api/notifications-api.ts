import { apiClient } from "@/lib/api/api-client";
import type {
  NotificationResponse,
  PageResponse,
  UnreadNotificationCountResponse,
} from "@/lib/api/api-types";

export function listNotifications(
  organizationId: string,
  page = 0,
  size = 10,
): Promise<PageResponse<NotificationResponse>> {
  const searchParams = new URLSearchParams({
    page: String(page),
    size: String(size),
  });

  return apiClient<PageResponse<NotificationResponse>>(
    `/api/v1/organizations/${organizationId}/notifications?${searchParams.toString()}`,
  );
}

export function countUnreadNotifications(
  organizationId: string,
): Promise<UnreadNotificationCountResponse> {
  return apiClient<UnreadNotificationCountResponse>(
    `/api/v1/organizations/${organizationId}/notifications/unread-count`,
  );
}

export function markNotificationAsRead(
  organizationId: string,
  notificationId: string,
): Promise<NotificationResponse> {
  return apiClient<NotificationResponse>(
    `/api/v1/organizations/${organizationId}/notifications/${notificationId}/read`,
    {
      method: "PATCH",
    },
  );
}