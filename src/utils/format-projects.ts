import { Project } from "@/models/projects";
import { Folder } from "lucide-react";

export const slugify = (text: string) => {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "");
};

export const formatProjects = (
  projects: Project[] = [],
  type: "my-projects" | "invited-projects",
  currentPath?: string
) =>
  projects.map((project, index) => {
    const slugName = slugify(project.name);
    const projectUrl = `/board/projects/${type}/${slugName}-id=${project.id}`;
    return {
      name: project.name,
      url: projectUrl,
      icon: Folder,
      id: project.id,
      key: `${type}-${project.id}-${index}`,
      team_members: project.team_members,
      isActive: currentPath === projectUrl,
    };
  });
