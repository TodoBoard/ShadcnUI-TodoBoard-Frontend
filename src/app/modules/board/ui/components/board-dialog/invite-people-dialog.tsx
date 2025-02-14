"use client";

import { cn } from "@/lib/utils";
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

interface NavInvitePeopleDialogProps {
  triggerContent: React.ReactNode;
  shortcut?: string;
}

const projects = [
  { id: "1", name: "Marketing Website" },
  { id: "2", name: "Mobile App" },
  { id: "3", name: "Dashboard" },
];

const shareOptions = [
  {
    icon: Mail,
    label: "Email",
    action: "mailto:?subject=Project Invitation&body=",
  },
  { icon: MessageSquare, label: "Message", action: "sms:?&body=" },
  { icon: Share2, label: "More", action: "share" },
];

export function NavInvitePeopleDialog({
  triggerContent,
  shortcut,
}: NavInvitePeopleDialogProps) {
  const id = useId();
  const [open, setOpen] = useState<boolean>(false);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

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

  const getInviteLink = () => {
    return selectedProject
      ? `https://originui.com/invite/${selectedProject}/${Math.random()
          .toString(36)
          .substring(7)}`
      : "";
  };

  const handleCopy = () => {
    if (inputRef.current) {
      navigator.clipboard.writeText(inputRef.current.value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const handleShare = async (action: string) => {
    const link = getInviteLink();
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div onClick={() => setOpen(true)}>{triggerContent}</div>
      </DialogTrigger>
      <DialogContent>
        <div className="flex flex-col gap-2">
          <div
            className="flex size-11 shrink-0 items-center justify-center rounded-full border border-border bg-primary"
            aria-hidden="true"
          >
            <UserRoundPlus
              className="text-primary-foreground"
              size={16}
              strokeWidth={2}
            />
          </div>
          <DialogHeader>
            <DialogTitle className="text-left">Invite team members</DialogTitle>
            <DialogDescription className="text-left">
              Share the invite link with your teammates
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="project-select">Select project</Label>
            <Select value={selectedProject} onValueChange={setSelectedProject}>
              <SelectTrigger id="project-select">
                <SelectValue placeholder="Choose a project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor={id}>Invite link</Label>
            <div className="relative">
              <Input
                ref={inputRef}
                id={id}
                className="pe-9"
                type="text"
                value={
                  selectedProject
                    ? getInviteLink()
                    : "Please select a project first"
                }
                readOnly
              />
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={handleCopy}
                      className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg border border-transparent text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed"
                      aria-label={copied ? "Copied" : "Copy to clipboard"}
                      disabled={!selectedProject || copied}
                    >
                      <div
                        className={cn(
                          "transition-all",
                          copied ? "scale-100 opacity-100" : "scale-0 opacity-0"
                        )}
                      >
                        <Check
                          className="stroke-emerald-500"
                          size={16}
                          strokeWidth={2}
                          aria-hidden="true"
                        />
                      </div>
                      <div
                        className={cn(
                          "absolute transition-all",
                          copied ? "scale-0 opacity-0" : "scale-100 opacity-100"
                        )}
                      >
                        <Copy size={16} strokeWidth={2} aria-hidden="true" />
                      </div>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="px-2 py-1 text-xs">
                    Copy to clipboard
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {selectedProject && (
            <div className="space-y-2">
              <Label>Share via</Label>
              <div className="flex gap-2">
                {shareOptions.map(({ icon: Icon, label, action }) => (
                  <Button
                    key={label}
                    variant="default"
                    className="flex-1 rounded-xl shadow-none"
                    onClick={() => handleShare(action)}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {label}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
