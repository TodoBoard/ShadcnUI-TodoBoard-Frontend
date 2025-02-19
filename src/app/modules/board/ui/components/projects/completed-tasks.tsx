import { cn } from "@/lib/utils";
import { Todo } from "@/models/todos";
import { TaskItem, Task } from "./task-item";

interface CompletedTasksProps {
  showCompleted: boolean;
  setShowCompleted: (show: boolean) => void;
  completedTodos: Todo[];
  transformTodoToTask: (todo: Todo) => Task;
  toggleTaskComplete: (todo: Todo) => void;
  handleEditTask: (todo: Todo) => void;
  handleDeleteTask: (id: string) => void;
}

export function CompletedTasks({
  showCompleted,
  setShowCompleted,
  completedTodos,
  transformTodoToTask,
  toggleTaskComplete,
  handleEditTask,
  handleDeleteTask,
}: CompletedTasksProps) {
  return (
    <div className="mt-6">
      <button
        onClick={() => setShowCompleted(!showCompleted)}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        <div
          className={cn(
            "transform transition-transform",
            showCompleted ? "rotate-90" : ""
          )}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 12L10 8L6 4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <span>Completed</span>
        <span className="text-xs text-gray-400">({completedTodos.length})</span>
      </button>

      {showCompleted && (
        <div className="mt-2 space-y-2">
          {completedTodos.map((todo) => (
            <TaskItem
              key={todo.id}
              task={transformTodoToTask(todo)}
              toggleTaskComplete={() => toggleTaskComplete(todo)}
              onEdit={() => handleEditTask(todo)}
              onDelete={() => handleDeleteTask(todo.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
