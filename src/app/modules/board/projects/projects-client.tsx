"use client";

import { useState, useRef, useEffect } from "react";
import { parseISO, format } from "date-fns";
import { Plus } from "lucide-react";
import { NoTasks } from "@/app/modules/board/ui/components/projects/no-tasks";
import { TaskForm } from "@/app/modules/board/ui/components/projects/task-form";
import { useProjectTitle } from "@/hooks/use-project-title";
import { useProjectId } from "@/hooks/use-project-id";
import { useTodosStore } from "@/store/todos";
import { Todo, TodoCreate, TodoUpdateSchema } from "@/models/todos";
import { useProjectsStore } from "@/store/projects";
import { TaskItem, Task } from "@/app/modules/board/ui/components/projects/task-item";
import { CompletedTasks } from "@/app/modules/board/ui/components/projects/completed-tasks";
import { useTaskCompleteSound } from "@/hooks/use-task-complete-sound";
import { ErrorState } from "@/app/modules/board/ui/components/projects/projects-error-state";
import { TaskSkeletonList } from "@/app/modules/board/ui/components/projects/task-skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TaskFormData {
  title: string;
  description: string;
  dueDate: Date | undefined;
  dueTime: string | null;
  priority: string | undefined;
}

export default function ProjectsClient() {
  const today = new Date();
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState<string | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [formData, setFormData] = useState<TaskFormData>({
    title: "",
    description: "",
    dueDate: undefined,
    dueTime: null,
    priority: undefined,
  });
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showCompleted, setShowCompleted] = useState(false);
  const playTaskCompleteSound = useTaskCompleteSound();
  const titleInputRef = useRef<HTMLInputElement>(null);
  const [username, setUsername] = useState<string>("");
  const [avatarId, setAvatarId] = useState<number | null>(null);

  const projectTitle = useProjectTitle();
  const projectId = useProjectId();
  const {
    todos,
    loading,
    error,
    fetchTodos,
    createTodo,
    updateTodo,
    deleteTodo,
    selectedProjectId,
    getProjectTodos,
  } = useTodosStore();
  const { getCurrentProjectTeam } = useProjectsStore();
  const teamMembers = getCurrentProjectTeam(projectId);

  // Filtere Todos für das aktuelle Projekt
  const currentProjectTodos = getProjectTodos(projectId);

  useEffect(() => {
    if (projectId) {
      fetchTodos(projectId);
    }
  }, [projectId, fetchTodos]);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedAvatarId = localStorage.getItem("avatar_id");
    if (storedUsername) {
      setUsername(storedUsername);
    }
    if (storedAvatarId) {
      setAvatarId(parseInt(storedAvatarId));
    }
  }, []);

  // Mock time slots data
  const timeSlots = [
    { time: "09:00", available: true },
    { time: "09:30", available: true },
    { time: "10:00", available: true },
    { time: "10:30", available: true },
    { time: "11:00", available: true },
    { time: "11:30", available: true },
    { time: "12:00", available: true },
    { time: "12:30", available: true },
    { time: "13:00", available: true },
    { time: "13:30", available: true },
    { time: "14:00", available: true },
    { time: "14:30", available: true },
    { time: "15:00", available: true },
    { time: "15:30", available: true },
    { time: "16:00", available: true },
    { time: "16:30", available: true },
    { time: "17:00", available: true },
    { time: "17:30", available: true },
    { time: "18:00", available: true },
    { time: "18:30", available: true },
    { time: "19:00", available: true },
    { time: "19:30", available: true },
    { time: "20:00", available: true },
    { time: "20:30", available: true },
    { time: "21:00", available: true },
    { time: "21:30", available: true },
    { time: "22:00", available: true },
    { time: "22:30", available: true },
    { time: "23:00", available: true },
    { time: "23:30", available: true },
    { time: "00:00", available: true },
  ];

  const initialFormData: TaskFormData = {
    title: "",
    description: "",
    dueDate: undefined,
    dueTime: null,
    priority: undefined,
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setDate(undefined);
    setTime(null);
  };

  const focusTitleInput = () => {
    setTimeout(() => titleInputRef.current?.focus(), 0);
  };

  const transformTodoToTask = (todo: Todo) => {
    const dueDate = todo.due_date ? new Date(todo.due_date) : undefined;
    const isCurrentUser = todo.username === username || !todo.username;
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
          : avatarId
          ? `/user/avatar/${avatarId}.png`
          : "/user/avatar/default.png",
      },
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !projectId) return;

    try {
      const todoData: Partial<TodoCreate> = {
        title: formData.title.trim(),
        project_id: selectedProjectId || projectId,
      };

      if (formData.description?.trim()) {
        todoData.description = formData.description.trim();
      }

      if (formData.priority) {
        todoData.priority = formData.priority;
      }

      if (formData.dueDate) {
        const date = new Date(formData.dueDate);
        if (formData.dueTime) {
          const [hours, minutes] = formData.dueTime.split(":");
          date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        } else {
          date.setHours(0, 0, 0, 0);
        }
        todoData.due_date = date.toISOString();
      }

      if (editingTask) {
        const updateData: Partial<TodoUpdateSchema> = {
          title: formData.title.trim(),
        };

        if (formData.description?.trim()) {
          updateData.description = formData.description.trim();
        }

        if (formData.priority) {
          updateData.priority = formData.priority;
        }

        if (formData.dueDate) {
          updateData.due_date = formData.dueDate.toISOString();
        }

        await updateTodo(editingTask.id, updateData);
        setEditingTask(null);
      } else {
        await createTodo(todoData as TodoCreate);
      }

      resetForm();

      if (!editingTask) {
        focusTitleInput();
      } else {
        setIsFormVisible(false);
      }
    } catch (error) {
    }
  };

  const handleEditTask = (todo: Todo) => {
    const dueDate = todo.due_date ? parseISO(todo.due_date) : undefined;
    const dueTime =
      dueDate && format(dueDate, "HH:mm") !== "00:00"
        ? format(dueDate, "HH:mm")
        : null;

    setEditingTask({
      id: todo.id,
      title: todo.title,
      description: todo.description,
      status: todo.status,
      priority: todo.priority,
      due_date: todo.due_date,
      dueDate: dueDate,
      dueTime: dueTime,
      completed: todo.status === "done",
      creator: {
        name: todo.username === username ? "You" : todo.username,
        avatar: todo.avatar_id
          ? `/user/avatar/${todo.avatar_id}.png`
          : avatarId
          ? `/user/avatar/${avatarId}.png`
          : "/user/avatar/default.png",
      },
    });

    setFormData({
      title: todo.title,
      description: todo.description,
      dueDate: dueDate,
      dueTime: dueTime,
      priority: todo.priority,
    });
    setIsFormVisible(true);
    setTimeout(() => titleInputRef.current?.focus(), 0);
  };

  const handleDeleteTask = async (todoId: string) => {
    try {
      await deleteTodo(todoId);
    } catch (error) {
    }
  };

  const toggleTaskComplete = async (todo: Todo) => {
    try {
      const newStatus = todo.status === "done" ? "todo" : "done";
      await updateTodo(todo.id, { status: newStatus });

      if (newStatus === "done") {
        playTaskCompleteSound();
      }
    } catch (error) {
    }
  };

  const handleAddTaskClick = () => {
    setIsFormVisible(true);
    setTimeout(() => titleInputRef.current?.focus(), 0);
  };

  return (
    <div className="space-y-6 pb-4 pt-2">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-2xl">{projectTitle || "Loading..."}</h1>
        <div className="flex -space-x-2">
          {teamMembers.map((member) => (
            <Tooltip key={member.id}>
              <TooltipTrigger asChild>
                <img
                  className="rounded-full ring-2 ring-background w-8 h-8"
                  src={`/user/avatar/${member.avatar_id}.png`}
                  width={32}
                  height={32}
                  alt={member.username}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm">{member.username}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {!projectId ? (
          <ErrorState
            title="404 Project Not Found"
            message="Invalid project URL. Please check the URL and try again."
          />
        ) : loading ? (
          <TaskSkeletonList />
        ) : error ? (
          <ErrorState
            title="404 Project Not Found"
            message="The project you're looking for doesn't exist or you don't have access to it."
          />
        ) : (
          <>
            {currentProjectTodos
              .filter((todo) => todo.status !== "done")
              .map((todo) =>
                editingTask?.id === todo.id ? (
                  <TaskForm
                    key={todo.id}
                    formData={formData}
                    onSubmit={handleSubmit}
                    onChange={setFormData}
                    onCancel={() => {
                      setEditingTask(null);
                      resetForm();
                      setIsFormVisible(false);
                    }}
                    isEditing
                    currentProjectId={projectId}
                  />
                ) : (
                  <TaskItem
                    key={todo.id}
                    task={transformTodoToTask(todo)}
                    toggleTaskComplete={() => toggleTaskComplete(todo)}
                    onEdit={() => handleEditTask(todo)}
                    onDelete={() => handleDeleteTask(todo.id)}
                  />
                )
              )}

            {/* Completed Tasks Section */}
            {currentProjectTodos.some((todo) => todo.status === "done") && (
              <CompletedTasks
                showCompleted={showCompleted}
                setShowCompleted={setShowCompleted}
                completedTodos={currentProjectTodos.filter(
                  (t) => t.status === "done"
                )}
                transformTodoToTask={transformTodoToTask}
                toggleTaskComplete={toggleTaskComplete}
                handleEditTask={handleEditTask}
                handleDeleteTask={handleDeleteTask}
              />
            )}

            {/* Add Task Button and Form */}
            {!editingTask && !isFormVisible && (
              <button
                onClick={handleAddTaskClick}
                className="flex items-center relative group mt-2"
              >
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-transparent group-hover:bg-purple-500 transition duration-300">
                  <Plus className="w-4 h-4 text-primary group-hover:text-white transition duration-300" />
                </span>
                <span className="ml-2 text-sm text-gray-500 cursor-pointer group-hover:text-purple-500 transition duration-300">
                  Add Task
                </span>
              </button>
            )}

            {!editingTask && isFormVisible && (
              <TaskForm
                formData={formData}
                onSubmit={handleSubmit}
                onChange={setFormData}
                onCancel={() => {
                  setIsFormVisible(false);
                  resetForm();
                }}
                currentProjectId={projectId}
              />
            )}

            {!isFormVisible &&
              !editingTask &&
              currentProjectTodos.length === 0 &&
              !loading &&
              !error && (
                <NoTasks
                  onAddTask={() => {
                    setIsFormVisible(true);
                    setTimeout(() => titleInputRef.current?.focus(), 0);
                  }}
                />
              )}
          </>
        )}
      </div>
    </div>
  );
}
