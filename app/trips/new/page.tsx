'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { RequireAuth, useAuth } from '../../context/AuthContext';
import { tripsApi } from '../../api/trips.api';
import { lookupsApi } from '../../api/lookups.api';
import type { CreateTripPayload, Outlet, Vehicle } from '../../libs/types';

function NewTripInner() {
  const router = useRouter();
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [pickupOutletId, setPickupOutletId] = useState(0);
  const [dropOutletId, setDropOutletId] = useState(0);
  const [vehicleId, setVehicleId] = useState(0);
  const [tripDate, setTripDate] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {driverId} = useAuth();

  useEffect(() => {
    Promise.all([lookupsApi.getOutlets(), lookupsApi.getVehicles()])
      .then(([o, v]) => {
        setOutlets(o);
        setVehicles(v);
      })
      .catch((err) => setLoadError(err instanceof Error ? err.message : 'Failed to load'));
  }, []);

  const isValid =
    pickupOutletId > 0 && dropOutletId > 0 && vehicleId > 0 && tripDate !== '' && pickupOutletId !== dropOutletId;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pickupOutletId === dropOutletId) {
      setError('Pickup and drop outlet cannot be the same.');
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const payload: CreateTripPayload = {
        vehicleId,
        pickupOutletId,
        dropOutletId,
        tripDate: new Date(tripDate).toISOString(),
        driverId: Number(driverId),
      };
      const created = await tripsApi.create(payload);
      router.replace(`/trips/${created.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create trip');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen px-5 py-6">
      <button
        onClick={() => router.back()}
        className="mb-4 text-sm font-medium text-neutralText hover:text-neutral-900"
      >
        ← Back
      </button>

      <h1 className="mb-6 text-lg font-bold text-neutral-900">Schedule a trip</h1>

      {loadError && (
        <div className="mb-4 rounded-xl bg-error/10 px-4 py-3 text-sm text-error">{loadError}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="From outlet">
          <select
            value={pickupOutletId || ''}
            onChange={(e) => setPickupOutletId(Number(e.target.value))}
            className="select"
          >
            <option value="" disabled>Select pickup outlet</option>
            {outlets.map((o) => (
              <option key={o.id} value={o.id}>{o.name}</option>
            ))}
          </select>
        </Field>

        <Field label="To outlet">
          <select
            value={dropOutletId || ''}
            onChange={(e) => setDropOutletId(Number(e.target.value))}
            className="select"
          >
            <option value="" disabled>Select drop outlet</option>
            {outlets.map((o) => (
              <option key={o.id} value={o.id}>{o.name}</option>
            ))}
          </select>
        </Field>

        <Field label="Vehicle">
          <select
            value={vehicleId || ''}
            onChange={(e) => setVehicleId(Number(e.target.value))}
            className="select"
          >
            <option value="" disabled>Select vehicle</option>
            {vehicles.filter((v) => v.isActive).map((v) => (
              <option key={v.id} value={v.id}>{v.vehicleNumber}</option>
            ))}
          </select>
        </Field>

        <Field label="Date & time">
          <input
            type="datetime-local"
            value={tripDate}
            onChange={(e) => setTripDate(e.target.value)}
            className="select"
          />
        </Field>

        {error && (
          <p className="rounded-lg bg-error/10 px-3 py-2 text-sm text-error">{error}</p>
        )}

        <button
          type="submit"
          disabled={!isValid || submitting}
          className="w-full rounded-xl bg-primary py-3 text-base font-medium text-white transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {submitting ? 'Scheduling…' : 'Schedule trip'}
        </button>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-neutralText">
        {label}
      </span>
      {children}
    </label>
  );
}

export default function NewTripPage() {
  return (
    <RequireAuth>
      <NewTripInner />
    </RequireAuth>
  );
}
