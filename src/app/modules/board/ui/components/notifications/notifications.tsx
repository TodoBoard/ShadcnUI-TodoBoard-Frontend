"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Notification } from "@/models/notifications";
import { Notifications as NotificationsApi } from "@/lib/api";
import { formatDistanceToNow } from "date-fns";
import { CalendarCheck2, Check } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { TabsContent } from "@/components/ui/tabs";
import { NoNotifications } from "./no-notifications";
import { Skeleton } from "@/components/ui/skeleton";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { handleApiError } from "@/lib/api";
import { useNotificationsStore } from "@/store/notifications";

const SKELETON_COUNT = 3;

function NotificationSkeleton() {
  return (
    <div className="py-4">
      <div className="flex items-start gap-4">
        <Skeleton className="w-8 h-8 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-3 w-1/4" />
        </div>
      </div>
      <Separator className="mt-4" />
    </div>
  );
}

function NotificationItem({
  notification,
  showReadButton = true,
  onMarkAsRead,
}: {
  notification: Notification;
  showReadButton?: boolean;
  onMarkAsRead: (id: string) => void;
}) {
  return (
    <div className="py-4">
      <div className="flex items-start gap-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
          <CalendarCheck2 className="size-4 text-primary" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">{notification.title}</p>
          <p className="text-sm">{notification.description}</p>
          <span className="text-xs text-gray-500">
            {formatDistanceToNow(new Date(notification.created_at), {
              addSuffix: true,
            })}
          </span>
        </div>
        {showReadButton && !notification.read && (
          <button
            onClick={() => onMarkAsRead(notification.id)}
            className="p-2 text-gray-400 hover:text-purple-500 transition-colors"
          >
            <Check className="w-4 h-4" />
          </button>
        )}
      </div>
      <Separator className="mt-4" />
    </div>
  );
}

function NotificationList({
  notifications,
  showReadButton,
  onMarkAsRead,
}: {
  notifications: Notification[];
  showReadButton: boolean;
  onMarkAsRead: (id: string) => void;
}) {
  if (notifications.length === 0) {
    return <NoNotifications />;
  }

  return (
    <div className="space-y-1">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          showReadButton={showReadButton}
          onMarkAsRead={onMarkAsRead}
        />
      ))}
    </div>
  );
}

export function NotificationsList() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const {
    notifications,
    setNotifications,
    setUnreadCount,
    markNotificationRead,
    markAllRead,
  } = useNotificationsStore();

  const unreadNotifications = notifications.filter((n) => !n.read);
  const readNotifications = notifications.filter((n) => n.read);

  const handleMarkAllAsRead = async () => {
    if (unreadNotifications.length === 0) return;
    try {
      const response = await NotificationsApi.markAllAsRead();
      markAllRead();
      setUnreadCount(response.unread_notifications_count);
      setError(null);
    } catch (error) {
      setError(handleApiError(error));
    }
  };

  const loadNotifications = useCallback(async () => {
    try {
      const data = await NotificationsApi.getAll();
      setNotifications(data);
      setError(null);
    } catch (error) {
      setError(handleApiError(error));
    } finally {
      setIsLoading(false);
    }
  }, [setNotifications, setError, setIsLoading]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const response = await NotificationsApi.markAsRead(notificationId);
      markNotificationRead(notificationId);
      setUnreadCount(response.unread_notifications_count);
      setError(null);
    } catch (error) {
      setError(handleApiError(error));
    }
  };

  if (error) {
    return <LoadingOverlay error={true} errorMessage={error} />;
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
          <NotificationSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (notifications.length === 0) {
    return <NoNotifications />;
  }

  return (
    <div className="relative">
      {unreadNotifications.length > 0 && (
        <Button
          variant="secondary"
          size="sm"
          onClick={handleMarkAllAsRead}
          // Push up to align with the unread/read navbar above this list
          className="absolute right-0 -top-10 z-10"
        >
          Mark all as read
        </Button>
      )}
      <TabsContent value="unread" className="mt-6">
        <NotificationList
          notifications={unreadNotifications}
          showReadButton={true}
          onMarkAsRead={handleMarkAsRead}
        />
      </TabsContent>

      <TabsContent value="read" className="mt-4">
        <NotificationList
          notifications={readNotifications}
          showReadButton={false}
          onMarkAsRead={handleMarkAsRead}
        />
      </TabsContent>
    </div>
  );
}
