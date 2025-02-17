"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Check,
  Copy,
  Mail,
  Link,
  UserRoundPlus,
  Share2,
  MessageSquare,
} from "lucide-react";
import { useId, useRef, useState, useEffect } from "react";
import { clientEnv } from "@/config/env";
import { Projects } from "@/lib/api";
import { Project } from "@/models/projects";
import { useProjectsStore } from "@/store/projects";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";

interface NavInvitePeopleDialogProps {
  triggerContent: React.ReactNode;
  shortcut?: string;
}

const shareOptions = [
  {
    icon: Mail,
    label: "Email",
    action: "mailto:?subject=Project Invitation&body=",
  },
  { icon: MessageSquare, label: "Message", action: "sms:?&body=" },
  { icon: Share2, label: "More", action: "share" },
];

interface InviteLinkSettings {
  duration: string;
  maxUses: number;
}

const defaultSettings: InviteLinkSettings = {
  duration: "7d",
  maxUses: 3,
};

const expirationOptions = [
  { value: "1d", label: "24 hours" },
  { value: "3d", label: "3 days" },
  { value: "7d", label: "7 days" },
  { value: "30d", label: "30 days" },
  { value: "100d", label: "100 days" },
];

const usageOptions = [
  { value: 1, label: "1 use" },
  { value: 3, label: "3 uses" },
  { value: 5, label: "5 uses" },
  { value: 10, label: "10 uses" },
];

