"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  api,
  MoodBreakdownData,
  EquipmentBreakdownData,
  DifficultyBreakdownData,
  ExercisesBreakdownData,
} from "@/lib/api";
import { TimeSeriesChart } from "@/components/charts/TimeSeriesChart";
import { DateRangePicker } from "@/components/DateRangePicker";
import { CSVExport } from "@/components/CSVExport";
import { subDays, format } from "date-fns";
import { redirect } from "next/navigation";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "#8884d8",
  "#82ca9d",
  "#ffc658",
];

export default function FeaturesPage() {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const [moods, setMoods] = useState<MoodBreakdownData | null>(null);
  const [equipment, setEquipment] = useState<EquipmentBreakdownData | null>(null);
  const [difficulties, setDifficulties] = useState<DifficultyBreakdownData | null>(null);
  const [exercises, setExercises] = useState<ExercisesBreakdownData | null>(null);
  const [startDate, setStartDate] = useState(subDays(new Date(), 30));
  const [endDate, setEndDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"moods" | "equipment" | "difficulty" | "exercises">("moods");

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isAdmin)) {
      redirect("/");
    }
  }, [isLoading, isAuthenticated, isAdmin]);

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) return;

    const fetchData = async () => {
      setLoading(true);
      const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

      const [moodsRes, equipRes, diffRes, exRes] = await Promise.all([
        api.getMoodBreakdown(days),
        api.getEquipmentBreakdown(days),
        api.getDifficultyBreakdown(days),
        api.getExercisesBreakdown(days),
      ]);

      if (moodsRes.data) setMoods(moodsRes.data);
      if (equipRes.data) setEquipment(equipRes.data);
      if (diffRes.data) setDifficulties(diffRes.data);
      if (exRes.data) setExercises(exRes.data);

      setLoading(false);
    };

    fetchData();
  }, [isAuthenticated, isAdmin, startDate, endDate]);

  const handleDateChange = (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
  };

  const getExportData = () => {
    switch (activeTab) {
      case "moods":
        return moods?.moods.map((m) => ({
          Mood: m.mood,
          Selections: m.selection_count,
          "Unique Users": m.unique_users,
          Percentage: `${m.percentage}%`,
        })) || [];
      case "equipment":
        return equipment?.equipment.map((e) => ({
          Equipment: e.equipment,
          Selections: e.selection_count,
          "Unique Users": e.unique_users,
          Percentage: `${e.percentage}%`,
        })) || [];
      case "difficulty":
        return difficulties?.difficulties.map((d) => ({
          Difficulty: d.difficulty,
          Selections: d.selection_count,
          "Unique Users": d.unique_users,
          Percentage: `${d.percentage}%`,
        })) || [];
      case "exercises":
        return exercises?.exercises.slice(0, 50).map((e) => ({
          Exercise: e.exercise_name,
          Completions: e.completion_count,
          "Unique Users": e.unique_users,
          Percentage: `${e.percentage}%`,
        })) || [];
    }
  };

  if (isLoading || loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading feature insights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Features & Content</h1>
          <p className="text-muted-foreground">Usage breakdown by moods, equipment, and exercises</p>
        </div>
        <div className="flex items-center gap-4">
          <CSVExport
            data={getExportData()}
            filename={`${activeTab}-${format(startDate, "yyyy-MM-dd")}-${format(endDate, "yyyy-MM-dd")}.csv`}
          />
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onChange={handleDateChange}
          />
        </div>
      </div>

      {/* Tab Selector */}
      <div className="flex gap-2">
        {[
          { key: "moods", label: "Moods" },
          { key: "equipment", label: "Equipment" },
          { key: "difficulty", label: "Difficulty" },
          { key: "exercises", label: "Exercises" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className={`px-4 py-2 text-sm rounded-md transition-colors ${
              activeTab === tab.key
                ? "bg-primary text-primary-foreground"
                : "bg-card border border-border hover:bg-accent"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Moods Tab */}
      {activeTab === "moods" && moods && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">Mood Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={moods.moods}
                  dataKey="selection_count"
                  nameKey="mood"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ mood, percentage }) => `${mood}: ${percentage}%`}
                  labelLine={false}
                >
                  {moods.moods.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">Mood Rankings</h3>
            <div className="space-y-3">
              {moods.moods.map((mood, index) => (
                <div key={mood.mood} className="flex items-center gap-3">
                  <span className="text-sm font-bold text-muted-foreground w-6">#{index + 1}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{mood.mood}</span>
                      <span className="text-sm text-muted-foreground">
                        {mood.selection_count.toLocaleString()} ({mood.percentage}%)
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${mood.percentage}%`,
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Equipment Tab */}
      {activeTab === "equipment" && equipment && (
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">Equipment Usage</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={equipment.equipment.slice(0, 15)}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" tick={{ fill: "hsl(var(--muted-foreground))" }} />
              <YAxis
                type="category"
                dataKey="equipment"
                tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
                width={90}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                }}
              />
              <Bar dataKey="selection_count" fill="hsl(var(--chart-2))" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Difficulty Tab */}
      {activeTab === "difficulty" && difficulties && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {difficulties.difficulties.map((diff, index) => (
            <div key={diff.difficulty} className="bg-card border border-border rounded-lg p-6 text-center">
              <div
                className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ backgroundColor: COLORS[index % COLORS.length] + "20" }}
              >
                <span className="text-2xl font-bold" style={{ color: COLORS[index % COLORS.length] }}>
                  {diff.percentage.toFixed(0)}%
                </span>
              </div>
              <h3 className="text-lg font-bold capitalize">{diff.difficulty}</h3>
              <p className="text-muted-foreground">
                {diff.selection_count.toLocaleString()} selections
              </p>
              <p className="text-sm text-muted-foreground">
                {diff.unique_users.toLocaleString()} unique users
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Exercises Tab */}
      {activeTab === "exercises" && exercises && (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="font-medium">Top Exercises ({exercises.total_completions.toLocaleString()} total completions)</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left p-3 text-sm font-medium">#</th>
                  <th className="text-left p-3 text-sm font-medium">Exercise</th>
                  <th className="text-right p-3 text-sm font-medium">Completions</th>
                  <th className="text-right p-3 text-sm font-medium">Unique Users</th>
                  <th className="text-right p-3 text-sm font-medium">%</th>
                </tr>
              </thead>
              <tbody>
                {exercises.exercises.slice(0, 20).map((ex, index) => (
                  <tr key={ex.exercise_name} className="border-b border-border last:border-0">
                    <td className="p-3 text-muted-foreground font-mono">{index + 1}</td>
                    <td className="p-3 font-medium">{ex.exercise_name}</td>
                    <td className="p-3 text-right font-mono">{ex.completion_count.toLocaleString()}</td>
                    <td className="p-3 text-right font-mono">{ex.unique_users.toLocaleString()}</td>
                    <td className="p-3 text-right text-muted-foreground">{ex.percentage.toFixed(1)}%</td>
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
