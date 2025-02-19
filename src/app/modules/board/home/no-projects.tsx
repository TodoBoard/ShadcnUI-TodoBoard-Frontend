import Image from "next/image";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { CreateProjectDialog } from "../ui/components/board-dialog/create-project-dialog";

export function NoProjects() {
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <>
      <div className="flex flex-col items-center justify-center py-6 space-y-4">
        <div className="flex justify-center">
          <Image
            src="/board/nothing-to-do.png"
            alt="No projects"
            width={300}
            height={300}
            className="opacity-90"
          />
        </div>
        <div className="space-y-2 text-center">
          <h3 className="text-xl font-semibold">No Projects Yet</h3>
          <p className="text-muted-foreground text-sm">
            You haven't created or been invited to any projects.
          </p>
        </div>
        <Button
          size="lg"
          className="flex items-center gap-2 rounded-xl"
          onClick={() => setOpenDialog(true)}
        >
          <PlusCircle className="w-4 h-4" />
          Create Your First Project
        </Button>
      </div>

      <CreateProjectDialog open={openDialog} onOpenChange={setOpenDialog} />
    </>
  );
}
