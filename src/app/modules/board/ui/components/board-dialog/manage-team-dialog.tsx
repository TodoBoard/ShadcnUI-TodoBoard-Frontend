"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Users, Loader2, UserMinus, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Projects } from "@/lib/api";
import { TeamMember } from "@/models/projects";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ManageTeamDialogProps {
  projectId: string;
  teamMembers: TeamMember[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTeamMemberRemoved: () => void;
}

export function ManageTeamDialog({
  projectId,
  teamMembers,
  open,
  onOpenChange,
  onTeamMemberRemoved,
}: ManageTeamDialogProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const handleRemoveMember = async (member: TeamMember) => {
    setIsLoading(member.id);
    try {
      await Projects.removeTeamMember(projectId, member.id);
      toast.success(`${member.username} was removed from the project`);
      onTeamMemberRemoved();
    } catch (error: any) {
      toast.error(error.message || "Failed to remove team member");
    } finally {
      setIsLoading(null);
    }
  };

  const dialogContent = (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-muted-foreground">
          Team Members ({teamMembers.length})
        </h3>
        <p className="text-sm text-muted-foreground/60">
          Manage your project team members and their access.
        </p>
      </div>

      <ScrollArea className="h-[400px] -mx-6 px-6">
        <div className="space-y-4">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="group flex items-center justify-between p-3 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={`/user/avatar/${member.avatar_id}.png`}
                      alt={member.username}
                    />
                    <AvatarFallback>
                      {member.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {member.username === "You" && (
                    <span className="absolute -end-1 -top-1">
                      <span className="sr-only">Project Owner</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
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
                  )}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">
                      {member.username}
                    </span>
                    {member.username === "You" && (
                      <Badge
                        variant="default"
                        className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                      >
                        Project Owner
                      </Badge>
                    )}
                  </div>
                  {member.username === "You" ? (
                    <p className="text-xs text-muted-foreground">
                      Full access to project settings and management
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Can view and edit project content
                    </p>
                  )}
                </div>
              </div>
              {member.username !== "You" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveMember(member)}
                  disabled={isLoading !== null}
                  className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground"
                >
                  {isLoading === member.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <UserMinus className="h-4 w-4 mr-2" />
                      <span>Remove</span>
                    </>
                  )}
                </Button>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <div className="flex items-center gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Users className="size-6 text-primary" />
              </div>
              <div className="flex-1">
                <DrawerTitle>Team Members</DrawerTitle>
                <DrawerDescription>Manage your project team</DrawerDescription>
              </div>
            </div>
          </DrawerHeader>
          <div className="px-4 pb-4">{dialogContent}</div>
          <DrawerFooter className="pt-2">
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <Users className="size-6 text-primary" />
            </div>
            <div className="flex-1">
              <DialogTitle>Team Members</DialogTitle>
              <DialogDescription>Manage your project team</DialogDescription>
            </div>
          </div>
        </DialogHeader>
        {dialogContent}
      </DialogContent>
    </Dialog>
  );
}
