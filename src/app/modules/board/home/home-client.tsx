"use client";

import { FolderIcon, Users } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectStats } from "@/app/modules/board/ui/components/home/project-stats";
import { Header } from "@/app/modules/board/ui/components/home/header";

export function Home() {
  return (
    <div className="space-y-6 pb-4 pt-2">
      <Header />
      <Tabs defaultValue="my-projects" className="w-full">
        <TabsList className="mb-4 md:w-auto w-full">
          <TabsTrigger
            value="my-projects"
            className="flex items-center gap-2 md:flex-none flex-1"
          >
            <FolderIcon className="h-4 w-4" />
            My Projects
          </TabsTrigger>
          <TabsTrigger
            value="invited-projects"
            className="flex items-center gap-2 md:flex-none flex-1"
          >
            <Users className="h-4 w-4" />
            Invited Projects
          </TabsTrigger>
        </TabsList>
        <ProjectStats />
      </Tabs>
    </div>
  );
}
