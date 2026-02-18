"use client";

import { useEffect, useState } from "react";
import { api, DataFreshnessData } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Database, Clock } from "lucide-react";

export function EnvBanner() {
  const { isAuthenticated } = useAuth();
  const [freshness, setFreshness] = useState<DataFreshnessData | null>(null);
  const [apiError, setApiError] = useState(false);

  // Derive env info from freshness data
  const envName = freshness?.environment?.toUpperCase() || process.env.NEXT_PUBLIC_ENV_NAME || "UNKNOWN";
  const isStaging = envName === "STAGING" || envName === "staging";

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated) return;
      
      const result = await api.getDataFreshness();
      if (result.data) {
        setFreshness(result.data);
        setApiError(false);
      } else if (result.error) {
        setApiError(true);
      }
    };
    
    fetchData();
    // Refresh every 60 seconds
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const formatLastEvent = (isoString: string | null) => {
    if (!isoString) return "No events";
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div
      className={`h-10 flex items-center justify-between px-4 text-sm font-medium ${
        isStaging
          ? "bg-yellow-500/20 text-yellow-400 border-b border-yellow-500/30"
          : "bg-green-500/20 text-green-400 border-b border-green-500/30"
      }`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`px-2 py-0.5 rounded text-xs font-bold ${
            isStaging ? "bg-yellow-500/30" : "bg-green-500/30"
          }`}
        >
          {envName}
        </span>
        <span className="text-muted-foreground text-xs">
          MOOD Admin
        </span>
        {apiError && (
          <span className="text-red-400 text-xs">
            (API unreachable)
          </span>
        )}
      </div>
      
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        {freshness && (
          <>
            {/* Data Freshness */}
            <div className="flex items-center gap-1.5" title={`Last event: ${freshness.last_event_at || 'None'}`}>
              <Database className="h-3 w-3" />
              <span>Last event: {formatLastEvent(freshness.last_event_at)}</span>
              {freshness.events_last_hour > 0 && (
                <span className="text-green-400">({freshness.events_last_hour}/hr)</span>
              )}
            </div>
            
            <span className="opacity-30">|</span>
            
            {/* Git SHA */}
            <span title={freshness.git_sha}>
              SHA: {freshness.git_sha?.slice(0, 7) || "N/A"}
            </span>
            
            {/* Deployed At */}
            <span>
              Deployed: {freshness.deployed_at !== "missing" ? freshness.deployed_at : "N/A"}
            </span>
            
            <span className="opacity-40">UTC</span>
          </>
        )}
      </div>
    </div>
  );
}
