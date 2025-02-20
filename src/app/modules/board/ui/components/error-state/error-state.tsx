import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import Link from "next/link";

interface ErrorStateProps {
  title: string;
  message?: string;
}

export function ErrorState({ title, message }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-6 space-y-4">
      <div className="flex justify-center">
        <Image
          src="/404/404.png"
          alt="Error occurred"
          width={300}
          height={300}
          className="opacity-90"
        />
      </div>
      <div className="space-y-2 text-center">
        <h3 className="text-xl font-semibold">{title}</h3>
        {message && <p className="text-muted-foreground text-sm">{message}</p>}
      </div>
      <Link href="/board/home">
        <Button size="lg" className="flex items-center gap-2 rounded-xl">
          <Home className="w-4 h-4" />
          Back to Home
        </Button>
      </Link>
    </div>
  );
}
