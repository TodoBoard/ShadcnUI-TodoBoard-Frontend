"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface PrioritySelectProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function PrioritySelect({ value, onValueChange }: PrioritySelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="h-7 w-[100px] text-xs shadow-none">
        <SelectValue placeholder="Priority">
          {value && (
            <div className="flex items-center">
              <div
                className={cn(
                  "w-2 h-2 rounded-full mr-2",
                  value === "default" && "bg-gray-300",
                  value === "low" && "bg-green-500",
                  value === "medium" && "bg-yellow-500",
                  value === "high" && "bg-red-500"
                )}
              />
              {value === "default"
                ? "Default"
                : value.charAt(0).toUpperCase() + value.slice(1)}
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="default" className="flex items-center">
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-gray-300 mr-2" />
            Default
          </div>
        </SelectItem>
        <SelectItem value="low" className="flex items-center">
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
            Low
          </div>
        </SelectItem>
        <SelectItem value="medium" className="flex items-center">
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2" />
            Medium
          </div>
        </SelectItem>
        <SelectItem value="high" className="flex items-center">
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-red-500 mr-2" />
            High
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
