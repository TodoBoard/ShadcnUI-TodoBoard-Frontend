import { Settings } from "@/app/modules/board/settings/settings";

export default function SettingsPage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-bold text-2xl">Settings</h1>
      </div>
      <Settings />
    </div>
  );
}
