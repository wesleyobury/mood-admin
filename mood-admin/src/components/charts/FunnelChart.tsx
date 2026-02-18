"use client";

import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";

interface FunnelStep {
  name: string;
  value: number;
  conversion: number;
  dropoff: number;
}

interface FunnelChartProps {
  data: FunnelStep[];
  title: string;
  height?: number;
}

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export function FunnelChart({ data, title, height = 400 }: FunnelChartProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 20, right: 80, left: 20, bottom: 20 }}
        >
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
            width={150}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "6px",
            }}
            formatter={(value: number, name: string) => [
              value.toLocaleString(),
              name === "value" ? "Users" : name,
            ]}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
            <LabelList
              dataKey="value"
              position="right"
              fill="hsl(var(--foreground))"
              fontSize={12}
              formatter={(value: number) => value.toLocaleString()}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Conversion rates */}
      <div className="mt-4 space-y-2">
        {data.map((step, index) => (
          <div key={step.name} className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {index > 0 ? `→ ${step.name}` : step.name}
            </span>
            <div className="flex items-center gap-4">
              {index > 0 && (
                <>
                  <span className="text-green-500 font-medium">
                    {step.conversion.toFixed(1)}% converted
                  </span>
                  <span className="text-red-500/60">
                    {step.dropoff.toFixed(1)}% dropped
                  </span>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
