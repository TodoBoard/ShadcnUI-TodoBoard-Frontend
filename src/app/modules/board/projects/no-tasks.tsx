import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export function NoTasks() {
  return (
    <div className="flex flex-col items-center justify-center py-10 space-y-6">
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
        <h3 className="text-2xl font-semibold">No Tasks Yet</h3>
        <p className="text-muted-foreground">
          Enjoy your free time!
        </p>
      </div>
      <Link href="/board/projects/new">
        <Button size="lg" className="flex items-center gap-2 rounded-xl">
          <PlusCircle className="w-4 h-4" />
          Create Your First Task
        </Button>
      </Link>
    </div>
  );
}
