"use client";

import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  unreadCount: number;
}

export function Header({ unreadCount }: HeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="font-bold text-2xl">Notifications</h1>
      {unreadCount > 0 && (
        <Badge
          className="bg-primary/10 hover:bg-primary/15 text-primary px-3 py-1 transition-colors duration-200"
          variant="secondary"
        >
          {unreadCount}{" "}
          {unreadCount === 1 ? "unread message" : "unread messages"}
        </Badge>
      )}
    </div>
  );
}
