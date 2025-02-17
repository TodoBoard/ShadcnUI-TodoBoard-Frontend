"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, LogOut, Settings } from "lucide-react";
import { Auth } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export const UserAvatar = () => {
  const router = useRouter();
  const [username, setUsername] = useState<string>("");
  const [avatarId, setAvatarId] = useState<number | null>(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedAvatarId = localStorage.getItem("avatar_id");
    if (storedUsername) {
      setUsername(storedUsername);
    }
    if (storedAvatarId) {
      setAvatarId(parseInt(storedAvatarId));
    }
  }, []);

  const handleLogout = () => {
    Auth.logout();
    router.push("/auth/login");
  };

  const handleNotificationsClick = () => {
    router.push("/board/notifications");
  };

  const handleSettingsClick = () => {
    router.push("/board/settings");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="relative cursor-pointer">
          <Avatar className="h-9 w-9">
            {avatarId !== null && (
              <AvatarImage
                src={`/user/avatar/${avatarId}.png`}
                alt="Unknown Avatar"
              />
            )}
            <AvatarFallback>UK</AvatarFallback>
          </Avatar>

          <span className="absolute -end-0.5 -top-0.5">
            <span className="sr-only">Verified</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                className="fill-background"
                d="M3.046 8.277A4.402 4.402 0 0 1 8.303 3.03a4.4 4.4 0 0 1 7.411 0 4.397 4.397 0 0 1 5.19 3.068c.207.713.23 1.466.067 2.19a4.4 4.4 0 0 1 0 7.415 4.403 4.403 0 0 1-3.06 5.187 4.398 4.398 0 0 1-2.186.072 4.398 4.398 0 0 1-7.422 0 4.398 4.398 0 0 1-5.257-5.248 4.4 4.4 0 0 1 0-7.437Z"
              />
              <path
                className="fill-primary"
                d="M4.674 8.954a3.602 3.602 0 0 1 4.301-4.293 3.6 3.6 0 0 1 6.064 0 3.598 3.598 0 0 1 4.3 4.302 3.6 3.6 0 0 1 0 6.067 3.6 3.6 0 0 1-4.29 4.302 3.6 3.6 0 0 1-6.074 0 3.598 3.598 0 0 1-4.3-4.293 3.6 3.6 0 0 1 0-6.085Z"
              />
              <path
                className="fill-background"
                d="M15.707 9.293a1 1 0 0 1 0 1.414l-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 1 1 1.414-1.414L11 12.586l3.293-3.293a1 1 0 0 1 1.414 0Z"
              />
            </svg>
          </span>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              {avatarId !== null && (
                <AvatarImage
                  src={`/user/avatar/${avatarId}.png`}
                  alt="Unknown Avatar"
                />
              )}
              <AvatarFallback>UK</AvatarFallback>
            </Avatar>
            <p className="text-sm font-medium">{username}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={handleNotificationsClick} className="gap-3 cursor-pointer">
            <Bell className="h-4 w-4" />
            <div className="flex flex-col space-y-1 leading-none">
              <p>Notifications</p>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleSettingsClick} className="gap-3 cursor-pointer">
            <Settings className="h-4 w-4" />
            <div className="flex flex-col space-y-1 leading-none">
              <p>Settings</p>
            </div>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleLogout} 
          className="text-red-600 gap-3 cursor-pointer focus:text-red-600 focus:bg-red-50"
        >
          <LogOut className="h-4 w-4" />
          <div className="flex flex-col space-y-1 leading-none">
            <p>Sign out</p>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
