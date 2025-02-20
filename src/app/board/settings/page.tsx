import { Settings } from "@/app/modules/board/settings/settings";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "TodoBoard | Settings",
  description: "Settings page",
};

export default function SettingsPage() {
  return (
    <div className="space-y-6 pb-4 pt-2">
      <h1 className="font-bold text-2xl">Settings</h1>
      <Settings />
    </div>
  );
}