export function NavInvitePeopleDialog({
  triggerContent,
  shortcut,
}: NavInvitePeopleDialogProps) {
  const id = useId();
  const [open, setOpen] = useState<boolean>(false);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [settings, setSettings] = useState<InviteLinkSettings>(defaultSettings);
  const inputRef = useRef<HTMLInputElement>(null);
  const [inviteLink, setInviteLink] = useState<string>("");
  const isMobile = useIsMobile();

  const { myProjects, loading } = useProjectsStore();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (
        shortcut &&
        e.key.toLowerCase() === shortcut.toLowerCase() &&
        (e.metaKey || e.ctrlKey)
      ) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [shortcut]);

  const generateInviteLink = async () => {
    if (!selectedProject) return;

    try {
      const response = await Projects.createInvite(selectedProject, {
        duration: settings.duration,
        max_usage: settings.maxUses,
      });

      const link = `${clientEnv.inviteUrl}${response.id}`;
      setInviteLink(link);
    } catch (error) {
      console.error("Failed to generate invite link:", error);
      // Here you might want to show an error message to the user
    }
  };

  const handleCopy = () => {
    if (inputRef.current) {
      navigator.clipboard.writeText(inputRef.current.value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const handleShare = async (action: string) => {
    const link = inviteLink;
    if (!link) return;

    if (action === "share" && navigator.share) {
      try {
        await navigator.share({
          title: "Project Invitation",
          text: "Join our project on OriginUI",
          url: link,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else if (action.startsWith("mailto:") || action.startsWith("sms:")) {
      window.location.href = `${action}${encodeURIComponent(link)}`;
    }
  };

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      // Reset state when dialog is closed
      setInviteLink("");
      setSelectedProject("");
      setSettings(defaultSettings);
      setCopied(false);
    }
  };

  const dialogContent = (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <div
          className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10"
          aria-hidden="true"
        >
          <UserRoundPlus className="text-primary" size={20} strokeWidth={2} />
        </div>
        <DialogHeader className="flex-1">
          <DialogTitle>Invite team members</DialogTitle>
          <DialogDescription>
            Create and share an invite link with your teammates
          </DialogDescription>
        </DialogHeader>
      </div>

      <div className="space-y-6">
        {!inviteLink ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="project-select">Project</Label>
              <Select
                value={selectedProject}
                onValueChange={setSelectedProject}
                disabled={loading}
              >
                <SelectTrigger id="project-select">
                  <SelectValue
                    placeholder={loading ? "Loading..." : "Choose a project"}
                  />
                </SelectTrigger>
                <SelectContent>
                  {myProjects.map((project: Project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="expiration">Link expiration</Label>
                <Select
                  value={settings.duration}
                  onValueChange={(value) =>
                    setSettings({ ...settings, duration: value })
                  }
                >
                  <SelectTrigger id="expiration">
                    <SelectValue placeholder="Select expiration" />
                  </SelectTrigger>
                  <SelectContent>
                    {expirationOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="usage">Maximum uses</Label>
                <Select
                  value={settings.maxUses.toString()}
                  onValueChange={(value) =>
                    setSettings({ ...settings, maxUses: Number(value) })
                  }
                >
                  <SelectTrigger id="usage">
                    <SelectValue placeholder="Select usage limit" />
                  </SelectTrigger>
                  <SelectContent>
                    {usageOptions.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value.toString()}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={generateInviteLink}
              className="w-full"
              disabled={!selectedProject}
            >
              <Link className="mr-2 h-4 w-4" />
              Generate Invite Link
            </Button>
          </>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor={id}>Invite link</Label>
              <div className="relative">
                <Input
                  ref={inputRef}
                  id={id}
                  className="pe-9"
                  type="text"
                  value={inviteLink}
                  readOnly
                />
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={handleCopy}
                        className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center text-muted-foreground/80 transition-colors hover:text-foreground"
                        disabled={copied}
                      >
                        {copied ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {copied ? "Copied!" : "Copy to clipboard"}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Share via</Label>
              <div className="flex gap-2">
                {shareOptions.map(({ icon: Icon, label, action }) => (
                  <Button
                    key={label}
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleShare(action)}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (!isMobile) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <div onClick={() => setOpen(true)}>{triggerContent}</div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          {dialogContent}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerTrigger asChild>
        <div onClick={() => setOpen(true)}>{triggerContent}</div>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <div className="flex items-center gap-4 mb-2">
            <div
              className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10"
              aria-hidden="true"
            >
              <UserRoundPlus
                className="text-primary"
                size={20}
                strokeWidth={2}
              />
            </div>
            <div>
              <DrawerTitle>Invite team members</DrawerTitle>
              <DrawerDescription>
                Create and share an invite link with your teammates
              </DrawerDescription>
            </div>
          </div>
        </DrawerHeader>
        <div className="px-4 space-y-6">
          {!inviteLink ? (
            <>
              <div className="space-y-3">
                <Label htmlFor="project-select">Project</Label>
                <Select
                  value={selectedProject}
                  onValueChange={setSelectedProject}
                  disabled={loading}
                >
                  <SelectTrigger id="project-select">
                    <SelectValue
                      placeholder={loading ? "Loading..." : "Choose a project"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {myProjects.map((project: Project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-4">
                <div className="space-y-3">
                  <Label htmlFor="expiration">Link expiration</Label>
                  <Select
                    value={settings.duration}
                    onValueChange={(value) =>
                      setSettings({ ...settings, duration: value })
                    }
                  >
                    <SelectTrigger id="expiration">
                      <SelectValue placeholder="Select expiration" />
                    </SelectTrigger>
                    <SelectContent>
                      {expirationOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="usage">Maximum uses</Label>
                  <Select
                    value={settings.maxUses.toString()}
                    onValueChange={(value) =>
                      setSettings({ ...settings, maxUses: Number(value) })
                    }
                  >
                    <SelectTrigger id="usage">
                      <SelectValue placeholder="Select usage limit" />
                    </SelectTrigger>
                    <SelectContent>
                      {usageOptions.map((option) => (
                        <SelectItem
                          key={option.value}
                          value={option.value.toString()}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                onClick={generateInviteLink}
                className="w-full mt-4"
                disabled={!selectedProject}
              >
                <Link className="mr-2 h-4 w-4" />
                Generate Invite Link
              </Button>
            </>
          ) : (
            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor={id}>Invite link</Label>
                <div className="relative">
                  <Input
                    ref={inputRef}
                    id={id}
                    className="pe-9"
                    type="text"
                    value={inviteLink}
                    readOnly
                  />
                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={handleCopy}
                          className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center text-muted-foreground/80 transition-colors hover:text-foreground"
                          disabled={copied}
                        >
                          {copied ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {copied ? "Copied!" : "Copy to clipboard"}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Share via</Label>
                <div className="flex gap-2">
                  {shareOptions.map(({ icon: Icon, label, action }) => (
                    <Button
                      key={label}
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleShare(action)}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        <DrawerFooter className="pt-6">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
