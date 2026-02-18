"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { api, UserSearchResult, UserTimelineData } from "@/lib/api";
import { CSVExport } from "@/components/CSVExport";
import { redirect } from "next/navigation";
import { Search, User, Mail, Calendar, Activity, Clock } from "lucide-react";
import { formatDate, formatDateTime } from "@/lib/utils";

export default function UsersPage() {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserSearchResult | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [userTimeline, setUserTimeline] = useState<UserTimelineData | null>(null);
  const [loading, setLoading] = useState(false);
  const [timelineLoading, setTimelineLoading] = useState(false);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isAdmin)) {
      redirect("/");
    }
  }, [isLoading, isAuthenticated, isAdmin]);

  const handleSearch = async () => {
    if (searchQuery.length < 2) return;
    setLoading(true);
    const result = await api.searchUsers(searchQuery);
    if (result.data) {
      setSearchResults(result.data);
    }
    setLoading(false);
  };

  const handleSelectUser = async (userId: string) => {
    setSelectedUser(userId);
    setTimelineLoading(true);
    const result = await api.getUserTimeline(userId);
    if (result.data) {
      setUserTimeline(result.data);
    }
    setTimelineLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const getExportData = () => {
    if (!searchResults) return [];
    return searchResults.users.map((u) => ({
      Username: u.username,
      Email: u.email,
      Name: u.name,
      "Created At": u.created_at,
      "Last Active": u.last_active,
      "Auth Provider": u.auth_provider,
      "Sessions (30d)": u.activity_30d.sessions,
      "Workouts Started (30d)": u.activity_30d.workouts_started,
      "Workouts Completed (30d)": u.activity_30d.workouts_completed,
      "Posts (30d)": u.activity_30d.posts,
      Followers: u.followers_count,
      Following: u.following_count,
      Streak: u.current_streak,
    }));
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">User Explorer</h1>
          <p className="text-muted-foreground">Search and view user profiles and activity</p>
        </div>
        {searchResults && searchResults.users.length > 0 && (
          <CSVExport data={getExportData()} filename={`users-search-${searchQuery}.csv`} />
        )}
      </div>

      {/* Search Box */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search by username, email, or user ID..."
            className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={searchQuery.length < 2 || loading}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Search Results */}
        <div className="lg:col-span-1">
          {searchResults && (
            <div className="bg-card border border-border rounded-lg">
              <div className="p-4 border-b border-border">
                <h3 className="font-medium">
                  Results ({searchResults.total})
                </h3>
              </div>
              <div className="max-h-[600px] overflow-y-auto">
                {searchResults.users.length > 0 ? (
                  searchResults.users.map((user) => (
                    <button
                      key={user.user_id}
                      onClick={() => handleSelectUser(user.user_id)}
                      className={`w-full p-4 text-left border-b border-border last:border-0 hover:bg-accent transition-colors ${
                        selectedUser === user.user_id ? "bg-accent" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.username}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <User className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">@{user.username}</p>
                          <p className="text-sm text-muted-foreground truncate">
                            {user.email}
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                            <span>{user.activity_30d.workouts_completed} workouts</span>
                            <span>•</span>
                            <span>{user.current_streak} streak</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-8 text-center text-muted-foreground">
                    No users found
                  </div>
                )}
              </div>
            </div>
          )}

          {!searchResults && (
            <div className="bg-card border border-border rounded-lg p-8 text-center">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Search for users to explore</p>
            </div>
          )}
        </div>

        {/* User Details */}
        <div className="lg:col-span-2">
          {timelineLoading ? (
            <div className="bg-card border border-border rounded-lg p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading user details...</p>
            </div>
          ) : userTimeline ? (
            <div className="space-y-6">
              {/* User Profile Card */}
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                    {userTimeline.user.avatar ? (
                      <img
                        src={userTimeline.user.avatar}
                        alt={userTimeline.user.username}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-8 w-8 text-primary" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold">@{userTimeline.user.username}</h2>
                      {userTimeline.user.is_admin && (
                        <span className="px-2 py-0.5 bg-primary/20 text-primary text-xs rounded">
                          Admin
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground">{userTimeline.user.email}</p>
                    {userTimeline.user.name && (
                      <p className="text-sm">{userTimeline.user.name}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{userTimeline.user.current_streak}</p>
                    <p className="text-sm text-muted-foreground">Streak</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{userTimeline.user.total_workouts}</p>
                    <p className="text-sm text-muted-foreground">Workouts</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{userTimeline.total_events}</p>
                    <p className="text-sm text-muted-foreground">Events</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{userTimeline.active_sessions.length}</p>
                    <p className="text-sm text-muted-foreground">Sessions</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 mt-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {userTimeline.user.created_at ? formatDate(userTimeline.user.created_at) : "N/A"}</span>
                  </div>
                </div>
              </div>

              {/* Login History */}
              {userTimeline.login_history.length > 0 && (
                <div className="bg-card border border-border rounded-lg">
                  <div className="p-4 border-b border-border">
                    <h3 className="font-medium">Recent Logins</h3>
                  </div>
                  <div className="divide-y divide-border">
                    {userTimeline.login_history.slice(0, 5).map((login, index) => (
                      <div key={index} className="p-4 flex items-center justify-between">
                        <div>
                          <p className="font-medium capitalize">{login.method}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDateTime(login.timestamp)}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-0.5 text-xs rounded ${
                            login.success
                              ? "bg-green-500/20 text-green-500"
                              : "bg-red-500/20 text-red-500"
                          }`}
                        >
                          {login.success ? "Success" : "Failed"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Event Timeline */}
              <div className="bg-card border border-border rounded-lg">
                <div className="p-4 border-b border-border">
                  <h3 className="font-medium">Activity Timeline ({userTimeline.total_events} events)</h3>
                </div>
                <div className="max-h-[400px] overflow-y-auto divide-y divide-border">
                  {userTimeline.events.slice(0, 50).map((event) => (
                    <div key={event.event_id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">{event.event_label}</p>
                          <p className="text-xs text-muted-foreground">{event.event_type}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">
                            {formatDateTime(event.timestamp)}
                          </p>
                          <span className="text-xs px-2 py-0.5 bg-muted rounded capitalize">
                            {event.category}
                          </span>
                        </div>
                      </div>
                      {Object.keys(event.metadata).length > 0 && (
                        <div className="mt-2 text-xs text-muted-foreground bg-muted/50 rounded p-2">
                          {JSON.stringify(event.metadata, null, 2)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-lg p-8 text-center">
              <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Select a user to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
