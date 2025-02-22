"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
  SelectGroup,
  SelectSeparator,
} from "@/components/ui/select";
import {
  TaskCard,
  TaskCardContent,
  TaskCardFooter,
  TaskCardHeader,
} from "./task-card";
import { DateTimePicker } from "./date-time-picker";
import { PrioritySelect } from "./priority-select";
import { useRef, useEffect } from "react";
import { useProjectsStore } from "@/store/projects";
import { useTodosStore } from "@/store/todos";
import { Send } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface TaskFormData {
  title: string;
  description: string;
  dueDate: Date | undefined;
  dueTime: string | null;
  priority: string | undefined;
}

interface TaskFormProps {
  formData: TaskFormData;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (data: TaskFormData) => void;
  onCancel: () => void;
  isEditing?: boolean;
  currentProjectId: string;
}

export function TaskForm({
  formData,
  onSubmit,
  onChange,
  onCancel,
  isEditing = false,
  currentProjectId,
}: TaskFormProps) {
  const titleInputRef = useRef<HTMLInputElement>(null);
  const { myProjects, invitedProjects } = useProjectsStore();
  const { selectedProjectId, setSelectedProjectId } = useTodosStore();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!selectedProjectId) {
      setSelectedProjectId(currentProjectId);
    }
  }, [currentProjectId, selectedProjectId, setSelectedProjectId]);

  const allProjects = [...myProjects, ...invitedProjects];
  const currentProject = allProjects.find((p) => p.id === selectedProjectId);

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
          <Select
            value={selectedProjectId}
            onValueChange={setSelectedProjectId}
            disabled={isEditing}
          >
            <SelectTrigger className="h-7 w-[150px] text-xs">
              <SelectValue placeholder="Select project">
                {currentProject?.name}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {myProjects.length > 0 && (
                <SelectGroup>
                  <SelectLabel>My Projects</SelectLabel>
                  {myProjects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              )}
              {invitedProjects.length > 0 && (
                <>
                  {myProjects.length > 0 && <SelectSeparator />}
                  <SelectGroup>
                    <SelectLabel>Invited Projects</SelectLabel>
                    {invitedProjects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </>
              )}
            </SelectContent>
          </Select>

          <div className="flex gap-1.5">
            {!isMobile && (
              <Button
                type="button"
                onClick={onCancel}
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
              >
                Cancel
              </Button>
            )}
            <Button type="submit" size="sm" className="h-7 text-xs">
              {isMobile ? (
                <Send className="h-4 w-4" />
              ) : isEditing ? (
                "Save changes"
              ) : (
                "Add task"
              )}
            </Button>
          </div>
        </TaskCardFooter>
      </form>
    </TaskCard>
  );
}
