"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, BellDot } from "lucide-react";
import { useState } from "react";
import { Header } from "@/app/modules/board/notifications/header";
import { NotificationsList } from "@/app/modules/board/notifications/notifications";

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState("unread");
  const [unreadCount, setUnreadCount] = useState(0);

  return (
    <div className="space-y-6 pb-4 pt-2">
      <Header unreadCount={unreadCount} />
      <Tabs
        defaultValue="unread"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <ScrollArea>
          <TabsList className="mb-4">
            <TabsTrigger value="unread" className="group">
              <BellDot
                className="-ms-0.5 me-1.5 opacity-60"
                size={16}
                strokeWidth={2}
                aria-hidden="true"
              />
              Unread
            </TabsTrigger>
            <TabsTrigger value="read" className="group">
              <Bell
                className="-ms-0.5 me-1.5 opacity-60"
                size={16}
                strokeWidth={2}
                aria-hidden="true"
              />
              Read
            </TabsTrigger>
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <NotificationsList onUnreadCountChange={setUnreadCount} />
      </Tabs>
    </div>
  );
}
