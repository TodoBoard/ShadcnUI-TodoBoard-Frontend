import { Invite } from "@/app/modules/invite/invite";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "TodoBoard | Invite",
  description: "Invite page",
};

export default function InvitePage() {
  return <Invite />;
}

