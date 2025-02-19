import { NotificationsClient } from "@/app/modules/board/notifications/notifications-client";

export default function NotificationsPage() {
  return (
    <div className="space-y-6 pb-4 pt-2">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-2xl">Notifications</h1>
      </div>
      <NotificationsClient />
    </div>
  );
}
