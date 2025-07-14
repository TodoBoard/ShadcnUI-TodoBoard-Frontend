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
import { useRef, useEffect, useState } from "react";
import { useProjectsStore } from "@/store/projects";
import { useTodosStore } from "@/store/todos";
import { Send } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { composeTitle, sanitizeTitle } from "@/utils/mentions";
import { TeamMember } from "@/models/projects";

interface TaskFormData {
  title: string;
  description: string;
  dueDate: Date | undefined;
  dueTime: string | null;
  priority: string | undefined;
  assignedUserId?: string | null;
}

interface TaskFormProps {
  formData: TaskFormData;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (data: TaskFormData) => void;
  onCancel: () => void;
  isEditing?: boolean;
  currentProjectId: string;
  teamMembers: TeamMember[];
}

export function TaskForm({
  formData,
  onSubmit,
  onChange,
  onCancel,
  isEditing = false,
  currentProjectId,
  teamMembers,
}: TaskFormProps) {
  const titleInputRef = useRef<HTMLInputElement>(null)
  const [showMentions, setShowMentions] = useState(false)
  const [filteredMembers, setFilteredMembers] = useState<TeamMember[]>([])
  const [selectedMemberIndex, setSelectedMemberIndex] = useState(0)

  const { myProjects, invitedProjects } = useProjectsStore();
  const { selectedProjectId, setSelectedProjectId } = useTodosStore();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!selectedProjectId) {
      setSelectedProjectId(currentProjectId);
    }
  }, [currentProjectId, selectedProjectId, setSelectedProjectId]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const prevTitle = formData.title
    
    const hadMention = /^@\w+\s/.test(prevTitle)
    const hasMention = /^@\w+\s/.test(value)
    
    const cursorPos = e.target.selectionStart || 0
    const textBeforeCursor = value.substring(0, cursorPos)
    const mentionMatch = textBeforeCursor.match(/@(\w*)$/)
    
    if (mentionMatch) {
      setShowMentions(true)
      setSelectedMemberIndex(0)
      const query = mentionMatch[1]
      setFilteredMembers(
        teamMembers.filter((m) =>
          m.username.toLowerCase().includes(query.toLowerCase())
        )
      )
      
      if (hadMention && !hasMention && formData.assignedUserId) {
        onChange({ ...formData, title: value, assignedUserId: null })
      } else {
        onChange({ ...formData, title: value })
      }
    } else {
      setShowMentions(false)
      
      let cleanedTitle = value
      
      if (!value.match(/^@\w+\s/) && value.includes('@')) {
        cleanedTitle = value.replace(/@\w*$/, '').replace(/@\s*$/, '')
      }
      
      if (hadMention && !hasMention && formData.assignedUserId) {
        onChange({ ...formData, title: cleanedTitle, assignedUserId: null })
      } else {
        onChange({ ...formData, title: cleanedTitle })
      }
    }
  }

  const handleMentionSelect = (member: TeamMember) => {
    const title = formData.title
    const cursorPos = titleInputRef.current?.selectionStart || 0
    const textBeforeCursor = title.substring(0, cursorPos)
    const mentionStartsAt = textBeforeCursor.lastIndexOf("@")

    if (mentionStartsAt !== -1) {
      const newTitle =
        title.substring(0, mentionStartsAt) +
        `@${member.username} ` +
        title.substring(cursorPos)

      onChange({ ...formData, title: newTitle, assignedUserId: member.id })
      setShowMentions(false)
      setTimeout(() => {
        const newCursorPos = mentionStartsAt + `@${member.username} `.length
        titleInputRef.current?.focus()
        titleInputRef.current?.setSelectionRange(newCursorPos, newCursorPos)
      }, 0)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (showMentions && filteredMembers.length > 0) {
      if (e.key === 'Tab' || e.key === 'Enter') {
        e.preventDefault()
        handleMentionSelect(filteredMembers[selectedMemberIndex])
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedMemberIndex(prev => 
          prev < filteredMembers.length - 1 ? prev + 1 : prev
        )
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedMemberIndex(prev => prev > 0 ? prev - 1 : 0)
      } else if (e.key === 'Escape') {
        setShowMentions(false)
      }
    }
  }

  const updateTitleMention = (value: string, title: string): string => {
    const cleaned = sanitizeTitle(title);
    if (value === "unassigned") return cleaned;
    const selectedMember = teamMembers.find((m) => m.id === value);
    return composeTitle(selectedMember?.username, cleaned);
  }

  const handleAssigneeChange = (value: string) => {
    const newTitle = updateTitleMention(value, formData.title)
    
    onChange({
      ...formData,
      title: newTitle,
      assignedUserId: value === "unassigned" ? null : value,
    })
  }

  const allProjects = [...myProjects, ...invitedProjects]
  const currentProject = allProjects.find((p) => p.id === selectedProjectId);

  return (
    <TaskCard>
      <form onSubmit={onSubmit}>
        <TaskCardHeader>
          <div className="relative">
            <input
              ref={titleInputRef}
              placeholder="Task name"
              value={formData.title}
              onChange={handleTitleChange}
              onKeyDown={handleKeyDown}
              onBlur={() => setTimeout(() => setShowMentions(false), 200)}
              className="w-full text-sm bg-transparent border-none outline-none placeholder:text-muted-foreground focus:outline-none overflow-ellipsis"
              required
            />
            {showMentions && (
              <div className="absolute top-full left-0 mt-1 w-full rounded-md border bg-card text-card-foreground shadow-lg z-10">
                {filteredMembers.length > 0 ? (
                  <ul>
                    {filteredMembers.map((member, index) => (
                      <li
                        key={member.id}
                        onMouseDown={() => handleMentionSelect(member)}
                        className={`p-2 text-sm cursor-pointer ${
                          index === selectedMemberIndex ? 'bg-muted' : 'hover:bg-muted'
                        }`}
                        onMouseEnter={() => setSelectedMemberIndex(index)}
                      >
                        {member.username}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-2 text-sm text-muted-foreground">
                    No matching project members found.
                  </div>
                )}
              </div>
            )}
          </div>
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

            <Select
              value={formData.assignedUserId ?? "unassigned"}
              onValueChange={handleAssigneeChange}
            >
              <SelectTrigger className="h-7 w-[140px] text-xs">
                <SelectValue placeholder="Assign to" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">Unassigned</SelectItem>
                {teamMembers.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.username}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
