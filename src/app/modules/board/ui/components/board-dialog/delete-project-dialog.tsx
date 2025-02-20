import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Security } from "@/lib/api";
import { useProjectsStore } from "@/store/projects";
import { AlertTriangle, Loader2, Trash2, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface DeleteProjectDialogProps {
  projectId: string;
  projectName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteProjectDialog({
  projectId,
  projectName,
  open,
  onOpenChange,
}: DeleteProjectDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [code, setCode] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const deleteProject = useProjectsStore((state) => state.deleteProject);
  const isMobile = useIsMobile();

  const handleInitialConfirm = async () => {
    try {
      setIsLoading(true);
      const status = await Security.getTwoFactorStatus();

      if (status.enabled) {
        setShowOTPInput(true);
      } else {
        await handleDelete();
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to check 2FA status";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (showOTPInput && code.length !== 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }

    try {
      setIsLoading(true);
      await deleteProject(projectId, showOTPInput ? code : undefined);
      toast.success("Project deleted successfully");
      handleClose();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to delete project";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setShowOTPInput(false);
    setCode("");
    onOpenChange(false);
  };

  const dialogContent = (
    <>
      {!showOTPInput ? (
        <>
          <div className="space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-xl font-semibold">Delete Project</h2>
              <p className="text-muted-foreground">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-foreground">
                  {projectName}
                </span>
                ?
              </p>
            </div>
          </div>
          <div className="p-6 space-y-2 bg-muted/40 rounded-lg text-sm">
            <p className="font-medium text-foreground">This will:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Delete all project data permanently</li>
              <li>Remove all team members from the project</li>
              <li>Delete all tasks and their history</li>
              <li>Deactivate all project invites</li>
            </ul>
          </div>
        </>
      ) : (
        <>
          <div className="space-y-2 text-center">
            <h2 className="text-xl font-semibold">
              Two-Factor Authentication Required
            </h2>
            <p className="text-sm text-muted-foreground">
              Please enter the 6-digit code from your authenticator app to
              confirm deletion of{" "}
              <span className="font-medium">{projectName}</span>
            </p>
          </div>

          <div className="space-y-6">
            <InputOTP
              ref={inputRef}
              value={code}
              onChange={(value) => {
                if (/^\d*$/.test(value)) {
                  setCode(value);
                }
              }}
              maxLength={6}
              onComplete={handleDelete}
              containerClassName="group flex items-center justify-center has-[:disabled]:opacity-50"
              inputMode="numeric"
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
        </>
      )}

      <div className="flex flex-col gap-2 w-full">
        <Button
          onClick={showOTPInput ? handleDelete : handleInitialConfirm}
          disabled={isLoading || (showOTPInput && code.length !== 6)}
          variant="destructive"
          className="w-full"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>{showOTPInput ? "Deleting..." : "Checking..."}</span>
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              {showOTPInput ? (
                <>
                  <Trash2 className="h-4 w-4" />
                  <span>Confirm Deletion</span>
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  <span>Delete Project</span>
                </>
              )}
            </span>
          )}
        </Button>
        <Button
          variant="ghost"
          onClick={handleClose}
          disabled={isLoading}
          className="w-full"
        >
          <span className="flex items-center justify-center gap-2">
            <X className="h-4 w-4" />
            <span>Cancel</span>
          </span>
        </Button>
      </div>
    </>
  );

  if (!isMobile) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader className="space-y-4">
            <VisuallyHidden asChild>
              <DialogTitle>
                {showOTPInput ? "Enter 2FA Code" : "Delete Project"}
              </DialogTitle>
            </VisuallyHidden>
            {dialogContent}
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="sr-only">
          <DrawerTitle>
            {showOTPInput ? "Enter 2FA Code" : "Delete Project"}
          </DrawerTitle>
        </DrawerHeader>
        <div className="px-4 py-6 space-y-6">{dialogContent}</div>
      </DrawerContent>
    </Drawer>
  );
}
