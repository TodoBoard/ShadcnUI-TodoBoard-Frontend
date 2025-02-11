"use client";

import { NoTasks } from "@/app/modules/board/ui/components/no-tasks";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Plus, GripVertical } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TaskCard,
  TaskCardContent,
  TaskCardFooter,
  TaskCardHeader,
} from "@/app/modules/board/ui/components/task-card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface TaskFormData {
  title: string;
  description: string;
  dueDate: Date | undefined;
  dueTime: string | null;
  priority: string;
}

interface Task extends TaskFormData {
  id: string;
  completed: boolean;
}

function SortableTaskItem({
  task,
  toggleTaskComplete,
}: {
  task: Task;
  toggleTaskComplete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div className="flex items-center gap-3 py-1.5">
        <button
          onClick={() => toggleTaskComplete(task.id)}
          className={cn(
            "w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors shrink-0",
            task.completed
              ? "bg-purple-500 border-purple-500"
              : "border-gray-300"
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
            {task.priority !== "default" && (
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
                  {task.dueTime && `, ${task.dueTime}`}
                </span>
              </div>
            )}
          </div>
        </div>
        <button
          className="cursor-grab hover:text-purple-500 text-gray-400"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>
      </div>
      {task.description && (
        <p className="text-xs text-gray-500 ml-7 break-words">
          {task.description}
        </p>
      )}
      <Separator className="my-1.5" />
    </div>
  );
}

export default function MyProjectsTravelPage() {
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
    priority: "default",
  });

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

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: { x: 0, y: 10 },
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTask: Task = {
      ...formData,
      id: Math.random().toString(36).substr(2, 9),
      completed: false,
    };
    setTasks([...tasks, newTask]);
    setIsFormVisible(false);
    setFormData({
      title: "",
      description: "",
      dueDate: undefined,
      dueTime: null,
      priority: "default",
    });
  };

  const toggleTaskComplete = (taskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setTasks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <div className="p-6">
      <h1 className="font-bold text-2xl">Travel</h1>

      <div className="mt-5 space-y-2">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[
            (args: { transform: { x: number; y: number } }) => ({
              ...args,
              x: 0,
              y: args.transform.y,
            }),
          ]}
        >
          <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
            {tasks.map((task) => (
              <SortableTaskItem
                key={task.id}
                task={task}
                toggleTaskComplete={toggleTaskComplete}
              />
            ))}
          </SortableContext>
        </DndContext>

        {!isFormVisible && (
          <button
            onClick={() => setIsFormVisible(true)}
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

        {isFormVisible && (
          <TaskCard className="mt-4">
            <form onSubmit={handleSubmit}>
              <TaskCardHeader>
                <input
                  placeholder="Task name"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full text-sm bg-transparent border-none outline-none placeholder:text-muted-foreground focus:outline-none overflow-ellipsis"
                />
              </TaskCardHeader>
              <TaskCardContent>
                <textarea
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full bg-transparent border-none resize-none outline-none text-xs text-gray-500 placeholder:text-muted-foreground focus:outline-none break-words"
                  rows={2}
                />

                <div className="flex flex-wrap gap-1.5">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-1 h-3 w-3" />
                        {date ? (
                          <span>
                            {format(date, "PPP")}
                            {time && ` at ${time}`}
                          </span>
                        ) : (
                          <span>No date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <div className="rounded-lg border">
                        <div className="flex max-sm:flex-col">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={(newDate) => {
                              if (newDate) {
                                setDate(newDate);
                                setFormData((prev) => ({
                                  ...prev,
                                  dueDate: newDate,
                                }));
                                setTime(null);
                                setFormData((prev) => ({
                                  ...prev,
                                  dueTime: null,
                                }));
                              }
                            }}
                            className="p-2 sm:pe-5"
                            disabled={[{ before: today }]}
                            initialFocus
                          />
                          <div className="relative w-full max-sm:h-48 sm:w-40">
                            <div className="absolute inset-0 border-border py-4 max-sm:border-t">
                              <ScrollArea className="h-full border-border sm:border-s">
                                <div className="space-y-3">
                                  <div className="flex h-5 shrink-0 items-center px-5">
                                    <p className="text-sm font-medium">
                                      {date
                                        ? format(date, "EEEE, d")
                                        : "Select a date"}
                                    </p>
                                  </div>
                                  <div className="grid gap-1.5 px-5 max-sm:grid-cols-2">
                                    {timeSlots.map(
                                      ({ time: timeSlot, available }) => (
                                        <Button
                                          key={timeSlot}
                                          variant={
                                            time === timeSlot
                                              ? "default"
                                              : "outline"
                                          }
                                          size="sm"
                                          className="w-full"
                                          onClick={() => {
                                            setTime(timeSlot);
                                            setFormData((prev) => ({
                                              ...prev,
                                              dueTime: timeSlot,
                                            }));
                                          }}
                                          disabled={!available || !date}
                                        >
                                          {timeSlot}
                                        </Button>
                                      )
                                    )}
                                  </div>
                                </div>
                              </ScrollArea>
                            </div>
                          </div>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>

                  <Select
                    value={formData.priority}
                    onValueChange={(value) =>
                      setFormData({ ...formData, priority: value })
                    }
                  >
                    <SelectTrigger className="h-7 w-[100px] text-xs">
                      <SelectValue placeholder="Priority">
                        {formData.priority && (
                          <div className="flex items-center">
                            <div
                              className={cn(
                                "w-2 h-2 rounded-full mr-2",
                                formData.priority === "default" &&
                                  "bg-gray-300",
                                formData.priority === "low" && "bg-green-500",
                                formData.priority === "medium" &&
                                  "bg-yellow-500",
                                formData.priority === "high" && "bg-red-500"
                              )}
                            />
                            {formData.priority === "default"
                              ? "Default"
                              : formData.priority.charAt(0).toUpperCase() +
                                formData.priority.slice(1)}
                          </div>
                        )}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default" className="flex items-center">
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-gray-300 mr-2" />
                          Default
                        </div>
                      </SelectItem>
                      <SelectItem value="low" className="flex items-center">
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                          Low
                        </div>
                      </SelectItem>
                      <SelectItem value="medium" className="flex items-center">
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2" />
                          Medium
                        </div>
                      </SelectItem>
                      <SelectItem value="high" className="flex items-center">
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-red-500 mr-2" />
                          High
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <Button variant="outline" size="sm" className="h-7 text-xs">
                    <Plus className="h-3 w-3 mr-1" />
                    More
                  </Button>
                </div>
              </TaskCardContent>
              <Separator className="my-2" />
              <TaskCardFooter className="pt-2 flex justify-between items-center">
                <Select>
                  <SelectTrigger className="h-7 w-[150px] text-xs">
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="travel">Travel</SelectItem>
                    <SelectItem value="work">Work</SelectItem>
                    <SelectItem value="personal">Personal</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex gap-1.5">
                  <Button
                    onClick={() => setIsFormVisible(false)}
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" className="h-7 text-xs">
                    Add task
                  </Button>
                </div>
              </TaskCardFooter>
            </form>
          </TaskCard>
        )}
      </div>

      {!isFormVisible && tasks.length === 0 && <NoTasks />}
    </div>
  );
}
