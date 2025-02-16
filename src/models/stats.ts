export interface TeamMember {
  id: string;
  username: string;
  avatar_id: number;
}

export interface Project {
  id: string;
  name: string;
  team_members: TeamMember[];
  open_tasks: number;
  total_tasks: number;
  percentage: number;
}

export interface ProjectStatisticsResponse {
  my_projects: Project[];
  invited_projects: Project[];
}
