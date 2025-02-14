"use client";

import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Bell, Check, BellDot } from "lucide-react";
import { useState } from "react";

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState("unread");
  const unreadCount = 2;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-2xl">Notifications</h1>
        <Badge className="bg-primary/15 px-2" variant="secondary">
          {unreadCount} unread
        </Badge>
      </div>

      <div className="mt-6">
        <Tabs
          defaultValue="unread"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <ScrollArea>
            <TabsList className="mb-3">
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

          <TabsContent value="unread" className="mt-4">
            <div className="space-y-1">
              {/* Here you can map through unread notifications */}
              <div className="py-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8">
                    <img
                      src="/board/user/picture/1.png"
                      alt="User"
                      className="w-full h-full rounded-full"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-medium">John Doe</span> assigned you
                      to the task "Prepare travel documents"
                    </p>
                    <span className="text-xs text-gray-500">2 hours ago</span>
                  </div>
                  <button className="p-2 text-gray-400 hover:text-purple-500 transition-colors">
                    <Check className="w-4 h-4" />
                  </button>
                </div>
                <Separator className="mt-4" />
              </div>

              <div className="py-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8">
                    <img
                      src="/board/user/picture/2.png"
                      alt="User"
                      className="w-full h-full rounded-full"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-medium">Jane Smith</span> commented
                      on "Book flight tickets"
                    </p>
                    <span className="text-xs text-gray-500">5 hours ago</span>
                  </div>
                  <button className="p-2 text-gray-400 hover:text-purple-500 transition-colors">
                    <Check className="w-4 h-4" />
                  </button>
                </div>
                <Separator className="mt-4" />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="read" className="mt-4">
            <div className="space-y-1">
              {/* Here you can map through read notifications */}
              <div className="py-4">
                <div className="flex items-start gap-4 opacity-60">
                  <div className="w-8 h-8">
                    <img
                      src="/board/user/picture/3.png"
                      alt="User"
                      className="w-full h-full rounded-full"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-medium">Mike Johnson</span>{" "}
                      completed the task "Reserve hotel rooms"
                    </p>
                    <span className="text-xs text-gray-500">1 day ago</span>
                  </div>
                </div>
                <Separator className="mt-4" />
              </div>

              <div className="py-4">
                <div className="flex items-start gap-4 opacity-60">
                  <div className="w-8 h-8">
                    <img
                      src="/board/user/picture/4.png"
                      alt="User"
                      className="w-full h-full rounded-full"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-medium">Sarah Wilson</span>{" "}
                      mentioned you in a comment
                    </p>
                    <span className="text-xs text-gray-500">2 days ago</span>
                  </div>
                </div>
                <Separator className="mt-4" />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
