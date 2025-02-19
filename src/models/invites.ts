export interface InviteCreate {
  duration: string;
  max_usage: number;
}

export interface InviteResponse {
  id: string;
  project_id: string;
  expires_at: string;
  max_usage: number;
  usage_count: number;
  active: boolean;
}

export interface InviteDetails extends InviteResponse {
  project_name: string;
  invite_creator_username: string;
  invite_creator_avatar_id: number;
}
