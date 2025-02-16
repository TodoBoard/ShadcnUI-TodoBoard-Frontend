import { FolderIcon, Users } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectStats } from "@/app/modules/board/home/project-stats";
import { Header } from "@/app/modules/board/home/header";

export default function BoardHomePage() {
  return (
    <div className="space-y-6">
      <Header />
      <Tabs defaultValue="my-projects" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="my-projects" className="flex items-center gap-2">
            <FolderIcon className="h-4 w-4" />
            My Projects
          </TabsTrigger>
          <TabsTrigger
            value="invited-projects"
            className="flex items-center gap-2"
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
