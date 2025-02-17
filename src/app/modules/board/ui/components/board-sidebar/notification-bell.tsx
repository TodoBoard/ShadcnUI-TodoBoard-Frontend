"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import Link from "next/link";

interface NotificationBellProps {
  count: number;
}

export function NotificationBell({ count }: NotificationBellProps) {
  return (
    <Link href="/board/notifications">
      <Button
        variant="outline"
        size="icon"
        className="relative h-8 w-8 shadow-none rounded-xl"
        aria-label="Notifications"
      >
        <Bell size={14} strokeWidth={2} aria-hidden="true" />
        {count > 0 && (
          <Badge className="absolute -top-2 left-full min-w-4 -translate-x-1/2 px-1 text-xs rounded-full h-4 flex items-center justify-center">
            {count > 99 ? "99+" : count}
          </Badge>
        )}
      </Button>
    </Link>
  );
}
