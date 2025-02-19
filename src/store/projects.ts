import { create } from "zustand";
import { Project } from "@/models/projects";
import { Projects, handleApiError } from "@/lib/api";

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
      set({
        myProjects: data.my_projects,
        invitedProjects: data.invited_projects,
        loading: false,
      });
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
}));
