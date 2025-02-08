"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const id = React.useId();

  const handleChange = (checked: boolean) => {
    setTheme(checked ? "dark" : "light");
  };

  return (
    <div>
      <div className="relative inline-grid h-7 grid-cols-[1fr_1fr] items-center text-sm font-medium">
        <Switch
          id={id}
          checked={theme === "dark"}
          onCheckedChange={handleChange}
          className="peer absolute inset-0 h-[inherit] w-auto data-[state=checked]:bg-input/50 data-[state=unchecked]:bg-input/50 [&_span]:h-full [&_span]:w-1/2 [&_span]:transition-transform [&_span]:duration-300 [&_span]:[transition-timing-function:cubic-bezier(0.16,1,0.3,1)] data-[state=checked]:[&_span]:translate-x-full rtl:data-[state=checked]:[&_span]:-translate-x-full shadow-none [&_span]:shadow-none"
        />
        <span className="pointer-events-none relative ms-0.5 flex min-w-6 items-center justify-center text-center peer-data-[state=checked]:text-muted-foreground/70">
          <Moon size={14} strokeWidth={2} aria-hidden="true" />
        </span>
        <span className="pointer-events-none relative me-0.5 flex min-w-6 items-center justify-center text-center peer-data-[state=unchecked]:text-muted-foreground/70">
          <Sun size={14} strokeWidth={2} aria-hidden="true" />
        </span>
      </div>
      <Label htmlFor={id} className="sr-only">
        Toggle theme
      </Label>
    </div>
  );
}
