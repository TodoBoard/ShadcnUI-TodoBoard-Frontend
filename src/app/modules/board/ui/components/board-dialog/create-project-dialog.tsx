"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Folder } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Projects } from "@/lib/api";
import { useProjectsStore } from "@/store/projects";
import { useIsMobile } from "@/hooks/use-mobile";
import { useRouter } from "next/navigation";
import { slugify } from "@/utils/format-projects";

const MAX_PROJECT_NAME_LENGTH = 25;

interface CreateProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateProjectDialog({
  open,
  onOpenChange,
}: CreateProjectDialogProps) {
  const [projectName, setProjectName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { fetchProjects } = useProjectsStore();
  const router = useRouter();
  const isMobile = useIsMobile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = projectName.trim();
    if (!trimmedName) {
      toast.error("Please enter a project name");
      return;
    }

    if (trimmedName.length > MAX_PROJECT_NAME_LENGTH) {
      toast.error(
        `Project name cannot exceed ${MAX_PROJECT_NAME_LENGTH} characters`
      );
      return;
    }

    setIsLoading(true);
    try {
      const response = await Projects.createProject({ name: trimmedName });
      await fetchProjects();
      toast.success("Project created successfully!");
      onOpenChange(false);

      const slugName = slugify(response.name);
      const projectUrl = `/board/projects/my-projects/${slugName}-id=${response.id}`;
      router.push(projectUrl);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create project";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
      setProjectName("");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_PROJECT_NAME_LENGTH) {
      setProjectName(value);
    }
  };

  const dialogContent = (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="project-name">Project name</Label>
          <span className="text-xs text-muted-foreground">
            {projectName.length}/{MAX_PROJECT_NAME_LENGTH}
          </span>
        </div>
        <Input
          id="project-name"
          placeholder="Enter project name"
          value={projectName}
          onChange={handleInputChange}
          disabled={isLoading}
          required
          maxLength={MAX_PROJECT_NAME_LENGTH}
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Creating..." : "Create project"}
      </Button>
    </form>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <div className="flex items-center gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Folder className="size-6 text-primary" />
              </div>
              <div className="flex-1">
                <DrawerTitle>Create new project</DrawerTitle>
                <DrawerDescription>
                  Add a new project to organize your tasks
                </DrawerDescription>
              </div>
            </div>
          </DrawerHeader>
          <div className="px-4 pb-4">{dialogContent}</div>
          <DrawerFooter className="pt-2">
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <Folder className="size-6 text-primary" />
            </div>
            <div className="flex-1">
              <DialogTitle>Create new project</DialogTitle>
              <DialogDescription>
                Add a new project to organize your tasks
              </DialogDescription>
            </div>
          </div>
          {dialogContent}
        </div>
      </DialogContent>
    </Dialog>
  );
}
