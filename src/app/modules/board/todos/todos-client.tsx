"use client";

import { useEffect, useState } from "react";
import { useTodosStore } from "@/store/todos";
import { TaskItem } from "@/app/modules/board/ui/components/projects/task-item";
import { TaskSkeletonList } from "@/app/modules/board/ui/components/projects/task-skeleton";
import { Todo } from "@/models/todos";
import { useTaskCompleteSound } from "@/hooks/use-task-complete-sound";
import { CompletedTasks } from "@/app/modules/board/ui/components/projects/completed-tasks";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ErrorState } from "@/app/modules/board/ui/components/projects/projects-error-state";

export function TodosClient() {
  const [username, setUsername] = useState<string>("");
  const [avatarId, setAvatarId] = useState<number | null>(null);
  const [showCompleted, setShowCompleted] = useState(false);
  const { todos, loading, error, fetchAllTodos, updateTodo, deleteTodo } =
    useTodosStore();
  const playTaskCompleteSound = useTaskCompleteSound();

  useEffect(() => {
    fetchAllTodos();

    const storedUsername = localStorage.getItem("username");
    const storedAvatarId = localStorage.getItem("avatar_id");
    if (storedUsername) setUsername(storedUsername);
    if (storedAvatarId) setAvatarId(parseInt(storedAvatarId));
  }, [fetchAllTodos]);

  const transformTodoToTask = (todo: Todo) => {
    const dueDate = todo.due_date ? new Date(todo.due_date) : undefined;
    const isCurrentUser = todo.username === username;
    return {
      id: todo.id,
      title: todo.title,
      description: todo.description,
      status: todo.status,
      priority: todo.priority,
      due_date: todo.due_date,
      dueDate: dueDate,
      dueTime: null,
      completed: todo.status === "done",
      creator: {
        name: isCurrentUser ? "You" : todo.username,
        avatar: todo.avatar_id 
          ? `/user/avatar/${todo.avatar_id}.png` 
          : "",
      },
    };
  };

  const toggleTaskComplete = async (todo: Todo) => {
    try {
      const newStatus = todo.status === "done" ? "todo" : "done";
      await updateTodo(todo.id, { status: newStatus });
      if (newStatus === "done") {
        playTaskCompleteSound();
      }
    } catch (error) {
      console.error("Failed to toggle task status:", error);
    }
  };

  const handleDeleteTask = async (todoId: string) => {
    try {
      await deleteTodo(todoId);
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const activeTodos = todos.filter((todo) => todo.status !== "done");
  const completedTodos = todos.filter((todo) => todo.status === "done");

  return (
    <div className="space-y-6 pb-4 pt-2">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-2xl">Todos</h1>
        <Avatar className="ring-2 ring-background w-8 h-8">
          <AvatarImage 
            src={avatarId ? `/user/avatar/${avatarId}.png` : undefined}
            alt={username}
          />
          <AvatarFallback>
            {username ? username.slice(0, 2).toUpperCase() : "U"}
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="space-y-2">
        {loading ? (
          <TaskSkeletonList />
        ) : error ? (
          <ErrorState
            title="404 Todos Not Found"
            message="Failed to load your todos. Please try again later."
          />
        ) : (
          <>
            {activeTodos.map((todo) => (
              <TaskItem
                key={todo.id}
                task={transformTodoToTask(todo)}
                toggleTaskComplete={() => toggleTaskComplete(todo)}
                onDelete={() => handleDeleteTask(todo.id)}
                disableEdit={true}
              />
            ))}

            {completedTodos.length > 0 && (
              <CompletedTasks
                showCompleted={showCompleted}
                setShowCompleted={setShowCompleted}
                completedTodos={completedTodos}
                transformTodoToTask={transformTodoToTask}
                toggleTaskComplete={toggleTaskComplete}
                handleDeleteTask={handleDeleteTask}
                disableEdit={true}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
