"use client";

import { useState } from "react";
import { format, subDays, startOfDay, endOfDay } from "date-fns";
import { Calendar, ChevronDown } from "lucide-react";

interface DateRangePickerProps {
  startDate: Date;
  endDate: Date;
  onChange: (start: Date, end: Date) => void;
}

const presets = [
  { label: "Last 7 days", days: 7 },
  { label: "Last 14 days", days: 14 },
  { label: "Last 30 days", days: 30 },
  { label: "Last 90 days", days: 90 },
];

export function DateRangePicker({ startDate, endDate, onChange }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handlePreset = (days: number) => {
    const end = endOfDay(new Date());
    const start = startOfDay(subDays(end, days - 1));
    onChange(start, end);
    setIsOpen(false);
  };

  const formatRange = () => {
    return `${format(startDate, "MMM d")} - ${format(endDate, "MMM d, yyyy")}`;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-md text-sm hover:bg-accent transition-colors"
      >
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <span>{formatRange()}</span>
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 z-20 bg-card border border-border rounded-lg shadow-lg p-2 min-w-[180px]">
            {presets.map((preset) => (
              <button
                key={preset.days}
                onClick={() => handlePreset(preset.days)}
                className="w-full text-left px-3 py-2 text-sm hover:bg-accent rounded-md transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
