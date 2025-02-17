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
