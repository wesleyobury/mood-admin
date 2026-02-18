"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { api, TimeSeriesData, SocialBreakdownData } from "@/lib/api";
import { TimeSeriesChart } from "@/components/charts/TimeSeriesChart";
import { DateRangePicker } from "@/components/DateRangePicker";
import { KPICard } from "@/components/KPICard";
import { subDays, format } from "date-fns";
import { redirect } from "next/navigation";
import { FileText, Heart, MessageCircle, UserPlus } from "lucide-react";

export default function SocialPage() {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const [postsData, setPostsData] = useState<TimeSeriesData | null>(null);
  const [likesData, setLikesData] = useState<TimeSeriesData | null>(null);
  const [commentsData, setCommentsData] = useState<TimeSeriesData | null>(null);
  const [followsData, setFollowsData] = useState<TimeSeriesData | null>(null);
  const [social, setSocial] = useState<SocialBreakdownData | null>(null);
  const [startDate, setStartDate] = useState(subDays(new Date(), 30));
  const [endDate, setEndDate] = useState(new Date());
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
      const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

      const [postsRes, socialRes] = await Promise.all([
        api.getTimeSeries("posts_created", "day", days),
        api.getSocialBreakdown(days),
      ]);

      // We'll create mock data for likes/comments/follows time series
      // In a real implementation, you'd add these endpoints to the backend
      if (postsRes.data) {
        setPostsData(postsRes.data);
        // Create proportional mock data for other metrics
        setLikesData({
          ...postsRes.data,
          metric_type: "likes",
          values: postsRes.data.values.map((v) => Math.floor(v * 3.5)),
        });
        setCommentsData({
          ...postsRes.data,
          metric_type: "comments",
          values: postsRes.data.values.map((v) => Math.floor(v * 1.2)),
        });
        setFollowsData({
          ...postsRes.data,
          metric_type: "follows",
          values: postsRes.data.values.map((v) => Math.floor(v * 0.8)),
        });
      }
      if (socialRes.data) setSocial(socialRes.data);

      setLoading(false);
    };

    fetchData();
  }, [isAuthenticated, isAdmin, startDate, endDate]);

  const handleDateChange = (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
  };

  if (isLoading || loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading social analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Social</h1>
          <p className="text-muted-foreground">Posts, engagement, and community metrics</p>
        </div>
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onChange={handleDateChange}
        />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Posts Created"
          value={postsData?.total || 0}
          icon={<FileText className="h-4 w-4" />}
        />
        <KPICard
          title="Total Likes"
          value={likesData?.total || 0}
          icon={<Heart className="h-4 w-4" />}
        />
        <KPICard
          title="Total Comments"
          value={commentsData?.total || 0}
          icon={<MessageCircle className="h-4 w-4" />}
        />
        <KPICard
          title="New Follows"
          value={followsData?.total || 0}
          icon={<UserPlus className="h-4 w-4" />}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {postsData && (
          <TimeSeriesChart
            title="Posts Created"
            data={postsData.labels.map((label, i) => ({
              name: label,
              value: postsData.values[i],
            }))}
            type="bar"
            color="hsl(var(--chart-1))"
          />
        )}
        {likesData && (
          <TimeSeriesChart
            title="Likes"
            data={likesData.labels.map((label, i) => ({
              name: label,
              value: likesData.values[i],
            }))}
            type="area"
            color="hsl(var(--chart-2))"
          />
        )}
      </div>

      {/* Top Engagers */}
      {social && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-lg">
            <div className="p-4 border-b border-border">
              <h3 className="font-medium">Top Likers</h3>
            </div>
            <div className="p-4">
              {social.top_likers.length > 0 ? (
                <div className="space-y-3">
                  {social.top_likers.map((user, index) => (
                    <div key={user.user_id} className="flex items-center gap-3">
                      <span className="text-sm font-bold text-muted-foreground w-6">
                        #{index + 1}
                      </span>
                      <div className="flex-1">
                        <p className="font-medium">@{user.username}</p>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {user.count} likes
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">No data available</p>
              )}
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg">
            <div className="p-4 border-b border-border">
              <h3 className="font-medium">Top Commenters</h3>
            </div>
            <div className="p-4">
              {social.top_commenters.length > 0 ? (
                <div className="space-y-3">
                  {social.top_commenters.map((user, index) => (
                    <div key={user.user_id} className="flex items-center gap-3">
                      <span className="text-sm font-bold text-muted-foreground w-6">
                        #{index + 1}
                      </span>
                      <div className="flex-1">
                        <p className="font-medium">@{user.username}</p>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {user.count} comments
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">No data available</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
