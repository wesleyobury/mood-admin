import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus, MousePointer2 } from "lucide-react";
import { Tooltip } from "./Tooltip";

interface KPICardProps {
  title: string;
  value: string | number;
  previousValue?: number;
  change?: number;
  changePercent?: number;
  trend?: "up" | "down" | "flat";
  format?: "number" | "percentage";
  icon?: React.ReactNode;
  tooltip?: string;
  className?: string;
  onClick?: () => void;
}

export function KPICard({
  title,
  value,
  previousValue,
  change,
  changePercent,
  trend,
  format = "number",
  icon,
  tooltip,
  className,
  onClick,
}: KPICardProps) {
  const getTrendIcon = () => {
    if (!trend) return null;
    const iconClass = "h-4 w-4";
    switch (trend) {
      case "up":
        return <TrendingUp className={cn(iconClass, "text-green-500")} />;
      case "down":
        return <TrendingDown className={cn(iconClass, "text-red-500")} />;
      default:
        return <Minus className={cn(iconClass, "text-muted-foreground")} />;
    }
  };

  const getTrendColor = () => {
    if (!trend) return "text-muted-foreground";
    switch (trend) {
      case "up":
        return "text-green-500";
      case "down":
        return "text-red-500";
      default:
        return "text-muted-foreground";
    }
  };

  const formatValue = (val: number | string) => {
    if (typeof val === "string") return val;
    if (format === "percentage") return `${val.toFixed(1)}%`;
    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `${(val / 1000).toFixed(1)}K`;
    return val.toLocaleString();
  };

  const Component = onClick ? "button" : "div";

  return (
    <Component
      onClick={onClick}
      className={cn(
        "bg-card border border-border rounded-lg p-4 transition-colors text-left w-full",
        onClick && "hover:border-primary/50 cursor-pointer group",
        !onClick && "hover:border-primary/30",
        className
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <span className="text-sm text-muted-foreground font-medium">{title}</span>
          {tooltip && <Tooltip content={tooltip} />}
        </div>
        <div className="flex items-center gap-2">
          {onClick && (
            <MousePointer2 className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
          {icon && <div className="text-muted-foreground">{icon}</div>}
        </div>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-bold">{formatValue(value)}</p>
          {previousValue !== undefined && (
            <p className="text-xs text-muted-foreground mt-1">
              vs {formatValue(previousValue)} prev
            </p>
          )}
        </div>

        {(change !== undefined || changePercent !== undefined) && (
          <div className={cn("flex items-center gap-1", getTrendColor())}>
            {getTrendIcon()}
            <span className="text-sm font-medium">
              {changePercent !== undefined
                ? `${changePercent > 0 ? "+" : ""}${changePercent.toFixed(1)}%`
                : change !== undefined
                ? `${change > 0 ? "+" : ""}${formatValue(change)}`
                : null}
            </span>
          </div>
        )}
      </div>
    </Component>
  );
}
