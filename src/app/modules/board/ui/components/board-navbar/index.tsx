import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { UserAvatar } from "./user-avatar";
import { DynamicBreadcrumb } from "@/hooks/dynamic-breadcrumb";


export const BoardNavbar = () => {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4 flex-1">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <DynamicBreadcrumb />
        <div className="ml-auto flex items-center gap-2">
          <ModeToggle />
          <UserAvatar />
        </div>
      </div>
    </header>
  );
};
