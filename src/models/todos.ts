export interface Todo {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  due_date: string | null;
  created_at: string;
  updated_at: string;
  finished_at: string | null;
  username: string;
  avatar_id: number;
  project_id: string;
}

export interface TodoListResponse {
  todos: Todo[];
}

export interface TodoCreate {
  title: string;
  description: string;
  priority: string;
  due_date?: string;
  project_id: string;
}

export interface TodoUpdateSchema {
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  due_date?: string;
}

export interface TodoResponse extends Todo {
  message?: string;
}
