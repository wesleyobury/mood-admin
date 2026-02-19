"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useFilters } from "@/lib/filter-context";
import { api, PlatformStats, ComparisonData, TimeSeriesData, EngagementData } from "@/lib/api";
import { KPICard } from "@/components/KPICard";
import { TimeSeriesChart } from "@/components/charts/TimeSeriesChart";
import { GlobalFilterBar } from "@/components/GlobalFilterBar";
import { METRIC_TOOLTIPS, Tooltip } from "@/components/Tooltip";
import { format } from "date-fns";
import {
  Users,
  UserPlus,
  Dumbbell,
  CheckCircle,
  FileText,
  Heart,
  Bell,
  Activity,
  Info,
} from "lucide-react";
import { redirect } from "next/navigation";

export default function OverviewPage() {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const { filters, setFilters, days } = useFilters();
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [comparison, setComparison] = useState<ComparisonData | null>(null);
  const [engagement, setEngagement] = useState<EngagementData | null>(null);
  const [dauData, setDauData] = useState<TimeSeriesData | null>(null);
  const [newUsersData, setNewUsersData] = useState<TimeSeriesData | null>(null);
  const [workoutsData, setWorkoutsData] = useState<TimeSeriesData | null>(null);
  const [postsData, setPostsData] = useState<TimeSeriesData | null>(null);
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
      const startStr = format(filters.startDate, "yyyy-MM-dd");
      const endStr = format(filters.endDate, "yyyy-MM-dd");
      const includeInternal = filters.includeInternal;
      const period = filters.granularity;
      
      const [statsRes, compRes, engRes, dauRes, usersRes, workoutsRes, postsRes] = await Promise.all([
        api.getPlatformStats(days, includeInternal),
        api.getComparison(startStr, endStr),
        api.getEngagement(includeInternal),
        api.getTimeSeries("active_users", period, days, includeInternal),
        api.getTimeSeries("new_users", period, days, includeInternal),
        api.getTimeSeries("workouts_completed", period, days, includeInternal),
        api.getTimeSeries("posts_created", period, days, includeInternal),
      ]);

      if (statsRes.data) setStats(statsRes.data);
      if (compRes.data) setComparison(compRes.data);
      if (engRes.data) setEngagement(engRes.data);
      if (dauRes.data) setDauData(dauRes.data);
      if (usersRes.data) setNewUsersData(usersRes.data);
      if (workoutsRes.data) setWorkoutsData(workoutsRes.data);
      if (postsRes.data) setPostsData(postsRes.data);
      
      setLoading(false);
    };

    fetchData();
  }, [isAuthenticated, isAdmin, filters, days]);

  const getMetric = (key: string) => comparison?.metrics[key];

  if (isLoading || loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Overview</h1>
          <p className="text-muted-foreground">Platform performance at a glance</p>
        </div>
      </div>

      {/* Global Filter Bar */}
      <GlobalFilterBar filters={filters} onChange={setFilters} />

      {/* Engagement Metrics - WAU/MAU */}
      {engagement && (
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-2">
            Active Users & Stickiness
            <Tooltip content="Engagement metrics based on app_session_start events. DAU/MAU indicates how often users return." />
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <p className="text-2xl font-bold">{engagement.dau}</p>
                <Tooltip content={METRIC_TOOLTIPS.dau} />
              </div>
              <p className="text-sm text-muted-foreground">DAU</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <p className="text-2xl font-bold">{engagement.wau}</p>
                <Tooltip content={METRIC_TOOLTIPS.wau} />
              </div>
              <p className="text-sm text-muted-foreground">WAU</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <p className="text-2xl font-bold">{engagement.mau}</p>
                <Tooltip content={METRIC_TOOLTIPS.mau} />
              </div>
              <p className="text-sm text-muted-foreground">MAU</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <p className="text-2xl font-bold text-green-500">{engagement.stickiness_dau_mau}%</p>
                <Tooltip content={METRIC_TOOLTIPS.stickiness} />
              </div>
              <p className="text-sm text-muted-foreground">DAU/MAU</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <p className="text-2xl font-bold text-blue-500">{engagement.wau_mau_ratio}%</p>
                <Tooltip content={METRIC_TOOLTIPS.wauMauRatio} />
              </div>
              <p className="text-sm text-muted-foreground">WAU/MAU</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-3">
            Based on app_session_start events • Last updated: {new Date(engagement.computed_at).toLocaleTimeString()}
            {filters.includeInternal && " • Including internal users"}
          </p>
        </div>
      )}

      {/* KPI Cards - Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Daily Active Users"
          value={getMetric("active_users")?.current || stats?.daily_active_users || 0}
          previousValue={getMetric("active_users")?.previous}
          changePercent={getMetric("active_users")?.change_pct}
          trend={getMetric("active_users")?.trend}
          icon={<Users className="h-4 w-4" />}
          tooltip={METRIC_TOOLTIPS.activeUsers}
        />
        <KPICard
          title="New Users"
          value={getMetric("new_users")?.current || stats?.new_users || 0}
          previousValue={getMetric("new_users")?.previous}
          changePercent={getMetric("new_users")?.change_pct}
          trend={getMetric("new_users")?.trend}
          icon={<UserPlus className="h-4 w-4" />}
          tooltip={METRIC_TOOLTIPS.newUsers}
        />
        <KPICard
          title="Workouts Started"
          value={getMetric("workouts_started")?.current || stats?.total_workouts_started || 0}
          previousValue={getMetric("workouts_started")?.previous}
          changePercent={getMetric("workouts_started")?.change_pct}
          trend={getMetric("workouts_started")?.trend}
          icon={<Dumbbell className="h-4 w-4" />}
          tooltip={METRIC_TOOLTIPS.workoutsStarted}
        />
        <KPICard
          title="Workouts Completed"
          value={getMetric("workouts_completed")?.current || stats?.total_workouts_completed || 0}
          previousValue={getMetric("workouts_completed")?.previous}
          changePercent={getMetric("workouts_completed")?.change_pct}
          trend={getMetric("workouts_completed")?.trend}
          icon={<CheckCircle className="h-4 w-4" />}
          tooltip={METRIC_TOOLTIPS.workoutsCompleted}
        />
      </div>

      {/* KPI Cards - Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Completion Rate"
          value={getMetric("completion_rate")?.current || stats?.workout_completion_rate || 0}
          previousValue={getMetric("completion_rate")?.previous}
          changePercent={getMetric("completion_rate")?.change_pct}
          trend={getMetric("completion_rate")?.trend}
          format="percentage"
          icon={<Activity className="h-4 w-4" />}
          tooltip={METRIC_TOOLTIPS.completionRate}
        />
        <KPICard
          title="Posts Created"
          value={getMetric("posts_created")?.current || stats?.total_posts_created || 0}
          previousValue={getMetric("posts_created")?.previous}
          changePercent={getMetric("posts_created")?.change_pct}
          trend={getMetric("posts_created")?.trend}
          icon={<FileText className="h-4 w-4" />}
          tooltip={METRIC_TOOLTIPS.postsCreated}
        />
        <KPICard
          title="Total Likes"
          value={getMetric("likes")?.current || stats?.total_likes || 0}
          previousValue={getMetric("likes")?.previous}
          changePercent={getMetric("likes")?.change_pct}
          trend={getMetric("likes")?.trend}
          icon={<Heart className="h-4 w-4" />}
          tooltip={METRIC_TOOLTIPS.likes}
        />
        <KPICard
          title="Notification Clicks"
          value={getMetric("notification_clicks")?.current || 0}
          previousValue={getMetric("notification_clicks")?.previous}
          changePercent={getMetric("notification_clicks")?.change_pct}
          trend={getMetric("notification_clicks")?.trend}
          icon={<Bell className="h-4 w-4" />}
          tooltip={METRIC_TOOLTIPS.notificationClicks}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {dauData && (
          <TimeSeriesChart
            title="Daily Active Users"
            data={dauData.labels.map((label, i) => ({
              name: label,
              value: dauData.values[i],
            }))}
            type="area"
            color="hsl(var(--chart-1))"
          />
        )}
        {newUsersData && (
          <TimeSeriesChart
            title="New Users"
            data={newUsersData.labels.map((label, i) => ({
              name: label,
              value: newUsersData.values[i],
            }))}
            type="bar"
            color="hsl(var(--chart-2))"
          />
        )}
        {workoutsData && (
          <TimeSeriesChart
            title="Workouts Completed"
            data={workoutsData.labels.map((label, i) => ({
              name: label,
              value: workoutsData.values[i],
            }))}
            type="area"
            color="hsl(var(--chart-3))"
          />
        )}
        {postsData && (
          <TimeSeriesChart
            title="Posts Created"
            data={postsData.labels.map((label, i) => ({
              name: label,
              value: postsData.values[i],
            }))}
            type="bar"
            color="hsl(var(--chart-4))"
          />
        )}
      </div>

      {/* Popular Moods */}
      {stats?.popular_mood_categories && stats.popular_mood_categories.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">
            Popular Mood Categories
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {stats.popular_mood_categories.slice(0, 5).map((mood) => (
              <div key={mood.mood} className="text-center">
                <p className="text-2xl font-bold">{mood.count}</p>
                <p className="text-sm text-muted-foreground truncate" title={mood.mood}>
                  {mood.mood}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
