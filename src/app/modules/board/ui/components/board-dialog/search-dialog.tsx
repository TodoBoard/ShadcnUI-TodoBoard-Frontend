"use client"; //TODO

import * as React from "react";
import { useRouter } from "next/navigation";
import { Folder } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { formatProjects } from "@/utils/format-projects";
import { mainNavItems } from "@/config/navigation";
import { useProjectsStore } from "@/store/projects";
import { DialogTitle } from "@/components/ui/dialog";

interface SearchDialogProps {
  triggerContent: React.ReactNode;
  shortcut?: string;
}

export function SearchDialog({ triggerContent, shortcut }: SearchDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const { myProjects, invitedProjects, loading } = useProjectsStore();
  const router = useRouter();

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

  // Format and filter projects
  const searchTerm = searchQuery.toLowerCase().trim();

  const filteredNavigation = mainNavItems.filter((item) =>
    item.title.toLowerCase().includes(searchTerm)
  );

  const filteredMyProjects = formatProjects(
    myProjects.filter((project) =>
      project.name.toLowerCase().includes(searchTerm)
    ),
    "my-projects"
  );

  const filteredInvitedProjects = formatProjects(
    invitedProjects.filter((project) =>
      project.name.toLowerCase().includes(searchTerm)
    ),
    "invited-projects"
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
        <DialogTitle className="sr-only">Search</DialogTitle>
        <CommandInput
          placeholder="Type to search..."
          value={searchQuery}
          onValueChange={setSearchQuery}
        />
        <CommandList>
          {loading ? (
            <CommandEmpty>Loading results...</CommandEmpty>
          ) : !hasResults && searchQuery ? (
            <CommandEmpty>
              No matches found for &quot;{searchQuery}&quot;
              <br />
              Try searching for something else
            </CommandEmpty>
          ) : (
            <>
              <CommandGroup heading="Navigation">
                {(searchQuery ? filteredNavigation : mainNavItems).map(
                  (item) => (
                    <CommandItem
                      key={item.title}
                      onSelect={() => handleSelect(item.url)}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.title}</span>
                    </CommandItem>
                  )
                )}
              </CommandGroup>

              {(filteredMyProjects.length > 0 ||
                filteredInvitedProjects.length > 0) && <CommandSeparator />}

              {(searchQuery
                ? filteredMyProjects
                : formatProjects(myProjects, "my-projects")
              ).length > 0 && (
                <CommandGroup heading="My Projects">
                  {(searchQuery
                    ? filteredMyProjects
                    : formatProjects(myProjects, "my-projects")
                  ).map((project) => (
                    <CommandItem
                      key={project.key}
                      value={`my-${project.key}`}
                      onSelect={() => handleSelect(project.url)}
                    >
                      <Folder className="mr-2 h-4 w-4" />
                      <span>{project.name}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {(searchQuery
                ? filteredMyProjects
                : formatProjects(myProjects, "my-projects")
              ).length > 0 &&
                (searchQuery
                  ? filteredInvitedProjects
                  : formatProjects(invitedProjects, "invited-projects")
                ).length > 0 && <CommandSeparator />}

              {(searchQuery
                ? filteredInvitedProjects
                : formatProjects(invitedProjects, "invited-projects")
              ).length > 0 && (
                <CommandGroup heading="Invited Projects">
                  {(searchQuery
                    ? filteredInvitedProjects
                    : formatProjects(invitedProjects, "invited-projects")
                  ).map((project) => (
                    <CommandItem
                      key={project.key}
                      value={`invited-${project.key}`}
                      onSelect={() => handleSelect(project.url)}
                    >
                      <Folder className="mr-2 h-4 w-4" />
                      <span>{project.name}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
