"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { 
  Folder, 
  Search, 
  Home,
  Settings,
  UserPlus,
  Bell
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Projects } from "@/lib/api";
import { ProjectListResponse } from "@/models/projects";
import { formatProjects } from "@/utils/format-projects";
import { mainNavItems } from "@/config/navigation";

interface SearchDialogProps {
  triggerContent: React.ReactNode;
  shortcut?: string;
}

export function SearchDialog({ triggerContent, shortcut }: SearchDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [projects, setProjects] = React.useState<ProjectListResponse | null>(null);
  const router = useRouter();

  // Fetch projects when dialog opens
  React.useEffect(() => {
    if (open) {
      Projects.getProjects().then(setProjects);
    }
  }, [open]);

  // Keyboard shortcut handler
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (
        shortcut &&
        e.key.toLowerCase() === shortcut.toLowerCase() &&
        (e.metaKey || e.ctrlKey)
      ) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [shortcut]);

  // Format projects for search
  const myProjects = formatProjects(projects?.my_projects || [], "my-projects");
  const invitedProjects = formatProjects(
    projects?.invited_projects || [],
    "invited-projects"
  );

  // Filter items based on search query
  const filteredNavigation = mainNavItems.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredMyProjects = myProjects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredInvitedProjects = invitedProjects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (url: string | undefined) => {
    if (url) {
      router.push(url);
      setOpen(false);
    }
  };

  const hasResults = 
    filteredNavigation.length > 0 || 
    filteredMyProjects.length > 0 || 
    filteredInvitedProjects.length > 0;

  return (
    <>
      <div onClick={() => setOpen(true)}>{triggerContent}</div>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput 
          placeholder="Search navigation and projects..." 
          value={searchQuery}
          onValueChange={setSearchQuery}
        />
        <CommandList>
          {!hasResults && <CommandEmpty>No results found.</CommandEmpty>}
          
          {filteredNavigation.length > 0 && (
            <CommandGroup heading="Navigation">
              {filteredNavigation.map((item) => (
                <CommandItem
                  key={item.title}
                  onSelect={() => handleSelect(item.url)}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  <span>{item.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {filteredNavigation.length > 0 && 
           (filteredMyProjects.length > 0 || filteredInvitedProjects.length > 0) && (
            <CommandSeparator />
          )}

          {filteredMyProjects.length > 0 && (
            <CommandGroup heading="My Projects">
              {filteredMyProjects.map((project) => (
                <CommandItem
                  key={project.key}
                  onSelect={() => handleSelect(project.url)}
                >
                  <Folder className="mr-2 h-4 w-4" />
                  <span>{project.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {filteredMyProjects.length > 0 && filteredInvitedProjects.length > 0 && (
            <CommandSeparator />
          )}

          {filteredInvitedProjects.length > 0 && (
            <CommandGroup heading="Invited Projects">
              {filteredInvitedProjects.map((project) => (
                <CommandItem
                  key={project.key}
                  onSelect={() => handleSelect(project.url)}
                >
                  <Folder className="mr-2 h-4 w-4" />
                  <span>{project.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
