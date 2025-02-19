"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, X, Loader2, CalendarCheck2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Invites } from "@/lib/api";
import type { InviteDetails } from "@/models/invites";
import { slugify } from "@/utils/format-projects";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const Invite = () => {
  const params = useParams();
  const router = useRouter();
  const [invite, setInvite] = useState<InviteDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvite = async () => {
      try {
        const inviteId = params["invite-id"] as string;
        const inviteData = await Invites.getInvite(inviteId);
        setInvite(inviteData);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to load invite");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchInvite();
  }, [params]);

  const handleAccept = async () => {
    if (!invite) return;

    setJoining(true);
    try {
      await Invites.joinInvite(invite.id);
      toast.success("Successfully joined project!");

      const slugName = slugify(invite.project_name);
      const projectUrl = `/board/projects/invited-projects/${slugName}-id=${invite.project_id}`;
      router.push(projectUrl);
    } catch (err) {
      if (typeof err === "string") {
        toast.error(err);
      } else {
        toast.error("Failed to join project");
      }
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return <LoadingOverlay />;
  }

  if (error || !invite) {
    return (
      <div className="container flex min-h-screen max-w-md flex-col items-center justify-center">
        <Card className="w-full p-8">
          <div className="flex flex-col items-center gap-6">
            <a href="/" className="flex flex-col items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                <CalendarCheck2 className="h-6 w-6 text-destructive" />
              </div>
            </a>

            <div className="flex flex-col items-center gap-1 text-center">
              <h1 className="text-2xl font-semibold text-destructive">
                Invite Not Found
              </h1>
              <p className="text-muted-foreground">
                We couldn&apos;t find the invitation you&apos;re looking for
              </p>
            </div>

            <Card className="w-full border-dashed border-destructive/40 p-6">
              <div className="flex flex-col items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                  <X className="h-8 w-8 text-destructive" />
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    {error ||
                      "This invite link appears to be invalid or has been removed"}
                  </p>
                </div>
              </div>
            </Card>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push("/board/home")}
            >
              <CalendarCheck2 className="mr-2 h-4 w-4" />
              Return to Dashboard
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              If you believe this is a mistake, please contact the person who
              sent you the invite
            </p>
          </div>
        </Card>
      </div>
    );
  }

  const isExpired =
    invite.expires_at && new Date(invite.expires_at) < new Date();
  const isUsageLimitReached =
    invite.max_usage !== null && invite.usage_count >= invite.max_usage;

  if (!invite.active || isExpired || isUsageLimitReached) {
    return (
      <div className="container flex min-h-screen max-w-md flex-col items-center justify-center">
        <Card className="w-full p-8">
          <div className="flex flex-col items-center gap-6">
            <a href="/" className="flex flex-col items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                <CalendarCheck2 className="h-6 w-6 text-destructive" />
              </div>
            </a>

            <div className="flex flex-col items-center gap-1 text-center">
              <h1 className="text-2xl font-semibold text-destructive">
                Invite Not Available
              </h1>
              <p className="text-muted-foreground">
                This invitation can no longer be used
              </p>
            </div>

            <Card className="w-full border-dashed border-destructive/40 p-6">
              <div className="flex flex-col items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                  <X className="h-8 w-8 text-destructive" />
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    {!invite.active
                      ? "This invite has been deactivated by the project owner"
                      : isExpired
                      ? "The invitation period has expired"
                      : "This invite has reached its maximum usage limit"}
                  </p>
                </div>
              </div>
            </Card>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push("/board/home")}
            >
              <CalendarCheck2 className="mr-2 h-4 w-4" />
              Return to Dashboard
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              Please request a new invitation from the project owner
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container flex min-h-screen max-w-md flex-col items-center justify-center">
      <Card className="w-full p-8">
        <div className="flex flex-col items-center gap-6">
          <a href="/" className="flex flex-col items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <CalendarCheck2 className="h-6 w-6 text-primary" />
            </div>
          </a>

          <div className="flex flex-col items-center gap-1 text-center">
            <h1 className="text-2xl font-semibold">Project Invitation</h1>
            <p className="text-muted-foreground">
              You&apos;ve been invited to join a project
            </p>
          </div>

          <Card className="w-full border-dashed p-6">
            <div className="flex flex-col items-center gap-4">
              <div className="flex flex-col items-center gap-3">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={`/user/avatar/${invite.invite_creator_avatar_id}.png`}
                    alt={invite.invite_creator_username}
                  />
                  <AvatarFallback className="bg-secondary">
                    {invite.invite_creator_username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <p className="text-sm font-medium text-foreground">
                  {invite.invite_creator_username}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  has invited you to join
                </p>
                <h2 className="mt-1 text-xl font-medium text-foreground">
                  {invite.project_name}
                </h2>
              </div>
            </div>
          </Card>

          <div className="flex w-full gap-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => router.push("/board/home")}
              disabled={joining}
            >
              <X className="mr-2 h-4 w-4" />
              Decline
            </Button>
            <Button
              className="flex-1"
              onClick={handleAccept}
              disabled={joining}
            >
              {joining ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Check className="mr-2 h-4 w-4" />
              )}
              Accept
            </Button>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            By accepting this invitation, you agree to collaborate on this
            project
          </p>
        </div>
      </Card>
    </div>
  );
};
