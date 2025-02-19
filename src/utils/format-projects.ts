import { Project } from "@/models/projects";
import { Folder } from "lucide-react";

// Neue Helper-Funktion zum Slugifizieren des Projektnamens
export const slugify = (text: string) => {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-") // ersetzt Leerzeichen durch Bindestriche
    .replace(/[^a-z0-9\-]/g, ""); // entfernt Sonderzeichen
};

export const formatProjects = (
  projects: Project[] = [],
  type: "my-projects" | "invited-projects",
  currentPath?: string
) =>
  projects.map((project, index) => {
    // Verwende slugify, um den Projektnamen sauber zu formatieren
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
