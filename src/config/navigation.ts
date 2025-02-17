import { 
  Home,
  Bell,
  UserPlus,
  Settings,
  Search,
  type LucideIcon
} from "lucide-react";
import * as React from "react";
import { SearchDialog } from "@/app/modules/board/ui/components/board-dialog/search-dialog";
import { NavInvitePeopleDialog } from "@/app/modules/board/ui/components/board-dialog/invite-people-dialog";

export interface NavigationItem {
  title: string;
  icon: LucideIcon;
  url?: string;
  shortcut?: string;
  dialog?: boolean;
  dialogComponent?: (trigger: React.ReactNode) => React.ReactElement;
}

export const mainNavItems: NavigationItem[] = [
  {
    title: "Search",
    icon: Search,
    shortcut: "K",
    dialog: true,
    dialogComponent: (trigger: React.ReactNode) => React.createElement(SearchDialog, {
      triggerContent: trigger,
      shortcut: "K"
    })
  },
  {
    title: "Home",
    icon: Home,
    url: "/board/home"
  },
  {
    title: "Notifications",
    icon: Bell,
    url: "/board/notifications"
  },
  {
    title: "Invite People",
    icon: UserPlus,
    shortcut: "I",
    dialog: true,
    dialogComponent: (trigger: React.ReactNode) => React.createElement(NavInvitePeopleDialog, {
      triggerContent: trigger,
      shortcut: "I"
    })
  },
  {
    title: "Settings",
    icon: Settings,
    url: "/board/settings"
  }
]; 