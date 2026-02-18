"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { api, RetentionData } from "@/lib/api";
import { RetentionHeatmap } from "@/components/charts/RetentionHeatmap";
import { DateRangePicker } from "@/components/DateRangePicker";
import { CSVExport } from "@/components/CSVExport";
import { subDays, format } from "date-fns";
import { redirect } from "next/navigation";

export default function RetentionPage() {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const [retention, setRetention] = useState<RetentionData | null>(null);
  const [startDate, setStartDate] = useState(subDays(new Date(), 90));
  const [endDate, setEndDate] = useState(new Date());
  const [cohortPeriod, setCohortPeriod] = useState<"day" | "week" | "month">("week");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isAdmin)) {
      redirect("/");
    }
  }, [isLoading, isAuthenticated, isAdmin]);

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) return;

    const fetchData = async () => {
      setLoading(true);
      const start = format(startDate, "yyyy-MM-dd");
      const end = format(endDate, "yyyy-MM-dd");

      const result = await api.getRetention(start, end, cohortPeriod, 28);
      if (result.data) {
        setRetention(result.data);
      }

      setLoading(false);
    };

    fetchData();
  }, [isAuthenticated, isAdmin, startDate, endDate, cohortPeriod]);

  const handleDateChange = (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
  };

  const getExportData = () => {
    if (!retention) return [];
    return retention.cohorts.map((cohort) => {
      const row: Record<string, string | number> = {
        Cohort: cohort.cohort_label,
        "Cohort Size": cohort.cohort_size,
      };
      retention.retention_days.forEach((day) => {
        row[day] = `${cohort.retention[day]?.percentage || 0}%`;
      });
      return row;
    });
  };

  if (isLoading || loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading retention data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Retention</h1>
          <p className="text-muted-foreground">User retention cohort analysis</p>
        </div>
        <div className="flex items-center gap-4">
          <CSVExport
            data={getExportData()}
            filename={`retention-${cohortPeriod}-${format(startDate, "yyyy-MM-dd")}-${format(endDate, "yyyy-MM-dd")}.csv`}
          />
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onChange={handleDateChange}
          />
        </div>
      </div>

      {/* Cohort Period Selector */}
      <div className="flex gap-2">
        {[
          { key: "day", label: "Daily" },
          { key: "week", label: "Weekly" },
          { key: "month", label: "Monthly" },
        ].map((period) => (
          <button
            key={period.key}
            onClick={() => setCohortPeriod(period.key as typeof cohortPeriod)}
            className={`px-4 py-2 text-sm rounded-md transition-colors ${
              cohortPeriod === period.key
                ? "bg-primary text-primary-foreground"
                : "bg-card border border-border hover:bg-accent"
            }`}
          >
            {period.label}
          </button>
        ))}
      </div>

      {/* Summary Stats */}
      {retention && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Total Users</p>
            <p className="text-2xl font-bold">{retention.total_users.toLocaleString()}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Avg D1 Retention</p>
            <p className="text-2xl font-bold text-green-500">
              {retention.average_retention["D1"]?.toFixed(1) || 0}%
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Avg D7 Retention</p>
            <p className="text-2xl font-bold text-green-500">
              {retention.average_retention["D7"]?.toFixed(1) || 0}%
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Avg D28 Retention</p>
            <p className="text-2xl font-bold text-green-500">
              {retention.average_retention["D28"]?.toFixed(1) || retention.average_retention["D21"]?.toFixed(1) || 0}%
            </p>
          </div>
        </div>
      )}

      {/* Retention Heatmap */}
      {retention && retention.cohorts.length > 0 && (
        <RetentionHeatmap
          title="Retention Cohort Heatmap"
          data={retention.heatmap_data}
          cohorts={retention.cohorts.map((c) => c.cohort_label)}
          days={retention.retention_days}
        />
      )}

      {/* Cohort Table */}
      {retention && retention.cohorts.length > 0 && (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="font-medium">Cohort Details</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left p-3 text-sm font-medium">Cohort</th>
                  <th className="text-right p-3 text-sm font-medium">Size</th>
                  {retention.retention_days.map((day) => (
                    <th key={day} className="text-right p-3 text-sm font-medium">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {retention.cohorts.map((cohort) => (
                  <tr key={cohort.cohort} className="border-b border-border last:border-0">
                    <td className="p-3 font-medium">{cohort.cohort_label}</td>
                    <td className="p-3 text-right font-mono">
                      {cohort.cohort_size.toLocaleString()}
                    </td>
                    {retention.retention_days.map((day) => (
                      <td key={day} className="p-3 text-right">
                        <span
                          className={`font-mono ${
                            (cohort.retention[day]?.percentage || 0) >= 30
                              ? "text-green-500"
                              : (cohort.retention[day]?.percentage || 0) >= 10
                              ? "text-yellow-500"
                              : "text-muted-foreground"
                          }`}
                        >
                          {cohort.retention[day]?.percentage.toFixed(1) || 0}%
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {retention && retention.cohorts.length === 0 && (
        <div className="bg-card border border-border rounded-lg p-8 text-center">
          <p className="text-muted-foreground">No retention data available for this period.</p>
          <p className="text-sm text-muted-foreground mt-2">
            Try expanding the date range or waiting for more user signups.
          </p>
        </div>
      )}
    </div>
  );
}
