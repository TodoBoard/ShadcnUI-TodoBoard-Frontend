"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const [username, setUsername] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsername = () => {
      const storedUsername = localStorage.getItem("username");
      setUsername(storedUsername ?? "");
      setIsLoading(false);
    };

    fetchUsername();
  }, []);

  const renderWelcomeMessage = () => {
    if (isLoading) {
      return <Skeleton className="h-8 w-[250px]" />;
    }
    return <>Welcome back, {username} 👋</>;
  };

  return (
    <div className={`flex justify-between items-center ${className ?? ""}`}>
      <h1 className="font-bold text-2xl">{renderWelcomeMessage()}</h1>
      <Button
        className="flex items-center gap-2 shadow-none rounded-xl"
        aria-label="Create new project"
      >
        <PlusCircle className="h-4 w-4" />
        New Project
      </Button>
    </div>
  );
}
