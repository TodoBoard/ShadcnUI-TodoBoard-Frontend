import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { UserAvatar } from "./user-avatar";
import { DynamicBreadcrumb } from "@/hooks/dynamic-breadcrumb";

export const BoardNavbar = () => {
  return (
    <header className="flex sticky top-0 z-50 bg-background h-14 shrink-0 items-center gap-2">
      <div className="flex items-center gap-2 px-4 flex-1">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <DynamicBreadcrumb />
        <div className="ml-auto flex items-center gap-2">
          <ModeToggle />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <UserAvatar />
        </div>
      </div>
    </header>
  );
};
