"use client";

import { Download } from "lucide-react";
import { downloadCSV } from "@/lib/utils";

interface CSVExportProps {
  data: Record<string, unknown>[];
  filename: string;
  disabled?: boolean;
}

export function CSVExport({ data, filename, disabled = false }: CSVExportProps) {
  const handleExport = () => {
    if (data.length === 0) return;
    downloadCSV(data, filename);
  };

  return (
    <button
      onClick={handleExport}
      disabled={disabled || data.length === 0}
      className="flex items-center gap-2 px-3 py-2 text-sm bg-card border border-border rounded-md hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      title="Export to CSV"
    >
      <Download className="h-4 w-4" />
      <span>Export</span>
    </button>
  );
}
