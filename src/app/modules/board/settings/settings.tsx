"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Security } from "@/lib/api";
import { TwoFactorStatus } from "@/models/security";
import { TwoFactorSetupDialog } from "@/app/modules/board/settings/two-factor-setup-dialog";
import { TwoFactorDisableDialog } from "@/app/modules/board/settings/two-factor-disable-dialog";

export function Settings() {
  const [twoFactorStatus, setTwoFactorStatus] =
    useState<TwoFactorStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState<string>("");
  const [avatarId, setAvatarId] = useState<number | null>(null);
  const [showSetupDialog, setShowSetupDialog] = useState(false);
  const [showDisableDialog, setShowDisableDialog] = useState(false);

  useEffect(() => {
    const fetchTwoFactorStatus = async () => {
      try {
        const status = await Security.getTwoFactorStatus();
        setTwoFactorStatus(status);
      } catch (error) {
        
      } finally {
        setIsLoading(false);
      }
    };

    const storedUsername = localStorage.getItem("username");
    const storedAvatarId = localStorage.getItem("avatar_id");
    if (storedUsername) {
      setUsername(storedUsername);
    }
    if (storedAvatarId) {
      setAvatarId(parseInt(storedAvatarId));
    }

    fetchTwoFactorStatus();
  }, []);

  const getTwoFactorBadge = () => {
    if (isLoading) return null;
    if (!twoFactorStatus) return null;

    if (twoFactorStatus.enabled) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          2FA enabled
        </span>
      );
    }

    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
        2FA not enabled
      </span>
    );
  };

  const handleTwoFactorClick = () => {
    if (twoFactorStatus?.enabled) {
      setShowDisableDialog(true);
    } else {
      setShowSetupDialog(true);
    }
  };

  const handleSetupSuccess = async () => {
    const status = await Security.getTwoFactorStatus();
    setTwoFactorStatus(status);
  };

  const getTwoFactorButton = () => {
    if (isLoading) return null;
    if (!twoFactorStatus) return null;

    if (twoFactorStatus.enabled) {
      return (
        <Button
          variant="destructive"
          className="ml-auto shadow-none rounded-lg"
          onClick={handleTwoFactorClick}
        >
          Disable 2FA
        </Button>
      );
    }

    return (
      <Button
        className="ml-auto shadow-none rounded-lg"
        onClick={handleTwoFactorClick}
      >
        Setup 2FA
      </Button>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-x-6">
        <Avatar className="h-20 w-20">
          {avatarId !== null && (
            <AvatarImage
              src={`/user/avatar/${avatarId}.png`}
              alt="User avatar"
            />
          )}
          <AvatarFallback>
            {username
              .split(" ")
              .map((word) => word[0])
              .join("")
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="space-y-1">
          <h2 className="text-xl font-semibold">{username}</h2>
          {getTwoFactorBadge()}
        </div>

        {getTwoFactorButton()}
      </div>

      <TwoFactorSetupDialog
        open={showSetupDialog}
        onOpenChange={setShowSetupDialog}
        onSuccess={handleSetupSuccess}
      />

      <TwoFactorDisableDialog
        open={showDisableDialog}
        onOpenChange={setShowDisableDialog}
        onSuccess={handleSetupSuccess}
      />
    </div>
  );
}
