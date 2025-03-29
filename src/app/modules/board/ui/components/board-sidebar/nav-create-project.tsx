"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { useSidebarMobileClose } from "@/hooks/use-sidebar-mobile-close";
import { CreateProjectDialog } from "../board-dialog/create-project-dialog";

export function NavCreateProject() {
  const [open, setOpen] = useState(false);
  const handleMobileItemClick = useSidebarMobileClose();

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            size="lg"
            className="justify-center"
            onClick={() => {
              handleMobileItemClick();
              setOpen(true);
            }}
          >
            <Plus className="size-5" />
            <span className="text-sm font-medium">New Project</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>

      <CreateProjectDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
