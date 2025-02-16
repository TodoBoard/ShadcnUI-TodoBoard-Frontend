"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export function Header() {
  const username = localStorage.getItem("username");

  return (
    <div className="flex justify-between items-center">
      <h1 className="font-bold text-2xl">Welcome back, {username} 👋</h1>
      <Button className="flex items-center gap-2 shadow-none rounded-xl">
        <PlusCircle className="h-4 w-4" />
        New Project
      </Button>
    </div>
  );
}
