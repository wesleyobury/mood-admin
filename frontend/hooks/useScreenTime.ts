/**
 * Screen Time Tracking Hook
 * 
 * Automatically tracks time spent on each screen when user navigates.
 * Uses useFocusEffect to track when screens come into/out of focus.
 */

import { useRef, useCallback, useEffect } from 'react';
import { useFocusEffect } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { Analytics, ScreenTimeTracker } from '../utils/analytics';

/**
 * Hook to track time spent on a screen
 * @param screenName - Name of the screen to track (e.g., 'Home', 'Explore', 'Profile')
 */
export const useScreenTime = (screenName: string) => {
  const { token } = useAuth();
  const trackerRef = useRef<ScreenTimeTracker | null>(null);

  useFocusEffect(
    useCallback(() => {
      // Screen came into focus - start tracking
      if (token) {
        trackerRef.current = new ScreenTimeTracker(screenName, token);
      }

      // Cleanup function - called when screen loses focus
      return () => {
        if (trackerRef.current) {
          trackerRef.current.stop();
          trackerRef.current = null;
        }
      };
    }, [token, screenName])
  );

  return null;
};

/**
 * Hook to manually track screen time (for non-tab screens)
 * Returns start/stop functions for manual control
 */
export const useManualScreenTime = (screenName: string) => {
  const { token } = useAuth();
  const trackerRef = useRef<ScreenTimeTracker | null>(null);

  const startTracking = useCallback(() => {
    if (token && !trackerRef.current) {
      trackerRef.current = new ScreenTimeTracker(screenName, token);
    }
  }, [token, screenName]);

  const stopTracking = useCallback(() => {
    if (trackerRef.current) {
      const duration = trackerRef.current.stop();
      trackerRef.current = null;
      return duration;
    }
    return 0;
  }, []);

  // Auto-stop on unmount
  useEffect(() => {
    return () => {
      if (trackerRef.current) {
        trackerRef.current.stop();
        trackerRef.current = null;
      }
    };
  }, []);

  return { startTracking, stopTracking };
};

export default useScreenTime;
