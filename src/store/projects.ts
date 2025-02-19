import { create } from "zustand";
import { Project } from "@/models/projects";
import { Projects, handleApiError } from "@/lib/api";
import { useNotificationsStore } from "@/store/notifications";

interface TeamMember {
  id: string;
  username: string;
  avatar_id: number;
}

interface ProjectsStore {
  myProjects: Project[];
  invitedProjects: Project[];
  loading: boolean;
  error: boolean;
  errorMessage?: string;
  fetchProjects: () => Promise<void>;
  leaveProject: (projectId: string) => Promise<void>;
  renameProject: (projectId: string, newName: string) => Promise<void>;
  deleteProject: (projectId: string, totpCode?: string) => Promise<void>;
  getCurrentProjectTeam: (projectId: string) => TeamMember[];
}

export const useProjectsStore = create<ProjectsStore>((set, get) => ({
  myProjects: [],
  invitedProjects: [],
  loading: true,
  error: false,
  errorMessage: undefined,
  fetchProjects: async () => {
    set({ error: false, errorMessage: undefined });
    try {
      const data = await Projects.getProjects();
      const { my_projects, invited_projects, unread_notifications_count } =
        data;
      set({
        myProjects: my_projects,
        invitedProjects: invited_projects,
        loading: false,
      });
      useNotificationsStore
        .getState()
        .setUnreadCount(unread_notifications_count);
    } catch (error) {
      const errorMessage = handleApiError(error);
      set({ error: true, errorMessage, loading: false });
    }
  },
  leaveProject: async (projectId: string) => {
    try {
      await Projects.leaveProject(projectId);
      set((state) => ({
        invitedProjects: state.invitedProjects.filter(
          (project) => project.id !== projectId
        ),
      }));
    } catch (error) {
      const errorMessage = handleApiError(error);
      set({ error: true, errorMessage });
    }
  },
  renameProject: async (projectId: string, newName: string) => {
    try {
      await Projects.updateProject(projectId, { name: newName });
      set((state) => ({
        myProjects: state.myProjects.map((project) =>
          project.id === projectId ? { ...project, name: newName } : project
        ),
      }));
    } catch (error) {
      const errorMessage = handleApiError(error);
      set({ error: true, errorMessage });
    }
  },
  deleteProject: async (projectId: string, totpCode?: string) => {
    try {
      await Projects.deleteProject(projectId, totpCode);
      set((state) => ({
        myProjects: state.myProjects.filter(
          (project) => project.id !== projectId
        ),
      }));
    } catch (error) {
      const errorMessage = handleApiError(error);
      set({ error: true, errorMessage });
    }
  },
  getCurrentProjectTeam: (projectId: string) => {
    const project = [...get().myProjects, ...get().invitedProjects].find(
      (p) => p.id === projectId
    );
    return project?.team_members || [];
  },
}));
