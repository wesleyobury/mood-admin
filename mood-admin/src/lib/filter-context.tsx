"use client";

import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import { subDays, startOfDay, endOfDay, format } from "date-fns";

export interface GlobalFilters {
  startDate: Date;
  endDate: Date;
  granularity: "hour" | "day" | "week";
  compareEnabled: boolean;
  includeInternal: boolean;
  segments: {
    userType: string[];
    platform: string[];
  };
}

export const defaultFilters: GlobalFilters = {
  startDate: subDays(new Date(), 7),
  endDate: new Date(),
  granularity: "day",
  compareEnabled: false,
  includeInternal: false,
  segments: {
    userType: [],
    platform: [],
  },
};

interface FilterContextType {
  filters: GlobalFilters;
  setFilters: React.Dispatch<React.SetStateAction<GlobalFilters>>;
  updateFilters: (updates: Partial<GlobalFilters>) => void;
  resetFilters: () => void;
  // Computed values for API calls
  days: number;
  startDateStr: string;
  endDateStr: string;
  periodParam: string;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = useState<GlobalFilters>(defaultFilters);

  const updateFilters = useCallback((updates: Partial<GlobalFilters>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  // Computed values
  const days = useMemo(() => {
    return Math.ceil(
      (filters.endDate.getTime() - filters.startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
  }, [filters.startDate, filters.endDate]);

  const startDateStr = useMemo(() => {
    return format(filters.startDate, "yyyy-MM-dd");
  }, [filters.startDate]);

  const endDateStr = useMemo(() => {
    return format(filters.endDate, "yyyy-MM-dd");
  }, [filters.endDate]);

  const periodParam = useMemo(() => {
    return filters.granularity;
  }, [filters.granularity]);

  return (
    <FilterContext.Provider
      value={{
        filters,
        setFilters,
        updateFilters,
        resetFilters,
        days,
        startDateStr,
        endDateStr,
        periodParam,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error("useFilters must be used within a FilterProvider");
  }
  return context;
}
