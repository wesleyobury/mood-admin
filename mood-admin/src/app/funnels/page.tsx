"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { api, FunnelData } from "@/lib/api";
import { FunnelChart } from "@/components/charts/FunnelChart";
import { DateRangePicker } from "@/components/DateRangePicker";
import { CSVExport } from "@/components/CSVExport";
import { subDays, format } from "date-fns";
import { redirect } from "next/navigation";

const DEFAULT_FUNNEL_STEPS = [
  "app_session_start",
  "mood_selected",
  "workout_started",
  "workout_completed",
  "post_created",
];

const WORKOUT_FUNNEL_STEPS = [
  "app_session_start",
  "mood_selected",
  "equipment_selected",
  "difficulty_selected",
  "workout_started",
  "workout_completed",
];

const FEATURED_FUNNEL_STEPS = [
  "app_session_start",
  "featured_workout_clicked",
  "featured_workout_started",
  "featured_workout_completed",
];

export default function FunnelsPage() {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const [mainFunnel, setMainFunnel] = useState<FunnelData | null>(null);
  const [workoutFunnel, setWorkoutFunnel] = useState<FunnelData | null>(null);
  const [featuredFunnel, setFeaturedFunnel] = useState<FunnelData | null>(null);
  const [startDate, setStartDate] = useState(subDays(new Date(), 30));
  const [endDate, setEndDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [activeFunnel, setActiveFunnel] = useState<"main" | "workout" | "featured">("main");

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

      const [mainRes, workoutRes, featuredRes] = await Promise.all([
        api.getFunnel(start, end, DEFAULT_FUNNEL_STEPS),
        api.getFunnel(start, end, WORKOUT_FUNNEL_STEPS),
        api.getFunnel(start, end, FEATURED_FUNNEL_STEPS),
      ]);

      if (mainRes.data) setMainFunnel(mainRes.data);
      if (workoutRes.data) setWorkoutFunnel(workoutRes.data);
      if (featuredRes.data) setFeaturedFunnel(featuredRes.data);

      setLoading(false);
    };

    fetchData();
  }, [isAuthenticated, isAdmin, startDate, endDate]);

  const handleDateChange = (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
  };

  const transformFunnelData = (funnel: FunnelData | null) => {
    if (!funnel) return [];
    return funnel.steps.map((step) => ({
      name: step.step_label,
      value: step.unique_users,
      conversion: step.conversion_rate,
      dropoff: step.dropoff_rate,
    }));
  };

  const getCurrentFunnel = () => {
    switch (activeFunnel) {
      case "workout":
        return workoutFunnel;
      case "featured":
        return featuredFunnel;
      default:
        return mainFunnel;
    }
  };

  const getExportData = () => {
    const funnel = getCurrentFunnel();
    if (!funnel) return [];
    return funnel.steps.map((step) => ({
      Step: step.step_label,
      "Event Type": step.step,
      "Unique Users": step.unique_users,
      "Conversion Rate": `${step.conversion_rate}%`,
      "Dropoff Rate": `${step.dropoff_rate}%`,
    }));
  };

  if (isLoading || loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading funnels...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Funnels</h1>
          <p className="text-muted-foreground">User journey analysis and conversion tracking</p>
        </div>
        <div className="flex items-center gap-4">
          <CSVExport
            data={getExportData()}
            filename={`funnel-${activeFunnel}-${format(startDate, "yyyy-MM-dd")}-${format(endDate, "yyyy-MM-dd")}.csv`}
          />
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onChange={handleDateChange}
          />
        </div>
      </div>

      {/* Funnel Selector */}
      <div className="flex gap-2">
        {[
          { key: "main", label: "Main Funnel" },
          { key: "workout", label: "Workout Builder" },
          { key: "featured", label: "Featured Workouts" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveFunnel(tab.key as typeof activeFunnel)}
            className={`px-4 py-2 text-sm rounded-md transition-colors ${
              activeFunnel === tab.key
                ? "bg-primary text-primary-foreground"
                : "bg-card border border-border hover:bg-accent"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overall Stats */}
      {getCurrentFunnel() && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Entry Users</p>
            <p className="text-2xl font-bold">
              {getCurrentFunnel()?.total_entry_users.toLocaleString()}
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Completed Users</p>
            <p className="text-2xl font-bold">
              {getCurrentFunnel()?.total_completed_users.toLocaleString()}
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Overall Conversion</p>
            <p className="text-2xl font-bold text-green-500">
              {getCurrentFunnel()?.overall_conversion.toFixed(1)}%
            </p>
          </div>
        </div>
      )}

      {/* Funnel Chart */}
      <FunnelChart
        title={`${activeFunnel === "main" ? "User" : activeFunnel === "workout" ? "Workout Builder" : "Featured Workout"} Funnel`}
        data={transformFunnelData(getCurrentFunnel())}
        height={Math.max(300, (getCurrentFunnel()?.steps.length || 5) * 60)}
      />

      {/* Step Details Table */}
      {getCurrentFunnel() && (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="font-medium">Step Details</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left p-3 text-sm font-medium">Step</th>
                  <th className="text-right p-3 text-sm font-medium">Users</th>
                  <th className="text-right p-3 text-sm font-medium">Converted</th>
                  <th className="text-right p-3 text-sm font-medium">Dropped</th>
                  <th className="text-right p-3 text-sm font-medium">Conversion</th>
                  <th className="text-right p-3 text-sm font-medium">Dropoff</th>
                </tr>
              </thead>
              <tbody>
                {getCurrentFunnel()?.steps.map((step, index) => (
                  <tr key={step.step} className="border-b border-border last:border-0">
                    <td className="p-3">
                      <div>
                        <p className="font-medium">{step.step_label}</p>
                        <p className="text-xs text-muted-foreground">{step.step}</p>
                      </div>
                    </td>
                    <td className="p-3 text-right font-mono">
                      {step.unique_users.toLocaleString()}
                    </td>
                    <td className="p-3 text-right font-mono">
                      {index > 0 ? step.converted_users.toLocaleString() : "-"}
                    </td>
                    <td className="p-3 text-right font-mono">
                      {index > 0 ? step.dropped_users.toLocaleString() : "-"}
                    </td>
                    <td className="p-3 text-right">
                      {index > 0 ? (
                        <span className="text-green-500 font-medium">
                          {step.conversion_rate.toFixed(1)}%
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="p-3 text-right">
                      {index > 0 ? (
                        <span className="text-red-500/70">
                          {step.dropoff_rate.toFixed(1)}%
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
