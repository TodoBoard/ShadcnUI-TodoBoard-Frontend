"use client";

import {
  Forward,
  MoreHorizontal,
  Trash2,
  type LucideIcon,
  Plus,
  ChevronRight,
  Pencil,
  Users,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { CreateProjectDialog } from "../board-dialog/create-project-dialog";
import { NavInvitePeopleDialog } from "../board-dialog/invite-people-dialog";
import { RenameProjectDialog } from "../board-dialog/rename-project-dialog";
import { DeleteProjectDialog } from "../board-dialog/delete-project-dialog";
import { ManageTeamDialog } from "../board-dialog/manage-team-dialog";
import { useProjectsStore } from "@/store/projects";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { useSidebarMobileClose } from "@/hooks/use-sidebar-mobile-close";

export function NavMyProjects({
  projects,
}: {
  projects: {
    id: string;
    name: string;
    url: string;
    icon: LucideIcon;
    team_members: { id: string; username: string; avatar_id: number }[];
    key: string;
  }[];
}) {
  const { isMobile } = useSidebar();
  const handleMobileItemClick = useSidebarMobileClose();
  const { fetchProjects, updateProjectSorting, updateLocalProjectSorting } =
    useProjectsStore();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const pathname = usePathname();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );
  const [openRenameDialog, setOpenRenameDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedProjectForDelete, setSelectedProjectForDelete] = useState<
    string | null
  >(null);
  const [openManageTeamDialog, setOpenManageTeamDialog] = useState(false);

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(projects);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const projectIds = items.map((item) =>
      item.id.split("-").slice(-5).join("-")
    );

    updateLocalProjectSorting(projectIds, "my");

    await updateProjectSorting(projectIds);
  };

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <div className="flex items-center justify-between px-2">
        <SidebarGroupLabel>My Projects</SidebarGroupLabel>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-muted-foreground hover:text-foreground"
            aria-label="Add new project"
            onClick={() => setOpenCreateDialog(true)}
          >
            <Plus className="h-4 w-4" />
          </Button>
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
      </div>
      {!isCollapsed && (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="my-projects">
            {(provided) => (
              <SidebarMenu {...provided.droppableProps} ref={provided.innerRef}>
                {projects.map((item, index) => (
                  <Draggable
                    key={item.key}
                    draggableId={item.key}
                    index={index}
                  >
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
                            <NavInvitePeopleDialog
                              triggerContent={
                                <DropdownMenuItem
                                  onSelect={(e) => e.preventDefault()}
                                >
                                  <Forward className="text-muted-foreground" />
                                  <span>Share Project</span>
                                </DropdownMenuItem>
                              }
                              defaultProjectId={item.id}
                            />
                            <DropdownMenuItem
                              onSelect={(e) => {
                                e.preventDefault();
                                setSelectedProjectId(item.id);
                                setOpenRenameDialog(true);
                              }}
                            >
                              <Pencil className="text-muted-foreground" />
                              <span>Rename Project</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onSelect={(e) => {
                                e.preventDefault();
                                setSelectedProjectForDelete(item.id);
                                setOpenDeleteDialog(true);
                              }}
                            >
                              <Trash2 className="text-muted-foreground" />
                              <span>Delete Project</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onSelect={(e) => {
                                e.preventDefault();
                                setSelectedProjectId(item.id);
                                setOpenManageTeamDialog(true);
                              }}
                            >
                              <Users className="text-muted-foreground" />
                              <span>Manage Team</span>
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

      <CreateProjectDialog
        open={openCreateDialog}
        onOpenChange={setOpenCreateDialog}
      />
      {selectedProjectId && (
        <RenameProjectDialog
          projectId={selectedProjectId}
          currentName={
            projects.find((p) => p.id === selectedProjectId)?.name || ""
          }
          open={openRenameDialog}
          onOpenChange={(open) => {
            setOpenRenameDialog(open);
            if (!open) setSelectedProjectId(null);
          }}
        />
      )}
      {selectedProjectForDelete && (
        <DeleteProjectDialog
          projectId={selectedProjectForDelete}
          projectName={
            projects.find((p) => p.id === selectedProjectForDelete)?.name || ""
          }
          open={openDeleteDialog}
          onOpenChange={(open) => {
            setOpenDeleteDialog(open);
            if (!open) setSelectedProjectForDelete(null);
          }}
        />
      )}
      {selectedProjectId && (
        <ManageTeamDialog
          projectId={selectedProjectId}
          teamMembers={
            projects.find((p) => p.id === selectedProjectId)?.team_members || []
          }
          open={openManageTeamDialog}
          onOpenChange={(open) => {
            setOpenManageTeamDialog(open);
            if (!open) setSelectedProjectId(null);
          }}
          onTeamMemberRemoved={() => {
            fetchProjects();
          }}
        />
      )}
    </SidebarGroup>
  );
}
