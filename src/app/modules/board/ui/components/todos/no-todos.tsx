import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export function NoTodos() {
  return (
    <div className="flex flex-col items-center justify-center py-6 space-y-4">
      <div className="flex justify-center">
        <Image
          src="/board/nothing-to-do.png"
          alt="No todos"
          width={300}
          height={300}
          className="opacity-90"
        />
      </div>
      <div className="space-y-2 text-center">
        <h3 className="text-xl font-semibold">No Todos Yet</h3>
        <p className="text-muted-foreground text-sm">
          Create tasks in your projects!
        </p>
      </div>
      <Link href="/board/home">
        <Button size="lg" className="flex items-center gap-2 rounded-xl">
          <ArrowLeft className="w-4 h-4" />
          Go to Home
        </Button>
      </Link>
    </div>
  );
}
