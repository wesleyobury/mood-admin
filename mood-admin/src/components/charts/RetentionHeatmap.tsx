"use client";

import { cn } from "@/lib/utils";

interface HeatmapCell {
  cohort: string;
  day: string;
  value: number;
}

interface RetentionHeatmapProps {
  data: HeatmapCell[];
  cohorts: string[];
  days: string[];
  title: string;
}

export function RetentionHeatmap({ data, cohorts, days, title }: RetentionHeatmapProps) {
  const getValue = (cohort: string, day: string) => {
    const cell = data.find((d) => d.cohort === cohort && d.day === day);
    return cell?.value ?? 0;
  };

  const getColor = (value: number) => {
    if (value >= 50) return "bg-green-500";
    if (value >= 30) return "bg-green-500/70";
    if (value >= 20) return "bg-green-500/50";
    if (value >= 10) return "bg-green-500/30";
    if (value > 0) return "bg-green-500/20";
    return "bg-muted";
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 overflow-x-auto">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">{title}</h3>
      
      <div className="min-w-[600px]">
        {/* Header row */}
        <div className="flex items-center gap-1 mb-1">
          <div className="w-32 flex-shrink-0 text-xs font-medium text-muted-foreground">
            Cohort
          </div>
          {days.map((day) => (
            <div
              key={day}
              className="flex-1 min-w-[60px] text-center text-xs font-medium text-muted-foreground"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Data rows */}
        {cohorts.map((cohort) => (
          <div key={cohort} className="flex items-center gap-1 mb-1">
            <div className="w-32 flex-shrink-0 text-xs text-muted-foreground truncate">
              {cohort}
            </div>
            {days.map((day) => {
              const value = getValue(cohort, day);
              return (
                <div
                  key={`${cohort}-${day}`}
                  className={cn(
                    "flex-1 min-w-[60px] h-8 rounded flex items-center justify-center text-xs font-medium transition-colors",
                    getColor(value),
                    value > 0 ? "text-white" : "text-muted-foreground"
                  )}
                  title={`${cohort} ${day}: ${value}%`}
                >
                  {value > 0 ? `${value}%` : "-"}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
        <span>Retention:</span>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-green-500/20" />
            <span>&lt;10%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-green-500/30" />
            <span>10-20%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-green-500/50" />
            <span>20-30%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-green-500/70" />
            <span>30-50%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-green-500" />
            <span>&gt;50%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
