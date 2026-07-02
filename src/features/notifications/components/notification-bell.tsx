"use client";

import { Bell, CheckCheck } from "lucide-react";

import { ErrorAlert } from "@/components/feedback/error-alert";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useMarkNotificationAsReadMutation,
  useNotificationsQuery,
  useUnreadNotificationCountQuery,
} from "@/features/notifications/hooks/notification-hooks";
import type { NotificationResponse } from "@/lib/api/api-types";

function formatRelativeTime(value: string) {
  const date = new Date(value);
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60_000);

  if (diffMinutes < 1) {
    return "Just now";
  }

  if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);

  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }

  const diffDays = Math.floor(diffHours / 24);

  if (diffDays < 7) {
    return `${diffDays}d ago`;
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(date);
}

function getNotificationTone(notification: NotificationResponse) {
  if (notification.read) {
    return "bg-background";
  }

  return "bg-primary/5";
}

export function NotificationBell({
  organizationId,
}: {
  organizationId: string | undefined;
}) {
  const notificationsQuery = useNotificationsQuery(organizationId);
  const unreadCountQuery = useUnreadNotificationCountQuery(organizationId);
  const markAsReadMutation = useMarkNotificationAsReadMutation(organizationId);

  const notifications = notificationsQuery.data?.items ?? [];
  const unreadCount = unreadCountQuery.data?.unreadCount ?? 0;

  function handleMarkAsRead(notification: NotificationResponse) {
    if (notification.read) {
      return;
    }

    markAsReadMutation.mutate(notification.id);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          size="icon"
          variant="outline"
          className="relative rounded-full"
        >
          <Bell className="size-4" />

          {unreadCount > 0 ? (
            <span className="absolute -right-1 -top-1 flex min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-semibold text-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          ) : null}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[360px] p-0">
        <div className="border-b p-4">
          <DropdownMenuLabel className="p-0 text-base">
            Notifications
          </DropdownMenuLabel>
          <p className="mt-1 text-xs text-muted-foreground">
            Recent workspace activity and updates.
          </p>
        </div>

        {notificationsQuery.error ? (
          <div className="p-4">
            <ErrorAlert error={notificationsQuery.error} />
          </div>
        ) : notificationsQuery.isLoading ? (
          <div className="p-4 text-sm text-muted-foreground">
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center">
            <div className="mx-auto flex size-11 items-center justify-center rounded-2xl bg-background text-primary">
              <Bell className="size-5" />
            </div>
            <p className="mt-3 text-sm font-medium">No notifications yet</p>
            <p className="mt-1 text-xs text-muted-foreground">
              You will see workspace updates here.
            </p>
          </div>
        ) : (
          <div className="max-h-[420px] overflow-y-auto">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`border-b p-4 last:border-b-0 ${getNotificationTone(
                  notification,
                )}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      {!notification.read ? (
                        <span className="size-2 shrink-0 rounded-full bg-cyan-600" />
                      ) : null}

                      <p className="truncate text-sm font-semibold">
                        {notification.title}
                      </p>
                    </div>

                    <p className="mt-1 text-sm leading-5 text-muted-foreground">
                      {notification.message}
                    </p>

                    <p className="mt-2 text-xs text-muted-foreground">
                      {formatRelativeTime(notification.createdAt)}
                    </p>
                  </div>

                  {!notification.read ? (
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="size-8 shrink-0"
                      disabled={markAsReadMutation.isPending}
                      onClick={() => handleMarkAsRead(notification)}
                    >
                      <CheckCheck className="size-4" />
                    </Button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
