"use client";

import { useState, useEffect, useRef } from "react";
import { Bookmark, ChevronDown, Check, Trash2, Star, Plus, Loader2 } from "lucide-react";
import { api, SavedView, SavedViewConfig } from "@/lib/api";
import { cn } from "@/lib/utils";

interface SavedViewsDropdownProps {
  viewType: "overview" | "funnel" | "retention" | "custom";
  currentConfig: SavedViewConfig;
  onLoadView: (config: SavedViewConfig) => void;
  onSaveView: (name: string, isDefault: boolean) => Promise<void>;
}

export function SavedViewsDropdown({
  viewType,
  currentConfig,
  onLoadView,
  onSaveView,
}: SavedViewsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [views, setViews] = useState<SavedView[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [newViewName, setNewViewName] = useState("");
  const [newViewDefault, setNewViewDefault] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowSaveForm(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch views when dropdown opens
  useEffect(() => {
    if (isOpen) {
      fetchViews();
    }
  }, [isOpen]);

  const fetchViews = async () => {
    setLoading(true);
    const res = await api.getSavedViews(viewType);
    if (res.data) {
      setViews(res.data.views);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!newViewName.trim()) return;
    setSaving(true);
    await onSaveView(newViewName.trim(), newViewDefault);
    setNewViewName("");
    setNewViewDefault(false);
    setShowSaveForm(false);
    await fetchViews();
    setSaving(false);
  };

  const handleDelete = async (viewId: string) => {
    if (!confirm("Are you sure you want to delete this view?")) return;
    await api.deleteSavedView(viewId);
    await fetchViews();
  };

  const handleSetDefault = async (view: SavedView) => {
    await api.updateSavedView(view.id, { is_default: true });
    await fetchViews();
  };

  const handleLoadView = (view: SavedView) => {
    onLoadView(view.config);
    setIsOpen(false);
  };

  const defaultView = views.find((v) => v.is_default);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm bg-card border border-border rounded-lg hover:border-primary/50 transition-colors"
      >
        <Bookmark className="h-4 w-4 text-muted-foreground" />
        <span>{defaultView ? defaultView.name : "Saved Views"}</span>
        <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-72 bg-card border border-border rounded-lg shadow-lg z-50">
          {/* Header */}
          <div className="p-3 border-b border-border flex items-center justify-between">
            <span className="text-sm font-medium">Saved Views</span>
            <button
              onClick={() => setShowSaveForm(true)}
              className="flex items-center gap-1 text-xs text-primary hover:underline"
            >
              <Plus className="h-3 w-3" />
              Save Current
            </button>
          </div>

          {/* Save Form */}
          {showSaveForm && (
            <div className="p-3 border-b border-border bg-muted/50">
              <input
                type="text"
                value={newViewName}
                onChange={(e) => setNewViewName(e.target.value)}
                placeholder="View name..."
                className="w-full px-2 py-1.5 text-sm bg-background border border-border rounded-md mb-2"
                autoFocus
              />
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={newViewDefault}
                    onChange={(e) => setNewViewDefault(e.target.checked)}
                    className="rounded"
                  />
                  Set as default
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowSaveForm(false)}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving || !newViewName.trim()}
                    className="flex items-center gap-1 px-2 py-1 text-xs bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Views List */}
          <div className="max-h-64 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center">
                <Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" />
              </div>
            ) : views.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No saved views yet
              </div>
            ) : (
              views.map((view) => (
                <div
                  key={view.id}
                  className="flex items-center justify-between p-3 hover:bg-muted/50 group"
                >
                  <button
                    onClick={() => handleLoadView(view)}
                    className="flex-1 text-left text-sm"
                  >
                    <div className="flex items-center gap-2">
                      {view.is_default && <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />}
                      <span className="font-medium">{view.name}</span>
                    </div>
                    {view.description && (
                      <p className="text-xs text-muted-foreground mt-0.5">{view.description}</p>
                    )}
                  </button>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!view.is_default && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSetDefault(view);
                        }}
                        className="p-1 text-muted-foreground hover:text-yellow-500"
                        title="Set as default"
                      >
                        <Star className="h-3.5 w-3.5" />
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(view.id);
                      }}
                      className="p-1 text-muted-foreground hover:text-red-500"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
