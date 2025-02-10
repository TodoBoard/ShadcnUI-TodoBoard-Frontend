import { NoTasks } from "@/app/modules/board/ui/components/no-tasks";
import { Plus } from "lucide-react";

export default function MyProjectsTravelPage() {
  return (
    <div>
      <h1 className="font-bold text-2xl">Travel</h1>

      <div className="flex items-center mt-5">
        <button className="flex items-center relative group">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-transparent group-hover:bg-purple-500 transition duration-300">
            <Plus className="text-primary group-hover:text-white transition duration-300" />
          </span>
          <span className="ml-2 text-gray-500 cursor-pointer group-hover:text-purple-500 transition duration-300">
            Add Task
          </span>
        </button>
      </div>

      <NoTasks />
    </div>
  );
}
