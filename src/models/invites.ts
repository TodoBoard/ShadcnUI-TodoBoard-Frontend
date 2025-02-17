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
