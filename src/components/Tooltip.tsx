"use client";

import { useState, useRef, useEffect } from "react";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface TooltipProps {
  content: string;
  children?: React.ReactNode;
  className?: string;
  side?: "top" | "bottom" | "left" | "right";
}

export function Tooltip({ content, children, className, side = "top" }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <div className={cn("relative inline-flex", className)}>
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="cursor-help"
      >
        {children || <Info className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground transition-colors" />}
      </div>
      {isVisible && (
        <div
          ref={tooltipRef}
          className={cn(
            "absolute z-50 px-3 py-2 text-xs bg-popover border border-border rounded-md shadow-lg max-w-[280px] whitespace-normal",
            positionClasses[side]
          )}
        >
          <div className="text-popover-foreground">{content}</div>
        </div>
      )}
    </div>
  );
}

// Metric definitions for tooltips
export const METRIC_TOOLTIPS = {
  // Engagement
  dau: "Daily Active Users: Unique users with at least one app_session_start event today (UTC).",
  wau: "Weekly Active Users: Unique users with app_session_start in the last 7 days.",
  mau: "Monthly Active Users: Unique users with app_session_start in the last 30 days.",
  stickiness: "DAU/MAU Stickiness: Ratio of daily to monthly active users. Higher = users return more frequently.",
  wauMauRatio: "WAU/MAU Ratio: Weekly engagement relative to monthly. Indicates weekly return patterns.",
  
  // Users
  activeUsers: "Active Users: Unique users with any event in the selected period.",
  newUsers: "New Users: Users whose account was created (users.created_at) in the selected period.",
  
  // Workouts
  workoutsStarted: "Workouts Started: Total count of workout_started events in the period.",
  workoutsCompleted: "Workouts Completed: Total count of workout_completed events in the period.",
  completionRate: "Completion Rate: (workouts_completed / workouts_started) × 100. Event-based, not session-based.",
  
  // Activation
  activationRate: "Activation Rate: % of new users who completed their first workout within 48 hours of signup.",
  timeToFirstWorkout: "Time to First Workout: Median time from signup to first workout_completed event.",
  
  // Social
  postsCreated: "Posts Created: Total post_created events in the period.",
  likes: "Likes: Total post_liked events in the period.",
  comments: "Comments: Total post_commented events in the period.",
  follows: "Follows: Total user_followed events in the period.",
  notificationClicks: "Notification Clicks: Total notification_clicked events. Proxy for push engagement.",
  
  // Retention
  d1Retention: "D1 Retention: % of cohort users who had app_session_start on day 1 after signup.",
  d7Retention: "D7 Retention: % of cohort users who returned on day 7 after signup.",
  d28Retention: "D28 Retention: % of cohort users who returned on day 28 after signup.",
  
  // Funnel
  funnelConversion: "Conversion Rate: % of users from previous step who completed this step.",
  funnelDropoff: "Dropoff Rate: % of users from previous step who did NOT complete this step.",
  overallConversion: "Overall Conversion: % of entry users who completed the final funnel step.",
  
  // Data Quality
  dataFreshness: "Last Event: Most recent event timestamp in user_events. Indicates data pipeline health.",
  eventsPerHour: "Events/Hour: Event count in the last 60 minutes. Low values may indicate tracking issues.",
  
  // Filters
  includeInternal: "Include Internal: When OFF (default), excludes staff/test accounts (is_internal=true) from all metrics.",
  comparePeriod: "Compare Period: Shows % change vs the same-length period immediately before the selected range.",
};
