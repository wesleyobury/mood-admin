"use client";

import { useState } from "react";
import { BarChart2, LineChart, AreaChart, TrendingUp, ToggleLeft, ToggleRight, Save, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ChartSettings {
  chartType: "line" | "bar" | "area";
  showCumulative: boolean;
  showPrevious: boolean;
}

interface ChartControlsProps {
  settings: ChartSettings;
  onChange: (settings: ChartSettings) => void;
  onSave?: () => void;
  showSaveButton?: boolean;
}

export function ChartControls({
  settings,
  onChange,
  onSave,
  showSaveButton = false,
}: ChartControlsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const chartTypes: { type: "line" | "bar" | "area"; icon: React.ReactNode; label: string }[] = [
    { type: "line", icon: <LineChart className="h-4 w-4" />, label: "Line" },
    { type: "bar", icon: <BarChart2 className="h-4 w-4" />, label: "Bar" },
    { type: "area", icon: <AreaChart className="h-4 w-4" />, label: "Area" },
  ];

  return (
    <div className="flex items-center gap-2">
      {/* Chart Type Toggle */}
      <div className="flex items-center bg-muted rounded-md p-0.5">
        {chartTypes.map(({ type, icon, label }) => (
          <button
            key={type}
            onClick={() => onChange({ ...settings, chartType: type })}
            title={label}
            className={cn(
              "p-1.5 rounded transition-colors",
              settings.chartType === type
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {icon}
          </button>
        ))}
      </div>

      {/* Cumulative Toggle */}
      <button
        onClick={() => onChange({ ...settings, showCumulative: !settings.showCumulative })}
        className={cn(
          "flex items-center gap-1.5 px-2 py-1.5 text-xs rounded-md transition-colors",
          settings.showCumulative
            ? "bg-primary/10 text-primary"
            : "bg-muted text-muted-foreground hover:text-foreground"
        )}
        title="Toggle cumulative view"
      >
        <TrendingUp className="h-3.5 w-3.5" />
        <span>Cumulative</span>
      </button>

      {/* Compare Toggle */}
      <button
        onClick={() => onChange({ ...settings, showPrevious: !settings.showPrevious })}
        className={cn(
          "flex items-center gap-1.5 px-2 py-1.5 text-xs rounded-md transition-colors",
          settings.showPrevious
            ? "bg-primary/10 text-primary"
            : "bg-muted text-muted-foreground hover:text-foreground"
        )}
        title="Compare with previous period"
      >
        {settings.showPrevious ? (
          <ToggleRight className="h-3.5 w-3.5" />
        ) : (
          <ToggleLeft className="h-3.5 w-3.5" />
        )}
        <span>Compare</span>
      </button>

      {/* Save Button */}
      {showSaveButton && onSave && (
        <button
          onClick={onSave}
          className="flex items-center gap-1.5 px-2 py-1.5 text-xs bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          <Save className="h-3.5 w-3.5" />
          <span>Save View</span>
        </button>
      )}
    </div>
  );
}
