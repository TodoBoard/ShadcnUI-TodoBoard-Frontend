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
import { TeamMember } from "@/models/projects";
import { parseMention, composeTitle } from "@/utils/mentions";
import {
  TaskItem,
  Task,
} from "@/app/modules/board/ui/components/projects/task-item";
import { CompletedTasks } from "@/app/modules/board/ui/components/projects/completed-tasks";
import { useTaskCompleteSound } from "@/hooks/use-task-complete-sound";
import { ErrorState } from "@/app/modules/board/ui/components/error-state/error-state";
import { TaskSkeletonList } from "@/app/modules/board/ui/components/projects/task-skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

interface TaskFormData {
  title: string;
  description: string;
  dueDate: Date | undefined;
  dueTime: string | null;
  priority: string | undefined;
  assignedUserId?: string | null;
}

export function Projects() {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formData, setFormData] = useState<TaskFormData>({
    title: "",
    description: "",
    dueDate: undefined,
    dueTime: null,
    priority: undefined,
    assignedUserId: undefined,
  });
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showCompleted, setShowCompleted] = useState(false);
  const playTaskCompleteSound = useTaskCompleteSound();
  const titleInputRef = useRef<HTMLInputElement>(null);
  const [username, setUsername] = useState<string>("");
  const [avatarId, setAvatarId] = useState<number | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const projectTitle = useProjectTitle();
  const projectId = useProjectId();
  const {
    loading,
    error,
    fetchTodos,
    createTodo,
    updateTodo,
    deleteTodo,
    selectedProjectId,
    getProjectTodos,
    setSelectedProjectId,
  } = useTodosStore();
  const { getCurrentProjectTeam } = useProjectsStore();
  const teamMembers = getCurrentProjectTeam(projectId);

  const currentProjectTodos = getProjectTodos(projectId);

  const isMobile = useIsMobile();

  useEffect(() => {
    if (!projectId) return;
    fetchTodos(projectId);
    setSelectedProjectId(projectId);
  }, [projectId, fetchTodos, setSelectedProjectId]);

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

  const initialFormData: TaskFormData = {
    title: "",
    description: "",
    dueDate: undefined,
    dueTime: null,
    priority: undefined,
    assignedUserId: undefined,
  };

  const resetForm = () => {
    setFormData(initialFormData);
  };

  const focusTitleInput = () => {
    setTimeout(() => titleInputRef.current?.focus(), 0);
  };

  const transformTodoToTask = (todo: Todo) => {
    const dueDate = todo.due_date ? parseISO(todo.due_date) : undefined;
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
            : "",
      },
      assignee: todo.assignee_username
        ? {
            name: todo.assignee_username,
            avatar: todo.assignee_avatar_id
              ? `/user/avatar/${todo.assignee_avatar_id}.png`
              : "",
          }
        : undefined,
    };
  };

  const processTaskData = (
    title: string,
    assignedUserId: string | null | undefined,
    teamMembers: TeamMember[]
  ) => {
    const { cleanTitle, username: mentionedUsername } = parseMention(title);

    if (assignedUserId === null) {
      return { cleanTitle, finalAssignedUserId: null };
    }

    if (assignedUserId) {
      return { cleanTitle, finalAssignedUserId: assignedUserId };
    }

    if (mentionedUsername) {
      const user = teamMembers.find((m) => m.username === mentionedUsername);
      return { cleanTitle, finalAssignedUserId: user?.id };
    }

    return { cleanTitle, finalAssignedUserId: null };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !projectId) return;

    try {
      const { cleanTitle, finalAssignedUserId } = processTaskData(
        formData.title,
        formData.assignedUserId,
        teamMembers
      );
      
      if (editingTask) {
        const updateData: Partial<TodoUpdateSchema> = {
          title: cleanTitle,
          assigned_user_id: finalAssignedUserId,
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
        setEditingTaskId(null);
        setIsFormVisible(false);
      } else {
        const todoData: Partial<TodoCreate> = {
          title: cleanTitle,
          project_id: selectedProjectId || projectId,
          assigned_user_id: finalAssignedUserId,
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

        await createTodo(todoData as TodoCreate);

        if (isMobile) {
          setIsFormVisible(false);
        }
      }

      resetForm();

      if (!isMobile && isFormVisible) {
        focusTitleInput();
      }
    } catch (error) {
      console.error("Error submitting task:", error);
    }
  };

  const handleEditTask = (todo: Todo) => {
    const dueDate = todo.due_date ? parseISO(todo.due_date) : undefined;
    const dueTime =
      dueDate && format(dueDate, "HH:mm") !== "00:00"
        ? format(dueDate, "HH:mm")
        : null;
    
    const taskTitle = composeTitle(todo.assignee_username, todo.title);

    const taskToEdit = {
      id: todo.id,
      title: todo.title,
      description: todo.description,
      status: todo.status,
      priority: todo.priority || undefined,
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
            : "",
      },
      assignee: todo.assignee_username
        ? {
            name: todo.assignee_username,
            avatar: todo.assignee_avatar_id
              ? `/user/avatar/${todo.assignee_avatar_id}.png`
              : "",
          }
        : undefined,
    };

    setEditingTask(taskToEdit);
    setEditingTaskId(todo.id);

    setFormData({
      title: taskTitle,
      description: todo.description,
      dueDate: dueDate,
      dueTime: dueTime,
      priority: todo.priority || undefined,
      assignedUserId: todo.assigned_user_id || undefined,
    });

    if (isMobile) {
      setIsFormVisible(true);
    } else {
      setIsFormVisible(false);
    }

    setTimeout(() => titleInputRef.current?.focus(), 0);
  };

  const handleDeleteTask = async (todoId: string) => {
    try {
      await deleteTodo(todoId);

      if (editingTask && editingTask.id === todoId) {
        setEditingTask(null);
        setIsFormVisible(false);
        resetForm();
      }
    } catch (error) {
      console.error("Error deleting task:", error);
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
      console.error("Error toggling task completion:", error);
    }
  };

  const handleAddTaskClick = () => {
    setEditingTask(null);
    setEditingTaskId(null);
    setIsFormVisible(true);
    setTimeout(() => titleInputRef.current?.focus(), 0);
  };

  const taskFormContent = (
    <TaskForm
      formData={formData}
      onSubmit={handleSubmit}
      onChange={setFormData}
      onCancel={() => {
        setIsFormVisible(false);
        resetForm();
      }}
      currentProjectId={projectId}
      teamMembers={teamMembers}
    />
  );

  const renderTaskForm = () => {
    if (isMobile && isFormVisible) {
      return (
        <Drawer
          open={isFormVisible}
          onOpenChange={(open) => {
            setIsFormVisible(open);
            if (!open) {
              setEditingTask(null);
              setEditingTaskId(null);
              resetForm();
            }
          }}
        >
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>
                {editingTask ? "Edit Task" : "Add New Task"}
              </DrawerTitle>
            </DrawerHeader>
            <div className="px-4">{taskFormContent}</div>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button
                  variant="outline"
                  className="rounded-xl"
                  onClick={() => {
                    resetForm();
                    setEditingTask(null);
                    setEditingTaskId(null);
                    setIsFormVisible(false);
                  }}
                >
                  Cancel
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      );
    }

    return (!isMobile && isFormVisible && !editingTaskId) ? taskFormContent : null;
  };

  return (
    <div className="space-y-6 pb-4 pt-2">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-2xl">{projectTitle || "Loading..."}</h1>
        <div className="flex -space-x-2">
          {teamMembers.map((member) => (
            <Tooltip key={member.id}>
              <TooltipTrigger asChild>
                <Avatar className="ring-2 ring-background w-8 h-8">
                  <AvatarImage
                    src={`/user/avatar/${member.avatar_id}.png`}
                    alt={member.username}
                  />
                  <AvatarFallback>
                    {member.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
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
        ) : error ? (
          <ErrorState
            title="404 Project Not Found"
            message="The project you're looking for doesn't exist or you don't have access to it."
          />
        ) : loading ? (
          <TaskSkeletonList />
        ) : (
          <div className="space-y-2">
            {currentProjectTodos
              .filter((todo) => todo.status !== "done")
              .map((todo) => {
                if (!isMobile && editingTaskId === todo.id) {
                  return (
                    <TaskForm
                      key={todo.id}
                      formData={formData}
                      onSubmit={handleSubmit}
                      onChange={setFormData}
                      onCancel={() => {
                        setEditingTask(null);
                        setEditingTaskId(null);
                        resetForm();
                      }}
                      currentProjectId={projectId}
                      teamMembers={teamMembers}
                      isEditing={true}
                    />
                  );
                }

                return (
                  <TaskItem
                    key={todo.id}
                    task={transformTodoToTask(todo)}
                    toggleTaskComplete={() => toggleTaskComplete(todo)}
                    onEdit={() => handleEditTask(todo)}
                    onDelete={() => handleDeleteTask(todo.id)}
                  />
                );
              })}

            {renderTaskForm()}

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

            {!isFormVisible &&
              !editingTask &&
              currentProjectTodos.length === 0 && (
                <NoTasks
                  onAddTask={() => {
                    setIsFormVisible(true);
                    setTimeout(() => titleInputRef.current?.focus(), 0);
                  }}
                />
              )}
          </div>
        )}
      </div>
    </div>
  );
}
