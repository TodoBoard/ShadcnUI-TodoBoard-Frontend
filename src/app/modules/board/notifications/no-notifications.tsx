import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export function NoNotifications() {
  return (
    <div className="flex flex-col items-center justify-center py-6 space-y-4">
      <div className="flex justify-center">
        <Image
          src="/board/nothing-to-do.png"
          alt="No notifications"
          width={300}
          height={300}
          className="opacity-90"
        />
      </div>
      <div className="space-y-2 text-center">
        <h3 className="text-xl font-semibold">No Notifications Yet</h3>
        <p className="text-muted-foreground text-sm">You're all caught up!</p>
      </div>
      <Link href="/board/home">
        <Button size="lg" className="flex items-center gap-2 rounded-xl">
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </Button>
      </Link>
    </div>
  );
}
