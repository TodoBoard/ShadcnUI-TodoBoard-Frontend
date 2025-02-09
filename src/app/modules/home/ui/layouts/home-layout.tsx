import { Footer } from "../footer/footer";
import { Navbar } from "../header/navbar";

interface HomeLayoutProps {
  children: React.ReactNode;
}

export const HomeLayout = ({ children }: HomeLayoutProps) => {
  return (
    <div className="home-container">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
};
