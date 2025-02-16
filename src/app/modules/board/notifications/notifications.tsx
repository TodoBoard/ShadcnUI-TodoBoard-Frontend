"use client";

import { useState, useEffect } from "react";
import { Notification } from "@/models/notifications";
import { Notifications as NotificationsApi } from "@/lib/api";
import { formatDistanceToNow } from "date-fns";
import { Check } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { TabsContent } from "@/components/ui/tabs";
import { NoNotifications } from "./no-notifications";
import { Skeleton } from "@/components/ui/skeleton";

export function NotificationsList() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const unreadNotifications = notifications.filter((n) => !n.read);
  const readNotifications = notifications.filter((n) => n.read);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const data = await NotificationsApi.getAll();
      setNotifications(data);
    } catch (error) {
      console.error("Failed to load notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await NotificationsApi.markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const renderNotification = (
    notification: Notification,
    showReadButton = true
  ) => (
    <div key={notification.id} className="py-4">
      <div className="flex items-start gap-4">
        <div className="w-8 h-8">
          <img
            src={`/user/avatar/1.png`}
            alt="User"
            className="w-full h-full rounded-full"
          />
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
            onClick={() => handleMarkAsRead(notification.id)}
            className="p-2 text-gray-400 hover:text-purple-500 transition-colors"
          >
            <Check className="w-4 h-4" />
          </button>
        )}
      </div>
      <Separator className="mt-4" />
    </div>
  );

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-start gap-4">
            <Skeleton className="w-8 h-8 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const hasNoNotifications = notifications.length === 0;

  if (hasNoNotifications) {
    return <NoNotifications />;
  }

  return (
    <>
      <TabsContent value="unread" className="mt-4">
        <div className="space-y-1">
          {unreadNotifications.length === 0 ? (
            <NoNotifications />
          ) : (
            unreadNotifications.map((notification) =>
              renderNotification(notification)
            )
          )}
        </div>
      </TabsContent>

      <TabsContent value="read" className="mt-4">
        <div className="space-y-1">
          {readNotifications.length === 0 ? (
            <NoNotifications />
          ) : (
            readNotifications.map((notification) =>
              renderNotification(notification, false)
            )
          )}
        </div>
      </TabsContent>
    </>
  );
}
