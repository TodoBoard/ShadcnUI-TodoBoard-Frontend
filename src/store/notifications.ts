import { create } from "zustand";

interface NotificationsStore {
  unreadCount: number;
  setUnreadCount: (count: number) => void;
}

export const useNotificationsStore = create<NotificationsStore>((set) => ({
  unreadCount: 0,
  setUnreadCount: (count) => set({ unreadCount: count }),
})); 