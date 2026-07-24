"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { RequireAuth } from "../../context/AuthContext";
import { tripsApi } from "../../api/trips.api";
import { useTripTracking } from "../../context/TripTrackingContext";
import { useLocationBroadcast } from "../../hooks/useLocationBroadcast";
import { StatusPill } from "../../components/StatusPill";
import type { Trip } from "../../libs/types";
import { DriverLiveTripPanel } from "../../components/DriverLiveTripPanel";

const dateFmt = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

function TripDetailInner() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const tripId = Number(params.id);

  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const { activeTrips, liveLocations, connected, refreshActiveTrips } =
    useTripTracking();
  const liveLocation = liveLocations.get(tripId) ?? null;

  const isActiveTrip = activeTrips.some((t) => t.id === tripId);

  useEffect(() => {
    tripsApi
      .findOne(tripId)
      .then(setTrip)
      .catch((err) =>
        setLoadError(
          err instanceof Error ? err.message : "Failed to load trip",
        ),
      )
      .finally(() => setLoading(false));
  }, [tripId]);

  useEffect(() => {
    const activeTrip = activeTrips.find((t) => t.id === tripId);

    if (activeTrip) {
      setTrip(activeTrip);
    }
  }, [activeTrips, tripId]);

  const isOngoing = trip?.status === "STARTED" || trip?.status === "IN_TRANSIT";
  const { error: locationError, lastSentAt } = useLocationBroadcast({
    tripId,
    active: isOngoing,
  });

  async function handleAction(action: "start" | "complete") {
    setActionError(null);
    setActionLoading(true);
    try {
      const updated =
        action === "start"
          ? await tripsApi.startTrip(tripId)
          : await tripsApi.completeTrip(tripId);
      setTrip(updated);
      // refresh global active trip
      await refreshActiveTrips();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Action failed");
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) {
    return (
      <p className="py-10 text-center text-sm text-neutralText">Loading…</p>
    );
  }

  if (loadError || !trip) {
    return (
      <div className="p-5">
        <p className="rounded-xl bg-error/10 px-4 py-3 text-sm text-error">
          {loadError ?? "Trip not found"}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-5 py-6">
      <button
        onClick={() => router.push("/trips")}
        className="mb-4 text-sm font-medium text-neutralText hover:text-neutral-900"
      >
        ← Back
      </button>

      <div className="mb-6 flex items-start justify-between">
        <div>
          <p className="font-mono text-xs text-neutralText">TRIP #{trip.id}</p>
          <h1 className="text-lg font-bold text-neutral-900">
            {trip.pickupOutlet?.name} → {trip.dropOutlet?.name}
          </h1>
        </div>
        <StatusPill status={trip.status} />
      </div>

      <div className="mb-6 space-y-2 rounded-2xl border border-neutral-200 bg-white p-4">
        <Row
          label="Scheduled"
          value={dateFmt.format(new Date(trip.tripDate))}
        />

        <Row
          label="Started"
          value={
            trip.startedAt ? dateFmt.format(new Date(trip.startedAt)) : "-"
          }
        />

        <Row
          label="Completed"
          value={
            trip.completedAt ? dateFmt.format(new Date(trip.completedAt)) : "-"
          }
        />

        <Row label="Vehicle No." value={trip.vehicle?.vehicleNumber} />

        {trip.vehicle?.brand && (
          <Row
            label="Model"
            value={`${trip.vehicle.brand} ${trip.vehicle.model ?? ""}`.trim()}
          />
        )}
      </div>

      {isActiveTrip && (
        <div className="mb-6 h-[550px]">
          <DriverLiveTripPanel
            trip={trip}
            liveLocation={liveLocation}
            connected={connected}
          />
        </div>
      )}

      {actionError && (
        <p className="mb-4 rounded-lg bg-error/10 px-3 py-2 text-sm text-error">
          {actionError}
        </p>
      )}

      {trip.status === "CREATED" && (
        <button
          onClick={() => handleAction("start")}
          disabled={actionLoading}
          className="w-full rounded-xl bg-primary py-3 text-base font-medium text-white transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {actionLoading ? "Starting…" : "Start trip"}
        </button>
      )}

      {trip.status === "IN_TRANSIT" && (
        <button
          onClick={() => handleAction("complete")}
          disabled={actionLoading}
          className="w-full rounded-xl bg-primary py-3 text-base font-medium text-white transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {actionLoading ? "Updating…" : "I've reached"}
        </button>
      )}

      {(trip.status === "COMPLETED" || trip.status === "CANCELLED") && (
        <p className="text-center text-sm text-neutralText">
          This trip is closed.
        </p>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-neutralText">{label}</span>
      <span className="font-medium text-neutral-900">{value}</span>
    </div>
  );
}

export default function TripDetailPage() {
  return (
    <RequireAuth>
      <TripDetailInner />
    </RequireAuth>
  );
}
