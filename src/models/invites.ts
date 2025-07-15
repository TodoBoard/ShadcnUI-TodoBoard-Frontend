export interface InviteCreate {
  /** Duration string like '24h', '7d'. Omit or set to 'never' for unlimited. */
  duration?: string;
  /** Max usage count; 0 or undefined means unlimited */
  max_usage?: number;
}

export interface InviteResponse {
  id: string;
  project_id: string;
  expires_at: string;
  max_usage: number | null;
  usage_count: number;
  active: boolean;
}

export interface InviteDetails extends InviteResponse {
  project_name: string;
  invite_creator_username: string;
  invite_creator_avatar_id: number;
}
