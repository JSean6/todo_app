"use client";

import { useMemo } from "react";
import { format, addDays, startOfDay, isSameDay } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type DateSelectorProps = {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  daysToShow?: number;
  className?: string;
};

export default function DateSelector({
  selectedDate,
  onSelectDate,
  daysToShow = 7,
  className,
}: DateSelectorProps) {
  const dates = useMemo(() => {
    const today = startOfDay(new Date());
    return Array.from({ length: daysToShow }, (_, i) => addDays(today, i));
  }, [daysToShow]);

  return (
    <div className={cn("flex gap-2 overflow-x-auto pb-2", className)}>
      {dates.map((date) => {
        const isSelected = isSameDay(date, selectedDate);
        return (
          <button
            key={date.toISOString()}
            type="button"
            onClick={() => onSelectDate(date)}
            className={cn(
              "flex shrink-0 flex-col items-center rounded-lg border px-4 py-3 text-center transition-colors",
              "min-w-[72px]",
              isSelected
                ? "border-primary bg-primary/10 text-foreground"
                : "border-border bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <span className="text-xs font-medium uppercase">
              {format(date, "EEE")}
            </span>
            <span className="mt-0.5 text-lg font-semibold">
              {format(date, "d")}
            </span>
          </button>
        );
      })}
    </div>
  );
}
