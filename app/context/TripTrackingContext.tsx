"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { useAuth } from "./AuthContext";
import { tripsApi } from "../api/trips.api";
import { getSocket } from "../libs/socket";
import type { Trip, TypeOfLiveLocation } from "../libs/types";

interface TripTrackingContextValue {
  connected: boolean;
  activeTrips: Trip[];
  liveLocations: Map<number, TypeOfLiveLocation>;
  refreshActiveTrips: () => Promise<void>;
  clearActiveTrips: () => void;
}

const TripTrackingContext = createContext<TripTrackingContextValue | null>(
  null,
);

export function TripTrackingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { accessToken } = useAuth();

  const socket = useMemo(() => getSocket(), []);

  const [connected, setConnected] = useState(socket.connected);

  const [activeTrips, setActiveTrips] = useState<Trip[]>([]);

  const [liveLocations, setLiveLocations] = useState(
    new Map<number, TypeOfLiveLocation>(),
  );

  async function refreshActiveTrips() {
    if (!accessToken) return;

    try {
      const trips = await tripsApi.getMyActiveTrips();
      setActiveTrips(trips);
    } catch (err) {
      console.error(err);
    }
  }

  function clearActiveTrips() {
    setActiveTrips([]);
    setLiveLocations(new Map());
  }

  /**
   * Load active trips
   */
  useEffect(() => {
    if (!accessToken) {
      clearActiveTrips();
      return;
    }

    refreshActiveTrips();
  }, [accessToken]);

  /**
   * Socket connection
   */
  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    const onConnect = () => {
      setConnected(true);

      if (accessToken) {
        refreshActiveTrips();
      }
    };

    const onDisconnect = () => {
      setConnected(false);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, [socket, accessToken]);

  /**
   * Join active trip rooms
   */
  useEffect(() => {
    activeTrips.forEach((trip) => {
      socket.emit("join-trip", trip.id);
    });

    return () => {
      activeTrips.forEach((trip) => {
        socket.emit("leave-trip", trip.id);
      });
    };
  }, [socket, activeTrips]);

  /**
   * Live socket updates
   */
  useEffect(() => {
    const handleLocation = (payload: TypeOfLiveLocation) => {
      console.log("SOCKET LOCATION", payload);

      setLiveLocations((prev) => {
        const next = new Map(prev);
        next.set(payload.tripId, payload);
        return next;
      });
      //   setLiveLocations((prev) => {
      //     const next = new Map(prev);
      //     next.set(payload.tripId, payload);
      //     return next;
      //   });
    };

    const handleTripUpdated = (trip: Trip) => {
        console.log(trip, "ldfjlffglg")
      setActiveTrips((prev) => {
        const index = prev.findIndex((t) => t.id === trip.id);

        if (trip.status === "COMPLETED") {
          return prev.filter((t) => t.id !== trip.id);
        }

        if (index === -1) {
          return [...prev, trip];
        }

        const updated = [...prev];
        updated[index] = trip;

        return updated;
      });

      if (trip.status === "COMPLETED") {
        setLiveLocations((prev) => {
          const next = new Map(prev);
          next.delete(trip.id);
          return next;
        });
      }
    };

    socket.on("trip-location-updated", handleLocation);
    socket.on("trip-started", handleTripUpdated);
    socket.on("trip-in-transit", handleTripUpdated);
    socket.on("trip-completed", handleTripUpdated);

    return () => {
      socket.off("trip-location-updated", handleLocation);
      socket.off("trip-started", handleTripUpdated);
      socket.off("trip-in-transit", handleTripUpdated);
      socket.off("trip-completed", handleTripUpdated);
    };
  }, [socket]);

  return (
    <TripTrackingContext.Provider
      value={{
        connected,
        activeTrips,
        liveLocations,
        refreshActiveTrips,
        clearActiveTrips,
      }}
    >
      {children}
    </TripTrackingContext.Provider>
  );
}

export function useTripTracking() {
  const ctx = useContext(TripTrackingContext);

  if (!ctx) {
    throw new Error("useTripTracking must be used inside TripTrackingProvider");
  }

  return ctx;
}
