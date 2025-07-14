"use client";

import {
  type LucideIcon,
  ChevronRight,
  MoreHorizontal,
  LogOut,
} from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useProjectsStore } from "@/store/projects";
import { toast } from "sonner";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { useSidebarMobileClose } from "@/hooks/use-sidebar-mobile-close";
import { useRouter } from "next/navigation";

export function NavInvitedProjects({
  projects,
}: {
  projects: {
    name: string;
    url: string;
    icon: LucideIcon;
    id: string;
  }[];
}) {
  const { isMobile } = useSidebar();
  const handleMobileItemClick = useSidebarMobileClose();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { leaveProject, updateProjectSorting, updateLocalProjectSorting } =
    useProjectsStore();

  const handleLeaveProject = async (projectId: string, projectName: string) => {
    const id = projectId.split("-").slice(-5).join("-");
    try {
      await leaveProject(id);
      toast.success(`Left project ${projectName} successfully`);
      if (pathname.includes(id)) {
        router.push("/board/home");
      }
    } catch {
      toast.error("Failed to leave project");
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(projects);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const projectIds = items.map((item) =>
      item.id.split("-").slice(-5).join("-")
    );

    updateLocalProjectSorting(projectIds, "invited");

    await updateProjectSorting(projectIds);
  };

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <div className="flex items-center justify-between px-2">
        <SidebarGroupLabel>Invited Projects</SidebarGroupLabel>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-muted-foreground hover:text-foreground"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? "Expand" : "Collapse"}
        >
          <ChevronRight
            className={cn("h-4 w-4 transition-transform", {
              "rotate-90": !isCollapsed,
            })}
          />
        </Button>
      </div>
      {!isCollapsed && (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="invited-projects">
            {(provided) => (
              <SidebarMenu {...provided.droppableProps} ref={provided.innerRef}>
                {projects.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided) => (
                      <SidebarMenuItem
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <SidebarMenuButton asChild>
                          <Link
                            href={item.url}
                            className={cn({
                              "bg-sidebar-accent": pathname === item.url,
                              "text-sidebar-primary": pathname === item.url,
                              "text-muted-foreground": pathname !== item.url,
                              "flex items-center gap-2 p-2 rounded": true,
                            })}
                            onClick={handleMobileItemClick}
                          >
                            <item.icon
                              className={cn({
                                "text-sidebar-primary": pathname === item.url,
                                "text-muted-foreground": pathname !== item.url,
                              })}
                            />
                            <span>{item.name}</span>
                          </Link>
                        </SidebarMenuButton>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <SidebarMenuAction showOnHover>
                              <MoreHorizontal />
                              <span className="sr-only">More</span>
                            </SidebarMenuAction>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            className="w-48 rounded-lg"
                            side={isMobile ? "bottom" : "right"}
                            align={isMobile ? "end" : "start"}
                          >
                            <DropdownMenuItem
                              onClick={() =>
                                handleLeaveProject(item.id, item.name)
                              }
                              className="cursor-pointer"
                            >
                              <LogOut className="mr-2 h-4 w-4 text-muted-foreground" />
                              <span>Leave Project</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </SidebarMenuItem>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </SidebarMenu>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </SidebarGroup>
  );
}
