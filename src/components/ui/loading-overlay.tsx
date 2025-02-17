import { AlertCircle, CalendarCheck2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingOverlayProps {
  className?: string;
  error?: boolean;
  errorMessage?: string;
}

export function LoadingOverlay({
  className,
  error,
  errorMessage,
}: LoadingOverlayProps) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background",
        className
      )}
    >
      <div className="flex flex-col items-center gap-8">
        <div className="relative flex items-center justify-center">
          <div
            className={cn(
              "absolute size-16 animate-pulse rounded-full",
              error ? "bg-destructive/10" : "bg-primary/10"
            )}
          />

          {error ? (
            <AlertCircle className="relative size-10 text-destructive" />
          ) : (
            <CalendarCheck2 className="relative size-10 text-primary" />
          )}

          <div className="absolute -inset-3">
            <div
              className={cn(
                "h-full w-full animate-spin rounded-full border-[3px]",
                error
                  ? "border-destructive/30 border-t-destructive"
                  : "border-primary/30 border-t-primary"
              )}
              style={{ animationDuration: "1.2s" }}
            />
          </div>
        </div>

        {error && (
          <div className="text-center text-sm text-destructive">
            {errorMessage}
          </div>
        )}

        <div className="relative">
          <div className="flex items-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={cn(
                  "h-1.5 w-1.5 rounded-full bg-gradient-to-r animate-scale-pulse",
                  error
                    ? "from-destructive/80 to-destructive"
                    : "from-primary/80 to-primary"
                )}
                style={{
                  animationDelay: `${i * 150}ms`,
                  animationDuration: "1s",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
