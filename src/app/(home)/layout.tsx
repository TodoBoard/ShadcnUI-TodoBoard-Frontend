import { HomeLayout } from "@/app/modules/home/ui/layouts/home-layout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home | TodoBoard",
  description: "TodoBoard is a modern task management tool built with shadcn/ui, offering a sleek interface for organizing your tasks and boosting productivity.",
};

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <HomeLayout>
      {children}
    </HomeLayout>
  );
};

export default Layout;
