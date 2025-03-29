"use client";

import * as React from "react";
import { CalendarCheck2 } from "lucide-react";
import { NotificationBell } from "./notification-bell";
import Link from "next/link";

import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";

interface NavLogoProps {
  notificationCount: number;
}

export function NavLogo({ notificationCount }: NavLogoProps) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex w-full items-center justify-between px-2 mt-2">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <CalendarCheck2 className="size-4" />
            </div>
            <div className="flex flex-col gap-0.5 leading-none">
              <span className="font-semibold text-md">TodoBoard</span>
            </div>
          </Link>
          <NotificationBell count={notificationCount} />
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
