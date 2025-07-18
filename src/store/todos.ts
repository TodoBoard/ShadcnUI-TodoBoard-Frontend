import { create } from "zustand";
import { Todo, TodoCreate, TodoUpdateSchema } from "@/models/todos";
import { Todos } from "@/lib/api";

// Helper to keep todos sorted exactly like the backend (priority, assigned, due_date asc, updated_at desc)
const priorityRank: Record<string, number> = {
  high: 1,
  medium: 2,
  low: 3,
};

function compareTodos(a: Todo, b: Todo): number {
  // 1) Priority (high -> medium -> low -> none)
  const rankA = priorityRank[a.priority?.toLowerCase() as string] ?? 4;
  const rankB = priorityRank[b.priority?.toLowerCase() as string] ?? 4;
  if (rankA !== rankB) return rankA - rankB;

  // 2) Assigned comes first
  const assignedA = a.assigned_user_id ? 0 : 1;
  const assignedB = b.assigned_user_id ? 0 : 1;
  if (assignedA !== assignedB) return assignedA - assignedB;

  // 3) Due date ascending, nulls last
  if (a.due_date && b.due_date) {
    const diff = new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    if (diff !== 0) return diff;
  } else if (a.due_date && !b.due_date) {
    return -1;
  } else if (!a.due_date && b.due_date) {
    return 1;
  }

  // 4) Updated_at descending (more recent first)
  return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
}

function sortTodos(todos: Todo[]): Todo[] {
  return [...todos].sort(compareTodos);
}

type ErrorType = "NOT_FOUND" | "OTHER" | null;

interface TodosStore {
  todos: Todo[];
  loading: boolean;
  error: ErrorType;
  errorMessage?: string;
  selectedProjectId: string | undefined;
  setSelectedProjectId: (id: string) => void;
  fetchTodos: (projectId: string, assignedOnly?: boolean) => Promise<void>;
  createTodo: (todo: TodoCreate) => Promise<void>;
  updateTodo: (todoId: string, todo: TodoUpdateSchema) => Promise<void>;
  deleteTodo: (todoId: string) => Promise<void>;
  getProjectTodos: (projectId: string) => Todo[];
  fetchAllTodos: (assignedOnly?: boolean) => Promise<void>;
  silentlyRefreshTodos: (projectId: string) => Promise<void>;
  upsertTodo: (todo: Todo) => void;
  removeTodo: (id: string) => void;
}

export const useTodosStore = create<TodosStore>((set, get) => ({
  todos: [],
  loading: true,
  error: null,
  errorMessage: undefined,
  selectedProjectId: undefined,
  setSelectedProjectId: (id: string) => set({ selectedProjectId: id }),

  fetchTodos: async (projectId: string, assignedOnly: boolean = false) => {
    set({ loading: true, error: null, errorMessage: undefined });
    try {
      const response = await Todos.getProjectTodos(projectId, assignedOnly);
      set({
        todos: sortTodos(response.todos),
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
      get().upsertTodo(newTodo);
    } catch (error) {
      const errorMessage =
        typeof error === "string" ? error : "Failed to create todo";
      set({ error: "OTHER", errorMessage });
    }
  },

  updateTodo: async (todoId: string, todo: TodoUpdateSchema) => {
    try {
      const updatedTodo = await Todos.updateTodo(todoId, todo);
      set((state) => {
        const newTodos = state.todos.map((t) =>
          t.id === todoId ? { ...t, ...updatedTodo } : t
        );
        return { todos: sortTodos(newTodos) };
      });
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

  fetchAllTodos: async (assignedOnly: boolean = false) => {
    set({ loading: true, error: null, errorMessage: undefined });
    try {
      const response = await Todos.getAllTodos(assignedOnly);
      set({
        todos: sortTodos(response.todos),
        loading: false,
      });
    } catch (error) {
      const errorMessage =
        typeof error === "string" ? error : "Failed to fetch todos";
      set({ error: "OTHER", errorMessage, loading: false });
    }
  },

  silentlyRefreshTodos: async (projectId: string) => {
    try {
      const response = await Todos.getProjectTodos(projectId);
      set((state) => ({
        todos: sortTodos(
          state.todos
            .map((todo) => {
              const updated = response.todos.find((t) => t.id === todo.id);
              return updated || todo;
            })
            .concat(
              response.todos.filter(
                (newTodo) => !state.todos.some((t) => t.id === newTodo.id)
              )
            )
        ),
      }));
    } catch (error) {
      const errorMessage =
        typeof error === "string" ? error : "Failed to fetch todos";
      set({ error: "OTHER", errorMessage, loading: false });
    }
  },
  removeTodo: (id: string) => {
    set((state) => ({ todos: state.todos.filter((t) => t.id !== id) }));
  },
  upsertTodo: (todo: Todo) => {
    set((state) => {
      const index = state.todos.findIndex((t) => t.id === todo.id);
      let newTodos: Todo[];
      if (index !== -1) {
        newTodos = [...state.todos];
        newTodos[index] = { ...newTodos[index], ...todo };
      } else {
        newTodos = [...state.todos, todo];
      }
      return { todos: sortTodos(newTodos) };
    });
  },
}));

