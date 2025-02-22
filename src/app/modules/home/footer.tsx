import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CalendarCheck2 } from "lucide-react";
import { GitHubLogoIcon } from "@radix-ui/react-icons";

export function HomeFooter() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t border-border/40 bg-background/95 backdrop-blur-sm homepage-container">
      <div className="py-8 sm:py-4">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col items-center sm:items-start gap-4">
            <Link
              href="/"
              className="flex items-center hover:opacity-85 transition-opacity duration-300"
            >
              <div className="flex aspect-square size-8 sm:size-6 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground mr-3 sm:mr-2">
                <CalendarCheck2 className="size-5 sm:size-4" />
              </div>
              <span className="text-xl sm:text-base font-bold">TodoBoard</span>
            </Link>

            <div className="flex flex-col items-center sm:items-start gap-2">
              <span className="text-sm text-muted-foreground">
                © {currentYear} TodoBoard
              </span>
              <Link
                href="/terms"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Terms | Services
              </Link>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="gap-2 hover:bg-transparent hover:opacity-75"
            >
              <Link
                href="https://github.com/TodoBoard"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center"
              >
                <GitHubLogoIcon className="size-4" />
                <span>View on GitHub</span>
              </Link>
            </Button>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>💜</span>
              <span>Theo & Konrad</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
