import { Metadata } from "next";
import { Home } from "@/app/modules/board/home/home-client";

export const metadata: Metadata = {
  title: "TodoBoard | Home",
  description: "Home page",
};

export default function BoardHomePage() {
  return <Home />;
}