"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useFilters } from "@/lib/filter-context";
import { api, ActivationMetrics, WorkoutQualityMetrics, SocialLoopMetrics } from "@/lib/api";
import { GlobalFilterBar } from "@/components/GlobalFilterBar";
import { Tooltip, METRIC_TOOLTIPS } from "@/components/Tooltip";
import { redirect } from "next/navigation";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  FunnelChart,
  Funnel,
  LabelList,
} from "recharts";
import {
  Zap,
  Timer,
  Users,
  TrendingUp,
  Activity,
  Heart,
  MessageCircle,
  UserPlus,
  BarChart3,
  Target,
} from "lucide-react";

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export default function InsightsPage() {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const { filters, setFilters, days } = useFilters();
  const [activation, setActivation] = useState<ActivationMetrics | null>(null);
  const [workoutQuality, setWorkoutQuality] = useState<WorkoutQualityMetrics | null>(null);
  const [socialLoops, setSocialLoops] = useState<SocialLoopMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"activation" | "quality" | "social">("activation");

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isAdmin)) {
      redirect("/");
    }
  }, [isLoading, isAuthenticated, isAdmin]);

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) return;

    const fetchData = async () => {
      setLoading(true);
      const includeInternal = filters.includeInternal;

      const [actRes, qualRes, socRes] = await Promise.all([
        api.getActivation(days, includeInternal),
        api.getWorkoutQuality(days, includeInternal),
        api.getSocialLoops(days, includeInternal),
      ]);

      if (actRes.data) setActivation(actRes.data);
      if (qualRes.data) setWorkoutQuality(qualRes.data);
      if (socRes.data) setSocialLoops(socRes.data);

      setLoading(false);
    };

    fetchData();
  }, [isAuthenticated, isAdmin, days, filters.includeInternal]);

  if (isLoading || loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading insights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Deep Insights</h1>
          <p className="text-muted-foreground">Activation, Workout Quality & Social Analytics</p>
        </div>
      </div>

      {/* Global Filter Bar */}
      <GlobalFilterBar filters={filters} onChange={setFilters} />

      {/* Tab Selector */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: "activation", label: "Activation", icon: <Zap className="h-4 w-4" /> },
          { key: "quality", label: "Workout Quality", icon: <Target className="h-4 w-4" /> },
          { key: "social", label: "Social Loops", icon: <Users className="h-4 w-4" /> },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-2 text-sm rounded-md transition-colors ${
              activeTab === tab.key
                ? "bg-primary text-primary-foreground"
                : "bg-card border border-border hover:bg-accent"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Activation Tab */}
      {activeTab === "activation" && activation && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <UserPlus className="h-4 w-4" />
                <span className="text-sm">New Users</span>
              </div>
              <p className="text-2xl font-bold">{activation.total_new_users}</p>
              <p className="text-xs text-muted-foreground">Last {days} days</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Zap className="h-4 w-4" />
                <span className="text-sm">Activated</span>
                <Tooltip content="Users who started at least one workout" />
              </div>
              <p className="text-2xl font-bold">{activation.activated_users}</p>
              <p className="text-xs text-muted-foreground">{activation.activation_rate}% activation rate</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Timer className="h-4 w-4" />
                <span className="text-sm">Median Time to First Workout</span>
              </div>
              <p className="text-2xl font-bold">
                {activation.time_to_first_workout.median_hours 
                  ? `${activation.time_to_first_workout.median_hours}h`
                  : "N/A"}
              </p>
              <p className="text-xs text-muted-foreground">
                Avg: {activation.time_to_first_workout.avg_hours 
                  ? `${activation.time_to_first_workout.avg_hours}h`
                  : "N/A"}
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm">Activation Rate</span>
              </div>
              <p className="text-2xl font-bold text-green-500">{activation.activation_rate}%</p>
              <p className="text-xs text-muted-foreground">signup → first workout</p>
            </div>
          </div>

          {/* Activation Funnel */}
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">Activation Funnel</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {activation.activation_funnel.map((step, index) => (
                <div key={step.step} className="relative">
                  <div 
                    className="p-4 rounded-lg text-center"
                    style={{ backgroundColor: `${COLORS[index % COLORS.length]}20` }}
                  >
                    <p className="text-xs text-muted-foreground capitalize mb-1">
                      {step.step.replace("_", " ")}
                    </p>
                    <p className="text-2xl font-bold">{step.users}</p>
                    <p className="text-sm" style={{ color: COLORS[index % COLORS.length] }}>
                      {step.rate}%
                    </p>
                  </div>
                  {index < activation.activation_funnel.length - 1 && (
                    <div className="hidden md:block absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 text-muted-foreground">
                      →
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Time to First Workout Distribution */}
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">
              Time to First Workout Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={activation.time_to_first_workout.distribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="bucket" 
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                  tickFormatter={(val) => val.replace("_", " ").replace("within ", "<")}
                />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                  }}
                  formatter={(value: number, name: string) => [
                    `${value} users (${activation.time_to_first_workout.distribution.find(d => d.count === value)?.percentage || 0}%)`,
                    "Count"
                  ]}
                />
                <Bar dataKey="count" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Workout Quality Tab */}
      {activeTab === "quality" && workoutQuality && (
        <div className="space-y-6">
          {/* Overall Stats */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Started</p>
              <p className="text-2xl font-bold">{workoutQuality.overall.total_started}</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold text-green-500">{workoutQuality.overall.total_completed}</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Abandoned</p>
              <p className="text-2xl font-bold text-red-500">{workoutQuality.overall.total_abandoned}</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Completion Rate</p>
              <p className="text-2xl font-bold text-green-500">{workoutQuality.overall.completion_rate}%</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Abandon Rate</p>
              <p className="text-2xl font-bold text-red-500">{workoutQuality.overall.abandon_rate}%</p>
            </div>
          </div>

          {/* By Mood Category */}
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">Completion Rate by Mood</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={workoutQuality.by_mood_category}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="category" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))" }} domain={[0, 100]} />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                  }}
                />
                <Bar dataKey="completion_rate" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} name="Completion %" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* By Difficulty */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {workoutQuality.by_difficulty.map((diff, index) => (
              <div key={diff.difficulty} className="bg-card border border-border rounded-lg p-4">
                <h4 className="font-medium capitalize mb-3">{diff.difficulty}</h4>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold">{diff.started}</p>
                    <p className="text-xs text-muted-foreground">Started</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-500">{diff.completion_rate}%</p>
                    <p className="text-xs text-muted-foreground">Completed</p>
                  </div>
                </div>
                <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 rounded-full" 
                    style={{ width: `${diff.completion_rate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* By Equipment */}
          {workoutQuality.by_equipment.length > 0 && (
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="p-4 border-b border-border">
                <h3 className="font-medium">Completion by Equipment</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-left p-3 text-sm font-medium">Equipment</th>
                      <th className="text-right p-3 text-sm font-medium">Started</th>
                      <th className="text-right p-3 text-sm font-medium">Completed</th>
                      <th className="text-right p-3 text-sm font-medium">Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workoutQuality.by_equipment.map((eq) => (
                      <tr key={eq.equipment} className="border-b border-border last:border-0">
                        <td className="p-3 font-medium">{eq.equipment}</td>
                        <td className="p-3 text-right">{eq.started}</td>
                        <td className="p-3 text-right">{eq.completed}</td>
                        <td className="p-3 text-right">
                          <span className={eq.completion_rate >= 50 ? "text-green-500" : "text-red-500"}>
                            {eq.completion_rate}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Social Loops Tab */}
      {activeTab === "social" && socialLoops && (
        <div className="space-y-6">
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Users className="h-4 w-4" />
                <span className="text-sm">Active Users</span>
              </div>
              <p className="text-2xl font-bold">{socialLoops.overview.total_active_users}</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Activity className="h-4 w-4" />
                <span className="text-sm">Social Participants</span>
              </div>
              <p className="text-2xl font-bold">{socialLoops.overview.social_participants}</p>
              <p className="text-xs text-muted-foreground">{socialLoops.overview.social_participation_rate}% of active</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <BarChart3 className="h-4 w-4" />
                <span className="text-sm">Total Actions</span>
              </div>
              <p className="text-2xl font-bold">{socialLoops.overview.total_social_actions}</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm">Avg Engagement/Post</span>
              </div>
              <p className="text-2xl font-bold">{socialLoops.content.avg_engagement_per_post}</p>
            </div>
          </div>

          {/* Content Stats */}
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">Content Performance</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <p className="text-3xl font-bold">{socialLoops.content.total_posts}</p>
                <p className="text-sm text-muted-foreground">Total Posts</p>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <p className="text-3xl font-bold">{socialLoops.content.posts_with_engagement}</p>
                <p className="text-sm text-muted-foreground">With Engagement</p>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <p className="text-3xl font-bold text-green-500">{socialLoops.content.engagement_rate}%</p>
                <p className="text-sm text-muted-foreground">Engagement Rate</p>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <p className="text-3xl font-bold">{socialLoops.network.avg_following_per_user}</p>
                <p className="text-sm text-muted-foreground">Avg Following</p>
              </div>
            </div>
          </div>

          {/* Action Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Activity className="h-5 w-5 text-blue-500" />
                </div>
                <span className="font-medium">Posts Created</span>
              </div>
              <p className="text-2xl font-bold">{socialLoops.actions.posts_created.count}</p>
              <p className="text-xs text-muted-foreground">
                {socialLoops.actions.posts_created.unique_users} unique creators
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded-lg bg-red-500/10">
                  <Heart className="h-5 w-5 text-red-500" />
                </div>
                <span className="font-medium">Likes</span>
              </div>
              <p className="text-2xl font-bold">{socialLoops.actions.likes.count}</p>
              <p className="text-xs text-muted-foreground">
                {socialLoops.actions.likes.unique_users} unique likers
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <MessageCircle className="h-5 w-5 text-green-500" />
                </div>
                <span className="font-medium">Comments</span>
              </div>
              <p className="text-2xl font-bold">{socialLoops.actions.comments.count}</p>
              <p className="text-xs text-muted-foreground">
                {socialLoops.actions.comments.unique_users} unique commenters
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <UserPlus className="h-5 w-5 text-purple-500" />
                </div>
                <span className="font-medium">Follows</span>
              </div>
              <p className="text-2xl font-bold">{socialLoops.actions.follows.count}</p>
              <p className="text-xs text-muted-foreground">
                {socialLoops.actions.follows.unique_users} unique followers
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
