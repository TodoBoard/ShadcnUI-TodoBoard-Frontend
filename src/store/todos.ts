import { create } from "zustand";
import { Todo, TodoCreate, TodoUpdateSchema } from "@/models/todos";
import { Todos } from "@/lib/api";
import { useProjectsStore } from "@/store/projects";

type ErrorType = "NOT_FOUND" | "OTHER" | null;

interface TodosStore {
  todos: Todo[];
  loading: boolean;
  error: ErrorType;
  errorMessage?: string;
  selectedProjectId: string | undefined;
  setSelectedProjectId: (id: string) => void;
  fetchTodos: (projectId: string) => Promise<void>;
  createTodo: (todo: TodoCreate) => Promise<void>;
  updateTodo: (todoId: string, todo: TodoUpdateSchema) => Promise<void>;
  deleteTodo: (todoId: string) => Promise<void>;
  getProjectTodos: (projectId: string) => Todo[];
  fetchAllTodos: () => Promise<void>;
}

export const useTodosStore = create<TodosStore>((set, get) => ({
  todos: [],
  loading: true,
  error: null,
  errorMessage: undefined,
  selectedProjectId: undefined,
  setSelectedProjectId: (id: string) => set({ selectedProjectId: id }),

  fetchTodos: async (projectId: string) => {
    set({ loading: true, error: null, errorMessage: undefined });
    try {
      const response = await Todos.getProjectTodos(projectId);
      set({
        todos: response.todos,
        loading: false,
      });
    } catch (error) {
      const errorMessage =
        typeof error === "string" ? error : "Failed to fetch todos";
      set({ error: "OTHER", errorMessage, loading: false });
    }
  },

  getProjectTodos: (projectId: string) => {
    return get().todos.filter((todo) => todo.project_id === projectId);
  },

  createTodo: async (todo: TodoCreate) => {
    try {
      const newTodo = await Todos.createTodo(todo);
      set((state) => ({
        todos:
          newTodo.project_id === get().selectedProjectId
            ? [...state.todos, newTodo]
            : state.todos,
      }));
    } catch (error) {
      const errorMessage =
        typeof error === "string" ? error : "Failed to create todo";
      set({ error: "OTHER", errorMessage });
    }
  },

  updateTodo: async (todoId: string, todo: TodoUpdateSchema) => {
    try {
      const updatedTodo = await Todos.updateTodo(todoId, todo);
      set((state) => ({
        todos: state.todos.map((t) =>
          t.id === todoId ? { ...t, ...updatedTodo } : t
        ),
      }));
    } catch (error) {
      const errorMessage =
        typeof error === "string" ? error : "Failed to update todo";
      set({ error: "OTHER", errorMessage });
    }
  },

  deleteTodo: async (todoId: string) => {
    try {
      await Todos.deleteTodo(todoId);
      set((state) => ({
        todos: state.todos.filter((t) => t.id !== todoId),
      }));
    } catch (error) {
      const errorMessage =
        typeof error === "string" ? error : "Failed to delete todo";
      set({ error: "OTHER", errorMessage });
    }
  },

  fetchAllTodos: async () => {
    set({ loading: true, error: null, errorMessage: undefined });
    try {
      const response = await Todos.getAllTodos();
      set({
        todos: response.todos,
        loading: false,
      });
    } catch (error) {
      const errorMessage =
        typeof error === "string" ? error : "Failed to fetch todos";
      set({ error: "OTHER", errorMessage, loading: false });
    }
  },
}));
