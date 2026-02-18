"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import { redirect } from "next/navigation";
import { Settings, Database, UserPlus, AlertCircle, CheckCircle } from "lucide-react";

export default function OpsPage() {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const [envInfo, setEnvInfo] = useState<{
    environment: string;
    is_staging: boolean;
    git_sha: string;
    deployed_at: string;
    seed_version: string;
    admin_allowlist: string[];
  } | null>(null);
  const [grantUsername, setGrantUsername] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [actionResult, setActionResult] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isAdmin)) {
      redirect("/");
    }
  }, [isLoading, isAuthenticated, isAdmin]);

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) return;

    const fetchEnvInfo = async () => {
      const result = await api.getEnvInfo();
      if (result.data) {
        setEnvInfo(result.data);
      }
    };

    fetchEnvInfo();
  }, [isAuthenticated, isAdmin]);

  const handleSeedFeatured = async () => {
    setActionLoading("seed");
    setActionResult(null);
    const result = await api.seedFeaturedWorkouts();
    if (result.data) {
      setActionResult({ type: "success", message: result.data.message || "Featured workouts seeded successfully" });
    } else {
      setActionResult({ type: "error", message: result.error || "Failed to seed workouts" });
    }
    setActionLoading(null);
  };

  const handleGrantAccess = async () => {
    if (!grantUsername.trim()) return;
    setActionLoading("grant");
    setActionResult(null);
    const result = await api.grantAccess(grantUsername.trim());
    if (result.data) {
      setActionResult({
        type: "success",
        message: `Access granted to ${grantUsername}. User ID: ${result.data.user_id}`,
      });
      setGrantUsername("");
    } else {
      setActionResult({ type: "error", message: result.error || "Failed to grant access" });
    }
    setActionLoading(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Ops Tools</h1>
        <p className="text-muted-foreground">Administrative actions and environment info</p>
      </div>

      {/* Action Result */}
      {actionResult && (
        <div
          className={`p-4 rounded-lg flex items-start gap-3 ${
            actionResult.type === "success"
              ? "bg-green-500/10 border border-green-500/20"
              : "bg-red-500/10 border border-red-500/20"
          }`}
        >
          {actionResult.type === "success" ? (
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          )}
          <p className={actionResult.type === "success" ? "text-green-500" : "text-red-500"}>
            {actionResult.message}
          </p>
        </div>
      )}

      {/* Environment Info */}
      {envInfo && (
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-medium">Environment</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Environment</p>
              <p className="font-medium">
                <span
                  className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                    envInfo.is_staging
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-green-500/20 text-green-400"
                  }`}
                >
                  {envInfo.environment.toUpperCase()}
                </span>
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Git SHA</p>
              <p className="font-mono text-sm">
                {envInfo.git_sha !== "missing" ? envInfo.git_sha.slice(0, 7) : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Deployed At</p>
              <p className="text-sm">
                {envInfo.deployed_at !== "missing" ? envInfo.deployed_at : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Seed Version</p>
              <p className="font-mono text-sm">{envInfo.seed_version}</p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground mb-2">Admin Allowlist</p>
            <div className="flex flex-wrap gap-2">
              {envInfo.admin_allowlist.map((admin) => (
                <span
                  key={admin}
                  className="px-2 py-1 bg-muted rounded text-sm font-mono"
                >
                  {admin}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Admin Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Seed Featured Workouts */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Database className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-medium">Seed Featured Workouts</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Re-seed the featured workouts collection with the latest data.
            This will replace any existing featured workouts.
          </p>
          <button
            onClick={handleSeedFeatured}
            disabled={actionLoading === "seed"}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {actionLoading === "seed" ? "Seeding..." : "Seed Workouts"}
          </button>
        </div>

        {/* Grant Access */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <UserPlus className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-medium">Grant Admin Access</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Grant admin privileges to a user by their username.
            Use with caution.
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={grantUsername}
              onChange={(e) => setGrantUsername(e.target.value)}
              placeholder="Enter username"
              className="flex-1 px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              onClick={handleGrantAccess}
              disabled={!grantUsername.trim() || actionLoading === "grant"}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {actionLoading === "grant" ? "Granting..." : "Grant"}
            </button>
          </div>
        </div>
      </div>

      {/* Warning */}
      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-yellow-500">Caution</p>
            <p className="text-sm text-yellow-500/80 mt-1">
              These operations directly modify the database. Use only when necessary
              and ensure you understand the implications of each action.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
