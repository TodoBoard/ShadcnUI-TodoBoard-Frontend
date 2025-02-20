import ProjectsClient from "@/app/modules/board/projects/projects-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "TodoBoard | My Projects",
  description: "My projects page",
};

export default function MyProjectsPage() {
  return <ProjectsClient />;
}
