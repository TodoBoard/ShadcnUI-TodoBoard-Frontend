"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
} from "../ui/components/task-card";
import { DateTimePicker } from "./date-time-picker";
import { PrioritySelect } from "./priority-select";
import { useRef } from "react";

interface TaskFormData {
  title: string;
  description: string;
  dueDate: Date | undefined;
  dueTime: string | null;
  priority: string;
}

interface TaskFormProps {
  formData: TaskFormData;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (data: TaskFormData) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

export function TaskForm({
  formData,
  onSubmit,
  onChange,
  onCancel,
  isEditing = false,
}: TaskFormProps) {
  const titleInputRef = useRef<HTMLInputElement>(null);

  return (
    <TaskCard>
      <form onSubmit={onSubmit}>
        <TaskCardHeader>
          <input
            ref={titleInputRef}
            placeholder="Task name"
            value={formData.title}
            onChange={(e) => onChange({ ...formData, title: e.target.value })}
            className="w-full text-sm bg-transparent border-none outline-none placeholder:text-muted-foreground focus:outline-none overflow-ellipsis"
            required
          />
        </TaskCardHeader>
        <TaskCardContent>
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) =>
              onChange({ ...formData, description: e.target.value })
            }
            className="w-full bg-transparent border-none resize-none outline-none text-xs text-gray-500 placeholder:text-muted-foreground focus:outline-none break-words"
            rows={2}
          />

          <div className="flex flex-wrap gap-1.5">
            <DateTimePicker
              date={formData.dueDate}
              time={formData.dueTime}
              onDateChange={(date) => onChange({ ...formData, dueDate: date })}
              onTimeChange={(time) => onChange({ ...formData, dueTime: time })}
            />

            <PrioritySelect
              value={formData.priority}
              onValueChange={(value) =>
                onChange({ ...formData, priority: value })
              }
            />
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
              type="button"
              onClick={onCancel}
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" className="h-7 text-xs">
              {isEditing ? "Save changes" : "Add task"}
            </Button>
          </div>
        </TaskCardFooter>
      </form>
    </TaskCard>
  );
}
