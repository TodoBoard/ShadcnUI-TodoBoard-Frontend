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
} from "lucide-react";

import { NavMyProjects } from "./nav-my-projects";
import { NavInvitedProjects } from "./nav-invited-projects";
import { NavUser } from "./nav-user";
import { NavLogo } from "./nav-logo";
import { NavMain } from "./nav-main";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  projects: [
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
      url: "#",
      icon: Map,
    },
  ],
};

// Add this new mainNavItems configuration
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
        <NavMyProjects projects={data.projects} />
        <NavInvitedProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
