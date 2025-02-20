import { Projects } from "@/app/modules/board/projects/projects-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "TodoBoard | Invited Projects",
  description: "Invited projects page",
};

export default function InvitedProjectsPage() {
  return <Projects/>;
}

