"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

// Mock time slots data
const timeSlots = [
  { time: "09:00", available: true },
  // ... rest of the timeSlots
];

interface DateTimePickerProps {
  date: Date | undefined;
  time: string | null;
  onDateChange: (date: Date | undefined) => void;
  onTimeChange: (time: string | null) => void;
}

export function DateTimePicker({
  date,
  time,
  onDateChange,
  onTimeChange,
}: DateTimePickerProps) {
  const today = new Date();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-7 text-xs justify-start text-left font-normal shadow-none"
        >
          <CalendarIcon className="mr-1 h-3 w-3" />
          {date ? (
            <span>
              {format(date, "PPP")}
              {time && ` at ${time}`}
            </span>
          ) : (
            <span>No date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="rounded-lg border">
          <div className="flex max-sm:flex-col">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => {
                onDateChange(newDate);
                onTimeChange(null);
              }}
              className="p-2 sm:pe-5"
              disabled={[{ before: today }]}
              initialFocus
            />
            <div className="relative w-full max-sm:h-48 sm:w-40">
              <div className="absolute inset-0 border-border py-4 max-sm:border-t">
                <ScrollArea className="h-full border-border sm:border-s">
                  <div className="space-y-3">
                    <div className="flex h-5 shrink-0 items-center px-5">
                      <p className="text-sm font-medium">
                        {date ? format(date, "EEEE, d") : "Select a date"}
                      </p>
                    </div>
                    <div className="grid gap-1.5 px-5 max-sm:grid-cols-2">
                      {timeSlots.map(({ time: timeSlot, available }) => (
                        <Button
                          key={timeSlot}
                          variant={time === timeSlot ? "default" : "outline"}
                          size="sm"
                          className="w-full"
                          onClick={() => onTimeChange(timeSlot)}
                          disabled={!available || !date}
                        >
                          {timeSlot}
                        </Button>
                      ))}
                    </div>
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
