"use client";
import { ChevronsRight, Menu, CalendarCheck2 } from "lucide-react";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import React from "react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ModeToggle } from "@/components/ui/mode-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const HomeNavbar = () => {
  return (
    <header className="homepage-container shadow-inner bg-opacity-15 w-[90%] md:w-[70%] lg:w-[75%] lg:max-w-screen-xl top-5 mx-auto sticky border border-secondary z-40 rounded-2xl flex justify-between items-center p-2 bg-card">
      <Link href="/" className="font-bold text-lg flex items-center">
        <div className="bg-gradient-to-tr border-secondary from-primary via-primary/70 to-primary rounded-lg w-9 h-9 mr-2 border text-white flex items-center justify-center">
          <CalendarCheck2 className="text-white w-5 h-5" />
        </div>
        TodoBoard
      </Link>
      <div className="flex items-center lg:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Menu className="cursor-pointer lg:hidden" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <Link
                href="https://github.com/TodoBoard"
                target="_blank"
                className="flex items-center gap-2 w-full"
              >
                <GitHubLogoIcon className="w-4 h-4" />
                GitHub
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href="/auth/login"
                className="flex items-center gap-2 w-full text-primary"
              >
                <ChevronsRight className="w-5 h-5" />
                Login
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <ModeToggle />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="hidden lg:flex items-center">
        <ModeToggle />
        <Separator orientation="vertical" className="mx-2 h-6" />
        <Button
          asChild
          variant="ghost"
          className="hover:bg-transparent flex items-center gap-2 px-4"
        >
          <Link
            aria-label="View on GitHub"
            href="https://github.com/TodoBoard"
            target="_blank"
            className="flex items-center gap-2"
          >
            <GitHubLogoIcon className="w-5 h-5" />
            <span className="hidden sm:inline">GitHub</span>
          </Link>
        </Button>

        <Separator orientation="vertical" className="mx-2 h-6" />

        <Button asChild className="gap-2 px-4 rounded-xl">
          <Link
            aria-label="Login"
            href="/auth/login"
            className="flex items-center gap-2"
          >
            <span>Login</span>
            <ChevronsRight className="w-5 h-5" />
          </Link>
        </Button>
      </div>
    </header>
  );
};
