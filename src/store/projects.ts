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
  updateProjectSorting: (projectIds: string[]) => Promise<void>;
  updateLocalProjectSorting: (
    projectIds: string[],
    type: "my" | "invited"
  ) => void;
  upsertProject: (project: Project, type: "my" | "invited") => void;
  removeProject: (id: string) => void;
  addMember: (projectId: string, member: { id: string; username: string; avatar_id: number }) => void;
  removeMember: (projectId: string, userId: string) => void;
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
  updateProjectSorting: async (projectIds: string[]) => {
    try {
      await Projects.updateProjectSorting(projectIds);
    } catch (error) {
      const errorMessage =
        typeof error === "string" ? error : "Failed to update project sorting";
      set({ error: true, errorMessage });
      await get().fetchProjects();
    }
  },
  updateLocalProjectSorting: (projectIds: string[], type: "my" | "invited") => {
    const currentProjects =
      type === "my" ? [...get().myProjects] : [...get().invitedProjects];

    const sortedProjects = projectIds
      .map((id) => currentProjects.find((p) => p.id === id))
      .filter((p): p is Project => p !== undefined);

    set(
      type === "my"
        ? { myProjects: sortedProjects }
        : { invitedProjects: sortedProjects }
    );
  },
  removeProject: (id: string) => {
    set((state) => ({
      myProjects: state.myProjects.filter((p) => p.id !== id),
      invitedProjects: state.invitedProjects.filter((p) => p.id !== id),
    }));
  },
  upsertProject: (project: Project, type: "my" | "invited") => {
    set((state) => {
      const list = type === "my" ? state.myProjects : state.invitedProjects;
      const index = list.findIndex((p) => p.id === project.id);
      if (index !== -1) {
        const newList = [...list];
        newList[index] = { ...newList[index], ...project };
        return type === "my" ? { myProjects: newList } : { invitedProjects: newList };
      }
      return type === "my"
        ? { myProjects: [...list, project] }
        : { invitedProjects: [...list, project] };
    });
  },
  addMember: (projectId, member) => {
    set((state) => {
      const updateList = (projects: Project[]) =>
        projects.map((p) =>
          p.id === projectId ? { ...p, team_members: [...p.team_members, member] } : p
        );
      return {
        myProjects: updateList(state.myProjects),
        invitedProjects: updateList(state.invitedProjects),
      };
    });
  },
  removeMember: (projectId, userId) => {
    set((state) => {
      const updateList = (projects: Project[]) =>
        projects.map((p) =>
          p.id === projectId
            ? { ...p, team_members: p.team_members.filter((m) => m.id !== userId) }
            : p
        );
      return {
        myProjects: updateList(state.myProjects),
        invitedProjects: updateList(state.invitedProjects),
      };
    });
  },
}));
