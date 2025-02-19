"use client";

import {
  type LucideIcon,
  Plus,
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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const { leaveProject } = useProjectsStore();

  const handleLeaveProject = async (projectId: string, projectName: string) => {
    const id = projectId.split("-").slice(-5).join("-");
    try {
      await leaveProject(id);
      toast.success(`Left project ${projectName} successfully`);
    } catch (error) {
      toast.error("Failed to leave project");
    }
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
        <SidebarMenu>
          {projects.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton asChild>
                <Link
                  href={item.url}
                  className={cn({
                    "bg-sidebar-accent": pathname === item.url,
                    "text-sidebar-primary": pathname === item.url,
                    "text-muted-foreground": pathname !== item.url,
                    "flex items-center gap-2 p-2 rounded": true,
                  })}
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
                    onClick={() => handleLeaveProject(item.id, item.name)}
                    className="cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>Leave Project</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      )}
    </SidebarGroup>
  );
}
