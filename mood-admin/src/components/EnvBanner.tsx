"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export function EnvBanner() {
  const [envInfo, setEnvInfo] = useState<{
    environment: string;
    is_staging: boolean;
    git_sha: string;
    deployed_at: string;
  } | null>(null);

  const envName = process.env.NEXT_PUBLIC_ENV_NAME || "UNKNOWN";
  const isStaging = envName === "STAGING";

  useEffect(() => {
    const fetchEnvInfo = async () => {
      const result = await api.getEnvInfo();
      if (result.data) {
        setEnvInfo(result.data);
      }
    };
    fetchEnvInfo();
  }, []);

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
          MOOD Admin Dashboard
        </span>
      </div>
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        {envInfo && (
          <>
            <span>SHA: {envInfo.git_sha.slice(0, 7)}</span>
            <span>
              Deployed: {envInfo.deployed_at !== "missing" ? envInfo.deployed_at : "N/A"}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
