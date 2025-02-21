import { HomeNavbar } from "@/app/modules/home/navbar";
import { HomeFooter } from "@/app/modules/home/footer";

interface HomeLayoutProps {
  children: React.ReactNode;
}

export const HomeLayout = ({ children }: HomeLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <HomeNavbar />
      <div className="homepage-container flex-grow">
        {children}
      </div>
      <HomeFooter />
    </div>
  );
};
