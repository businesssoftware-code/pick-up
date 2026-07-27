"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { useAuth } from "../../context/AuthContext";
import { useTripTracking } from "../../context/TripTrackingContext";

import { tripsApi } from "../../api/trips.api";
import { StatusPill } from "../../components/StatusPill";

import type { Trip } from "../../libs/types";

const dateFmt = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

function TripsListInner() {
  const { nameOfDriver, logout } = useAuth();

  const { activeTrips, liveLocations } = useTripTracking();

  const [trips, setTrips] = useState<Trip[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);

    tripsApi
      .getMyTrips(page, 5)
      .then((res) => {
        console.log(res);
        setTrips(res.data);
        setTotalPages(res.pagination.totalPages);
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load trips"),
      )
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div className="min-h-screen pb-32">
      <header className="sticky top-0 z-10 border-b border-neutral-200 bg-white px-5 py-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-neutralText">Hello, {nameOfDriver}</p>

            <h1 className="text-lg font-bold text-neutral-900">My Trips</h1>
          </div>

          <button
            onClick={logout}
            className="text-xs font-medium text-neutralText hover:text-neutral-900"
          >
            Log out
          </button>
        </div>
      </header>

      <div className="px-5 py-4">
        {error && (
          <div className="mb-4 rounded-xl bg-error/10 px-4 py-3 text-sm text-error">
            {error}
          </div>
        )}

        {loading && (
          <p className="py-10 text-center text-sm text-neutralText">
            Loading...
          </p>
        )}

        {!loading && trips.length === 0 && !error && (
          <div className="rounded-2xl border border-dashed border-neutral-200 bg-white p-8 text-center">
            <p className="font-bold text-neutral-900">No trips yet</p>

            <p className="mt-1 text-sm text-neutralText">
              Tap + to schedule your first trip.
            </p>
          </div>
        )}

        <div className="space-y-3">
          {trips.map((trip) => (
            <Link
              key={trip.id}
              href={`/trips/${trip.id}`}
              className="block rounded-2xl border border-neutral-200 bg-white p-4 active:bg-neutral-900/[0.02]"
            >
              <div className="mb-1 flex items-center justify-between">
                <span className="font-mono text-xs text-neutralText">
                  #{trip.id}
                </span>

                <StatusPill status={trip.status} />
              </div>

              <p className="font-medium text-neutral-900">
                {trip.pickupOutlet?.name} → {trip.dropOutlet?.name}
              </p>

              <p className="mt-1 text-xs text-neutralText">
                {dateFmt.format(new Date(trip.tripDate))} ·{" "}
                {trip.vehicle?.vehicleNumber}
              </p>
            </Link>
          ))}
        </div>

        {!loading && totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-lg border px-4 py-2 disabled:opacity-50"
            >
              Previous
            </button>

            <span className="text-sm text-neutralText">
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-lg border px-4 py-2 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {activeTrips?.length > 0 && (
        <div className="fixed bottom-6 left-4 right-4 space-y-3">
          {activeTrips.map((trip) => {
            const liveLocation = liveLocations.get(trip.id);

            return (
              <Link
                key={trip.id}
                href={`/trips/${trip.id}`}
                className="block rounded-2xl bg-primary p-4 text-white shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs opacity-80">Active Trip</p>

                    <p className="font-semibold">
                      {trip.pickupOutlet?.name} → {trip.dropOutlet?.name}
                    </p>
                  </div>

                  
                </div>
                <div className="flex items-center justify-between text-sm">
                    <p>
                      {liveLocation?.remainingDistanceKm != null
                        ? `Distance - ${liveLocation.remainingDistanceKm.toFixed(1)} km`
                        : "--"}
                    </p>

                    <p>
                      {liveLocation?.remainingTimeMinutes != null
                        ? `ETR - ${Math.round(liveLocation.remainingTimeMinutes)} min`
                        : "--"}
                    </p>
                  </div>
              </Link>
            );
          })}
        </div>
      )}

      <Link
        href="/trips/new"
        className="fixed bottom-24 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-2xl text-secondary shadow-lg active:scale-95"
      >
        +
      </Link>
    </div>
  );
}

export default function TripsPage() {
  return (
      <TripsListInner />
  );
}
