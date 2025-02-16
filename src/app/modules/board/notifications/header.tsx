"use client";

import { Badge } from "@/components/ui/badge";
import { Notification } from "@/models/notifications";

interface HeaderProps {
  notifications?: Notification[];
}

export function Header({ notifications = [] }: HeaderProps) {
  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  return (
    <div className="flex items-center justify-between">
      <h1 className="font-bold text-2xl">Notifications</h1>
      <Badge className="bg-primary/15 px-2" variant="secondary">
        {unreadCount} unread
      </Badge>
    </div>
  );
}
