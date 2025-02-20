"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { CreateProjectDialog } from "@/app/modules/board/ui/components/board-dialog/create-project-dialog";

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const [username, setUsername] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);

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
    <>
      <div className={`flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center ${className ?? ""}`}>
        <h1 className="font-bold text-2xl">{renderWelcomeMessage()}</h1>
        <Button
          className="w-full sm:w-auto flex items-center justify-center gap-2 shadow-none rounded-xl"
          onClick={() => setOpenDialog(true)}
        >
          <PlusCircle className="h-4 w-4" />
          New Project
        </Button>
      </div>

      <CreateProjectDialog open={openDialog} onOpenChange={setOpenDialog} />
    </>
  );
}
