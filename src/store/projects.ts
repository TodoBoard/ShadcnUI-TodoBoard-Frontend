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
}

export const useProjectsStore = create<ProjectsStore>((set) => ({
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
}));
