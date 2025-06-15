import { AppSidebar } from "../components/board-sidebar/app-sidebar";
import { BoardNavbar } from "../components/board-navbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

interface BoardLayoutProps {
  children: React.ReactNode;
}

export const BoardLayout = ({ children }: BoardLayoutProps) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <BoardNavbar />
        <div className="flex-1 overflow-y-auto overflow-x-hidden container">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
};
