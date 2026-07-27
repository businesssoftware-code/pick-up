"use client";

import {
  GoogleMap,
  Marker,
  Polyline,
  useJsApiLoader,
} from "@react-google-maps/api";
import { useEffect, useMemo, useRef } from "react";

import { Trip, TypeOfLiveLocation } from "../libs/types";

interface DriverLiveTripPanelProps {
  trip: Trip;
  liveLocation: TypeOfLiveLocation | null;
  connected: boolean;
}

const containerStyle = {
  width: "100%",
  height: "100%",
};

const mapStyles: google.maps.MapTypeStyle[] = [
  {
    featureType: "poi",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "transit",
    stylers: [{ visibility: "off" }],
  },
];

const LIBRARIES: "geometry"[] = ["geometry"];

export function DriverLiveTripPanel({
  trip,
  liveLocation,
  connected,
}: DriverLiveTripPanelProps) {
  const mapRef = useRef<google.maps.Map | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: "driver-live-map",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
    libraries: LIBRARIES,
  });

  console.log(
    "DriverLiveTripPanel render",
    Date.now(),
    liveLocation?.latitude,
    liveLocation?.longitude,
  );

  const center = useMemo(() => {
    if (liveLocation) {
      return {
        lat: liveLocation.latitude,
        lng: liveLocation.longitude,
      };
    }

    if (trip.pickupOutlet?.latitude && trip.pickupOutlet?.longitude) {
      return {
        lat: Number(trip.pickupOutlet.latitude),
        lng: Number(trip.pickupOutlet.longitude),
      };
    }

    return {
      lat: 28.6139,
      lng: 77.209,
    };
  }, [liveLocation, trip]);

  useEffect(() => {
    console.log("panTo()", Date.now());

    if (!mapRef.current || !liveLocation) return;

    mapRef.current.panTo({
      lat: liveLocation.latitude,
      lng: liveLocation.longitude,
    });
  }, [liveLocation]);

  const polylinePath = useMemo(() => {
    if (!isLoaded || !liveLocation?.polyline) {
      return [];
    }

    return google.maps.geometry.encoding.decodePath(liveLocation.polyline);
  }, [isLoaded, liveLocation?.polyline]);

  console.log(polylinePath, "polylinePathpolylinePath");
  const initialCenter = useMemo(
    () => ({
      lat: Number(trip.pickupOutlet.latitude),
      lng: Number(trip.pickupOutlet.longitude),
    }),
    [trip],
  );

  const driverPosition = useMemo(
    () =>
      liveLocation
        ? {
            lat: liveLocation.latitude,
            lng: liveLocation.longitude,
          }
        : null,
    [liveLocation?.latitude, liveLocation?.longitude],
  );

  const isTripLoading = !isLoaded || !liveLocation || polylinePath.length === 0;

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-neutral-200 px-5 py-4">
        <div className="mt-3 flex items-center justify-between">
          <span
            className={`text-xs font-medium ${
              connected ? "text-green-600" : "text-red-500"
            }`}
          >
            {connected ? "● Live Tracking" : "● Reconnecting..."}
          </span>
        </div>
      </div>

      {/* Map */}
      <div className="relative flex-1 min-h-[400px]">
        {isTripLoading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/70 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-neutral-300 border-t-blue-600" />
              <p className="text-sm font-medium text-neutral-600">
                Loading live route...
              </p>
            </div>
          </div>
        )}

        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={initialCenter}
            zoom={15}
            onLoad={(map) => {
              mapRef.current = map;
            }}
            options={{
              disableDefaultUI: true,
              zoomControl: true,
              streetViewControl: false,
              fullscreenControl: false,
              mapTypeControl: false,
              styles: mapStyles,
            }}
          >
            {/* Route */}
            {/* {polylinePath.length > 0 && ( */}
            <Polyline
              path={polylinePath}
              options={{
                strokeColor: "#2563EB",
                strokeOpacity: 0.9,
                strokeWeight: 5,
              }}
            />
            {/* )} */}

            {/* Driver */}
            {liveLocation && (
              <Marker
                position={driverPosition!}
                icon={{
                  path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                  scale: 6,
                  rotation: liveLocation.heading ?? 0,
                  fillColor: "#F59E0B",
                  fillOpacity: 1,
                  strokeColor: "#ffffff",
                  strokeWeight: 2,
                }}
              />
            )}

            {/* Pickup */}
            {trip.pickupOutlet?.latitude && trip.pickupOutlet?.longitude && (
              <Marker
                position={{
                  lat: Number(trip.pickupOutlet.latitude),
                  lng: Number(trip.pickupOutlet.longitude),
                }}
                label="P"
              />
            )}

            {/* Destination */}
            {trip.dropOutlet?.latitude && trip.dropOutlet?.longitude && (
              <Marker
                position={{
                  lat: Number(trip.dropOutlet.latitude),
                  lng: Number(trip.dropOutlet.longitude),
                }}
                label="D"
              />
            )}
          </GoogleMap>
        ) : (
          <div className="flex h-full items-center justify-center">
            Loading Google Maps...
          </div>
        )}

        {!connected && (
          <div className="absolute left-1/2 top-4 -translate-x-1/2 rounded-full bg-black/80 px-4 py-2 text-xs text-white">
            Connecting to live tracking...
          </div>
        )}
      </div>

      {/* Telemetry */}
      <div className="grid grid-cols-3 divide-x divide-neutral-800 bg-neutral-900 text-white">
        <Telemetry
          label="ETR"
          value={
            liveLocation?.remainingTimeMinutes != null
              ? `${Math.round(liveLocation.remainingTimeMinutes)} min`
              : "--"
          }
        />

        <Telemetry
          label="Distance"
          value={
            liveLocation?.remainingDistanceKm != null
              ? `${liveLocation.remainingDistanceKm.toFixed(1)} km`
              : "--"
          }
        />

        <Telemetry
          label="Speed"
          value={
            liveLocation?.speed != null
              ? `${Math.round(liveLocation.speed)} km/h`
              : "--"
          }
        />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-neutral-200 px-5 py-4">
        <div>
          <p className="font-medium text-sm">{trip.vehicle?.vehicleNumber}</p>

          <p className="text-xs text-neutral-500">{trip.driver?.name}</p>
        </div>

        <div className="text-right text-xs text-neutral-500">
          Updated{" "}
          {liveLocation
            ? new Date(liveLocation.timestamp).toLocaleTimeString()
            : "--"}
        </div>
      </div>
    </div>
  );
}
function Telemetry({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-4 py-4 text-center">
      <p className="font-mono text-xl font-semibold tabular-nums">{value}</p>

      <p className="mt-1 text-[10px] uppercase tracking-widest text-white/60">
        {label}
      </p>
    </div>
  );
}
