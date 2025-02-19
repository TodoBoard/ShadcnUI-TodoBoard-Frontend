export interface TeamMember {
  id: string;
  username: string;
  avatar_id: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  team_members: TeamMember[];
}

export interface ProjectListResponse {
  my_projects: Project[];
  invited_projects: Project[];
  unread_notifications_count: number;
}

export interface ProjectCreate {
  name: string;
}

export interface ProjectResponse {
  id: string;
  name: string;
  team_members: {
    id: string;
    username: string;
    avatar_id: number;
  }[];
}

export interface DeleteProjectRequest {
  totp_code?: string;
}

export interface DeleteProjectResponse {
  message: string;
}
