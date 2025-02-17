"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Search, Home, UserPlus, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { formatProjects } from "@/utils/format-projects";
import { NavMyProjects } from "./nav-my-projects";
import { NavInvitedProjects } from "./nav-invited-projects";
import { NavCreateProject } from "./nav-create-project";
import { NavLogo } from "./nav-logo";
import { NavMain } from "./nav-main";
import { NavInvitePeopleDialog } from "../board-dialog/invite-people-dialog";
import { SearchDialog } from "../board-dialog/search-dialog";
import { Projects } from "@/lib/api";
import { ProjectListResponse } from "@/models/projects";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { handleApiError } from "@/lib/api";
import { useNotificationsStore } from "@/store/notifications";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";

const mainNavItems = [
  {
    title: "Search",
    dialog: true,
    icon: Search,
    shortcut: "K",
    dialogComponent: function (triggerContent: React.ReactNode) {
      return (
        <SearchDialog
          triggerContent={triggerContent}
          shortcut={this.shortcut}
        />
      );
    },
  },
  {
    title: "Home",
    url: "/board/home",
    icon: Home,
  },
  {
    title: "Invite People",
    dialog: true,
    icon: UserPlus,
    shortcut: "I",
    dialogComponent: function (triggerContent: React.ReactNode) {
      return (
        <NavInvitePeopleDialog
          triggerContent={triggerContent}
          shortcut={this.shortcut}
        />
      );
    },
  },
  {
    title: "Settings",
    url: "/board/settings",
    icon: Settings,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const [projectData, setProjectData] = useState<ProjectListResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );
  const { unreadCount, setUnreadCount } = useNotificationsStore();

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError(false);
      try {
        const data = await Projects.getProjects();
        setProjectData(data);
        setUnreadCount(data.unread_notifications_count);
      } catch (error) {
        setError(true);
        const errorMessage = handleApiError(error);
        setErrorMessage(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [setUnreadCount]);

  const navItemsWithActive = mainNavItems.map((item) => ({
    ...item,
    isActive: pathname === item.url,
  }));

  return (
    <>
      {(loading || error) && (
        <LoadingOverlay error={error} errorMessage={errorMessage} />
      )}
      <Sidebar {...props}>
        <SidebarHeader>
          <NavLogo notificationCount={unreadCount} />
          <NavMain items={navItemsWithActive} />
        </SidebarHeader>
        <SidebarContent>
          {!loading && (
            <>
              <NavMyProjects
                projects={formatProjects(
                  projectData?.my_projects || [],
                  "my-projects",
                  pathname
                )}
              />
              <NavInvitedProjects
                projects={formatProjects(
                  projectData?.invited_projects || [],
                  "invited-projects",
                  pathname
                )}
              />
            </>
          )}
        </SidebarContent>
        <SidebarFooter>
          <NavCreateProject />
        </SidebarFooter>
      </Sidebar>
    </>
  );
}
