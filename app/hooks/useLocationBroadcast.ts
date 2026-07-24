"use client";

import { useEffect, useRef, useState } from "react";
import { getSocket } from "../libs/socket";

interface UseLocationBroadcastOptions {
  tripId: number;
  active: boolean; // only track/emit while true (i.e. trip is ONGOING)
  intervalMs?: number; // throttle how often we emit, default 5s
}

/**
 * Watches the device's GPS via watchPosition and emits a 'driver-location'
 * event over the socket at most once every `intervalMs`, while `active` is
 * true. Requires a matching @SubscribeMessage('driver-location') handler on
 * TripGateway that relays it to the trip's room (see notes) — this isn't
 * part of the gateway code shared so far, so it needs to be added.
 */
export function useLocationBroadcast({
  tripId,
  active,
  intervalMs = 5000,
}: UseLocationBroadcastOptions) {
  const [error, setError] = useState<string | null>(null);
  const [lastSentAt, setLastSentAt] = useState<number | null>(null);
  const lastEmitRef = useRef(0);
  const watchIdRef = useRef<number | null>(null);

  useEffect(() => {
    console.log("Location effect", {
      active,
      tripId,
      intervalMs,
    });

    if (!active) {
      console.log("Location broadcast inactive");
      return;
    }

    if (!("geolocation" in navigator)) {
      setError("Location services are not available on this device.");
      return;
    }

    const socket = getSocket();

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const now = Date.now();

        if (lastEmitRef.current && now - lastEmitRef.current < intervalMs) {
          return;
        }

        lastEmitRef.current = now;

        socket.emit("trip-location", {
          tripId,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          speed: position.coords.speed ?? undefined,
          heading: position.coords.heading ?? undefined,
        });
        console.log("Sending GPS", {
          tripId,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          time: new Date().toLocaleTimeString(),
        });
        setLastSentAt(now);
        setError(null);
      },
      (geoError) => {
        console.error("Geolocation Error", {
          code: geoError.code,
          message: geoError.message,
        });
        setError(geoError.message || "Unable to get your location.");
      },
      {
        enableHighAccuracy: false,
        maximumAge: 0,
        timeout: 30000,
      },
    );

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [active, tripId, intervalMs]);

  return { error, lastSentAt };
}
