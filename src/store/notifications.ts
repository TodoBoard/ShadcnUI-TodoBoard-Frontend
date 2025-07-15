import { create } from "zustand";
import { Notification } from "@/models/notifications";

interface NotificationsStore {
  unreadCount: number;
  notifications: Notification[];
  // setters
  setUnreadCount: (count: number) => void;
  setNotifications: (notifications: Notification[]) => void;
  // mutations
  increment: () => void;
  addNotification: (notification: Notification) => void;
  markNotificationRead: (id: string) => void;
  markAllRead: () => void;
}

function sortByDateDesc(list: Notification[]): Notification[] {
  return [...list].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export const useNotificationsStore = create<NotificationsStore>((set) => ({
  unreadCount: 0,
  notifications: [],
  setUnreadCount: (count) => set({ unreadCount: count }),
  setNotifications: (notifications) =>
    set({
      notifications: sortByDateDesc(notifications),
      unreadCount: notifications.filter((n) => !n.read).length,
    }),
  increment: () => set((state) => ({ unreadCount: state.unreadCount + 1 })),
  addNotification: (notification) =>
    set((state) => ({
      notifications: sortByDateDesc([notification, ...state.notifications]),
      unreadCount: state.unreadCount + 1,
    })),
  markNotificationRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
      unreadCount: Math.max(state.unreadCount - 1, 0),
    })),
  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    })),
})); 