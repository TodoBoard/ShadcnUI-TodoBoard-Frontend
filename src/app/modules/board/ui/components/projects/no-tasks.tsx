import Image from "next/image";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface NoTasksProps {
  onAddTask: () => void;
}

export function NoTasks({ onAddTask }: NoTasksProps) {
  return (
    <div className="flex flex-col items-center justify-center py-6 space-y-4">
      <div className="flex justify-center">
        <Image
          src="/board/nothing-to-do.png"
          alt="No tasks"
          width={300}
          height={300}
          className="opacity-90"
        />
      </div>
      <div className="space-y-2 text-center">
        <h3 className="text-xl font-semibold">No Tasks Yet</h3>
        <p className="text-muted-foreground text-sm">Enjoy your free time!</p>
      </div>
      <Button
        size="lg"
        className="flex items-center gap-2 rounded-xl"
        onClick={onAddTask}
      >
        <PlusCircle className="w-4 h-4" />
        Create Your First Task
      </Button>
    </div>
  );
}
