'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { calculateDistance } from '@/lib/geo/perimeter';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  altitude: number | null;
  speed: number | null;
  heading: number | null;
  timestamp: number | null;
  error: GeolocationPositionError | null;
  loading: boolean;
}

const initialState: GeolocationState = {
  latitude: null,
  longitude: null,
  accuracy: null,
  altitude: null,
  speed: null,
  heading: null,
  timestamp: null,
  error: null,
  loading: false,
};

interface UseGeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

const defaultOptions: UseGeolocationOptions = {
  enableHighAccuracy: true,
  timeout: 15000,
  maximumAge: 0,
};

export function useGeolocation(options: UseGeolocationOptions = {}) {
  const [state, setState] = useState<GeolocationState>(initialState);
  const watchIdRef = useRef<number | null>(null);

  const opts = { ...defaultOptions, ...options };

  const updatePosition = useCallback((position: GeolocationPosition) => {
    setState({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      altitude: position.coords.altitude,
      speed: position.coords.speed,
      heading: position.coords.heading,
      timestamp: position.timestamp,
      error: null,
      loading: false,
    });
  }, []);

  const handleError = useCallback((error: GeolocationPositionError) => {
    setState((prev) => ({ ...prev, error, loading: false }));
  }, []);

  const getCurrentPosition = useCallback(() => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        error: {
          code: 2,
          message: 'Geolocation is not supported by this browser.',
          PERMISSION_DENIED: 1,
          POSITION_UNAVAILABLE: 2,
          TIMEOUT: 3,
        } as GeolocationPositionError,
        loading: false,
      }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true }));
    navigator.geolocation.getCurrentPosition(updatePosition, handleError, opts);
  }, [updatePosition, handleError, opts]);

  const watchPosition = useCallback(() => {
    if (!navigator.geolocation) return;

    setState((prev) => ({ ...prev, loading: true }));
    watchIdRef.current = navigator.geolocation.watchPosition(
      updatePosition,
      handleError,
      opts
    );
  }, [updatePosition, handleError, opts]);

  const clearWatch = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  // Clean up watch on unmount
  useEffect(() => {
    return () => {
      clearWatch();
    };
  }, [clearWatch]);

  const isWithinPerimeter = useCallback(
    (siteLat: number, siteLng: number, radiusMeters: number): boolean | null => {
      if (state.latitude === null || state.longitude === null) return null;
      const distance = calculateDistance(
        state.latitude,
        state.longitude,
        siteLat,
        siteLng
      );
      return distance <= radiusMeters;
    },
    [state.latitude, state.longitude]
  );

  return {
    ...state,
    getCurrentPosition,
    watchPosition,
    clearWatch,
    isWithinPerimeter,
  };
}
