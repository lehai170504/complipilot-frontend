import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  countUnreadNotifications,
  listNotifications,
  markNotificationAsRead,
} from "@/lib/api/notifications-api";

export function useNotificationsQuery(organizationId: string | undefined) {
  return useQuery({
    queryKey: ["notifications", organizationId],
    queryFn: () => listNotifications(organizationId!, 0, 10),
    enabled: Boolean(organizationId),
    refetchInterval: 60_000,
  });
}

export function useUnreadNotificationCountQuery(
  organizationId: string | undefined,
) {
  return useQuery({
    queryKey: ["notifications-unread-count", organizationId],
    queryFn: () => countUnreadNotifications(organizationId!),
    enabled: Boolean(organizationId),
    refetchInterval: 30_000,
  });
}

export function useMarkNotificationAsReadMutation(
  organizationId: string | undefined,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) =>
      markNotificationAsRead(organizationId!, notificationId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["notifications", organizationId],
      });

      void queryClient.invalidateQueries({
        queryKey: ["notifications-unread-count", organizationId],
      });
    },
  });
}