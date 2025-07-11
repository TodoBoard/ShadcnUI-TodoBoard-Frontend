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
  assigned_user_id?: string | null;
  assignee_username?: string | null;
  assignee_avatar_id?: number | null;
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
  assigned_user_id?: string | null;
}

export interface TodoUpdateSchema {
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  due_date?: string;
  assigned_user_id?: string | null;
}

export interface TodoResponse extends Todo {
  message?: string;
}
