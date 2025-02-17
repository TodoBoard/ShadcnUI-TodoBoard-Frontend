export interface Notification {
  id: string;
  title: string;
  description: string;
  created_at: string;
  read: boolean;
  project_id: string;
}

export interface MarkAsReadResponse {
  message: string;
  unread_notifications_count: number;
}
