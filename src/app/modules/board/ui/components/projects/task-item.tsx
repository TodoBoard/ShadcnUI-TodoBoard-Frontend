import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { Calendar as CalendarIcon, Pencil, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string | undefined;
  due_date: string | null;
  dueDate?: Date;
  dueTime?: string | null;
  completed: boolean;
  creator: {
    name: string;
    avatar: string;
  };
}

interface TaskItemProps {
  task: Task;
  toggleTaskComplete: (id: string) => void;
  onEdit?: () => void;
  onDelete: (id: string) => void;
  disableEdit?: boolean;
}

export function TaskItem({
  task,
  toggleTaskComplete,
  onEdit,
  onDelete,
  disableEdit,
}: TaskItemProps) {
  return (
    <div>
      <div className="flex items-center gap-3 py-1.5">
        <button
          onClick={() => toggleTaskComplete(task.id)}
          className={cn(
            "w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors shrink-0",
            task.completed
              ? "bg-purple-500 border-purple-500"
              : "border-gray-300 hover:border-purple-500"
          )}
        >
          {task.completed && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </button>
        <div className="flex-1 flex items-center gap-3 min-w-0">
          <span
            className={cn(
              "text-sm flex-1 truncate",
              task.completed && "line-through text-gray-400"
            )}
          >
            {task.title}
          </span>
          <div className="flex items-center gap-2 text-xs text-gray-500 shrink-0">
            {task.priority && (
              <div className="flex items-center gap-1">
                <div
                  className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    task.priority === "low" && "bg-green-500",
                    task.priority === "medium" && "bg-yellow-500",
                    task.priority === "high" && "bg-red-500"
                  )}
                />
                <span>{task.priority.charAt(0).toUpperCase()}</span>
              </div>
            )}
            {task.dueDate && (
              <div className="flex items-center gap-1">
                <CalendarIcon className="w-3 h-3" />
                <span>
                  {format(task.dueDate, "MMM d")}
                  {task.due_date &&
                    format(parseISO(task.due_date), "HH:mm") !== "00:00" &&
                    `, ${format(parseISO(task.due_date), "HH:mm")}`}
                </span>
              </div>
            )}
            {!disableEdit && onEdit && (
              <button
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                onClick={onEdit}
              >
                <Pencil className="w-3 h-3 text-gray-400 hover:text-gray-600" />
              </button>
            )}
            <button
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              onClick={() => onDelete(task.id)}
            >
              <Trash2 className="w-3 h-3 text-gray-400 hover:text-gray-600" />
            </button>
          </div>
        </div>
      </div>
      <div className="ml-7 space-y-1">
        {task.description && (
          <p className="text-xs text-gray-500 break-words">
            {task.description}
          </p>
        )}
        <div className="flex justify-between items-center">
          <div />
          <div className="flex items-center gap-1.5">
            <Image
              src={task.creator.avatar}
              alt={task.creator.name}
              width={16}
              height={16}
              className="rounded-full"
            />
            <span className="text-xs text-gray-400">{task.creator.name}</span>
          </div>
        </div>
      </div>
      <Separator className="my-1.5" />
    </div>
  );
}
