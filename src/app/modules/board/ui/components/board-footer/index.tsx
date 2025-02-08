import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

export const BoardFooter = () => {
  return (
    <footer>
      <div className="flex h-full items-center justify-center px-4 mb-8">
        <div className="relative w-full max-w-2xl">
          <Input
            className="h-10 bg-background pl-12 text-sm shadow-none"
            placeholder="Add task"
          />
          <Button
            size="icon"
            variant="ghost"
            className="absolute left-1 top-1/2 h-8 w-8 -translate-y-1/2"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </footer>
  );
};
