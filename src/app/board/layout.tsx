import { BoardLayout } from "@/app/modules/board/ui/layouts/board-layout";


interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <BoardLayout>
      {children}
    </BoardLayout>
  );
};


export default Layout;
