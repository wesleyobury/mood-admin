"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { MousePointer2 } from "lucide-react";
import { ChartControls, ChartSettings } from "@/components/ChartControls";

interface ChartData {
  name: string;
  value: number;
  previousValue?: number;
  [key: string]: string | number | undefined;
}

interface TimeSeriesChartProps {
  data: ChartData[];
  title: string;
  type?: "line" | "area" | "bar";
  showPrevious?: boolean;
  color?: string;
  height?: number;
  // Drilldown support
  metric?: string;
  onChartClick?: (metric: string, dateLabel: string) => void;
  // Custom controls support
  showControls?: boolean;
  chartSettings?: ChartSettings;
  onSettingsChange?: (settings: ChartSettings) => void;
}

export function TimeSeriesChart({
  data,
  title,
  type = "area",
  showPrevious = false,
  color = "hsl(var(--chart-1))",
  height = 300,
  metric,
  onChartClick,
  showControls = false,
  chartSettings,
  onSettingsChange,
}: TimeSeriesChartProps) {
  const isClickable = !!metric && !!onChartClick;

  // Apply cumulative transformation if enabled
  const chartData = useMemo(() => {
    if (!chartSettings?.showCumulative) return data;
    
    let cumulative = 0;
    let cumulativePrev = 0;
    return data.map((item) => {
      cumulative += item.value;
      if (item.previousValue !== undefined) {
        cumulativePrev += item.previousValue;
        return { ...item, value: cumulative, previousValue: cumulativePrev };
      }
      return { ...item, value: cumulative };
    });
  }, [data, chartSettings?.showCumulative]);

  // Determine effective chart type and comparison mode
  const effectiveType = chartSettings?.chartType || type;
  const effectiveShowPrevious = chartSettings?.showPrevious ?? showPrevious;

  const handleClick = (chartData: { activeLabel?: string }) => {
    if (isClickable && chartData?.activeLabel && metric) {
      onChartClick(metric, chartData.activeLabel);
    }
  };

  const commonProps = {
    data: chartData,
    margin: { top: 10, right: 10, left: 0, bottom: 0 },
    onClick: isClickable ? handleClick : undefined,
    style: isClickable ? { cursor: "pointer" } : undefined,
  };

  const renderChart = () => {
    switch (effectiveType) {
      case "line":
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="name"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              axisLine={{ stroke: "hsl(var(--border))" }}
            />
            <YAxis
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              axisLine={{ stroke: "hsl(var(--border))" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px",
              }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              dot={false}
              name="Current"
              activeDot={isClickable ? { r: 6, strokeWidth: 2 } : undefined}
            />
            {effectiveShowPrevious && (
              <Line
                type="monotone"
                dataKey="previousValue"
                stroke="hsl(var(--muted-foreground))"
                strokeWidth={1}
                strokeDasharray="5 5"
                dot={false}
                name="Previous"
              />
            )}
            {effectiveShowPrevious && <Legend />}
          </LineChart>
        );
      case "bar":
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="name"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              axisLine={{ stroke: "hsl(var(--border))" }}
            />
            <YAxis
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              axisLine={{ stroke: "hsl(var(--border))" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px",
              }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
            />
            <Bar 
              dataKey="value" 
              fill={color} 
              radius={[4, 4, 0, 0]} 
              name="Current"
              className={isClickable ? "cursor-pointer" : ""}
            />
            {effectiveShowPrevious && (
              <Bar
                dataKey="previousValue"
                fill="hsl(var(--muted-foreground))"
                radius={[4, 4, 0, 0]}
                name="Previous"
              />
            )}
            {effectiveShowPrevious && <Legend />}
          </BarChart>
        );
      default:
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id={`colorValue-${metric || 'default'}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="name"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              axisLine={{ stroke: "hsl(var(--border))" }}
            />
            <YAxis
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              axisLine={{ stroke: "hsl(var(--border))" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px",
              }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              fillOpacity={1}
              fill={`url(#colorValue-${metric || 'default'})`}
              name="Current"
              activeDot={isClickable ? { r: 6, strokeWidth: 2 } : undefined}
            />
            {effectiveShowPrevious && (
              <Line
                type="monotone"
                dataKey="previousValue"
                stroke="hsl(var(--muted-foreground))"
                strokeWidth={1}
                strokeDasharray="5 5"
                dot={false}
                name="Previous"
              />
            )}
            {effectiveShowPrevious && <Legend />}
          </AreaChart>
        );
    }
  };

  return (
    <div className={`bg-card border border-border rounded-lg p-4 ${isClickable ? 'hover:border-primary/50 transition-colors' : ''}`}>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          {chartSettings?.showCumulative && (
            <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">Cumulative</span>
          )}
          {isClickable && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <MousePointer2 className="h-3 w-3" />
              Click to drill down
            </span>
          )}
        </div>
        {showControls && chartSettings && onSettingsChange && (
          <ChartControls
            settings={chartSettings}
            onChange={onSettingsChange}
          />
        )}
      </div>
      <ResponsiveContainer width="100%" height={height}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
}
