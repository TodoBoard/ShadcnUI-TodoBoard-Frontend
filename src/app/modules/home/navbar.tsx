import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { CalendarCheck2 } from "lucide-react";
import { GitHubLogoIcon } from "@radix-ui/react-icons";

export function HomeNavbar() {
  return (
    <header className="z-[50] sticky top-0 w-full bg-background/95 backdrop-blur-sm border-border/40">
      <div className="homepage-container h-14 flex items-center justify-between">
        <Link
          href="/"
          className="flex justify-start items-center hover:opacity-85 transition-opacity duration-300"
        >
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground mr-3">
            <CalendarCheck2 className="size-5" />
          </div>
          <span className="text-xl font-bold sm:block hidden">TodoBoard</span>
        </Link>

        <div className="flex items-center gap-2">
          <ModeToggle />
          <Button
            asChild
            variant="outline"
            size="icon"
            className="rounded-xl shadow-none"
          >
            <Link
              href="https://github.com/TodoBoard"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GitHubLogoIcon className="size-5" />
            </Link>
          </Button>
          <Button asChild className="text-white rounded-xl shadow-none">
            <Link href="/auth/login">Login</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
