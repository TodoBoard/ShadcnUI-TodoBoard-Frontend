import { AppSidebar } from "../components/board-sidebar/app-sidebar";
import { BoardNavbar } from "../components/board-navbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { BoardFooter } from "../components/board-footer";

interface BoardLayoutProps {
  children: React.ReactNode;
}

export const BoardLayout = ({ children }: BoardLayoutProps) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-col h-full">
          <BoardNavbar />
          <div className="flex-1 overflow-auto container">{children}</div>
          <BoardFooter />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};
