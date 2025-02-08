"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import {
  Frame,
  Map,
  PieChart,
  Search,
  CalendarCheck,
  Home,
  UserPlus,
} from "lucide-react";

import { NavMyProjects } from "./nav-my-projects";
import { NavInvitedProjects } from "./nav-invited-projects";
import { NavCreateProject } from "./nav-create-project";
import { NavLogo } from "./nav-logo";
import { NavMain } from "./nav-main";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  myProjects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "/board/projects/my-projects/travel",
      icon: Map,
    },
  ],
  invitedProjects: [
    {
      name: "Travel",
      url: "/board/projects/invited-projects/travel",
      icon: Map,
    },
  ],
};

const mainNavItems = [
  {
    title: "Search",
    url: "/board/search",
    icon: Search,
  },
  {
    title: "Home",
    url: "/board/home",
    icon: Home,
  },
  {
    title: "Invite People",
    url: "/board/invite",
    icon: UserPlus,
  },
  {
    title: "Today's Todos",
    url: "/board/today",
    icon: CalendarCheck,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  const navItemsWithActive = mainNavItems.map((item) => ({
    ...item,
    isActive: pathname === item.url,
  }));

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <NavLogo />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItemsWithActive} />
        <NavMyProjects projects={data.myProjects} />
        <NavInvitedProjects projects={data.invitedProjects} />
      </SidebarContent>
      <SidebarFooter>
        <NavCreateProject />
      </SidebarFooter>
    </Sidebar>
  );
}
