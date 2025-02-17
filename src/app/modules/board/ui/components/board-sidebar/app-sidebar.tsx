"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Search, Home, UserPlus, Settings } from "lucide-react";
import { useEffect } from "react";
import { formatProjects } from "@/utils/format-projects";
import { NavMyProjects } from "./nav-my-projects";
import { NavInvitedProjects } from "./nav-invited-projects";
import { NavCreateProject } from "./nav-create-project";
import { NavLogo } from "./nav-logo";
import { NavMain } from "./nav-main";
import { NavInvitePeopleDialog } from "../board-dialog/invite-people-dialog";
import { SearchDialog } from "../board-dialog/search-dialog";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { useNotificationsStore } from "@/store/notifications";
import { useProjectsStore } from "@/store/projects";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";

const mainNavItems = [//TODO
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
  const {
    loading,
    error,
    errorMessage,
    myProjects,
    invitedProjects,
    fetchProjects,
  } = useProjectsStore();
  const { unreadCount, setUnreadCount } = useNotificationsStore();

  useEffect(() => {
    const fetch = async () => {
      await fetchProjects();
      // Hier müssen wir die notifications count anders bekommen
      // Entweder über einen separaten API call oder der Projects endpoint
      // muss die count weiterhin zurückgeben
    };

    fetch();
  }, [fetchProjects]);

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
                projects={formatProjects(myProjects, "my-projects", pathname)}
              />
              <NavInvitedProjects
                projects={formatProjects(
                  invitedProjects,
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
