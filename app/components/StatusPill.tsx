import { TripStatus } from "../libs/types";

const STYLES: Record<
  TripStatus,
  { label: string; classes: string; live?: boolean }
> = {
  CREATED: {
    label: 'Scheduled',
    classes: 'bg-neutral-900/5 text-neutral-900/70 border-neutral-900/10',
  },
  STARTED: {
    label: 'On the road',
    classes: 'bg-amber-500/10 text-amber-600 border-amber-500/30',
    live: true,
  },
  REACHED_PICKUP: {
    label: 'Reached Pickup',
    classes: 'bg-primary/10 text-primary border-primary/25',
    live: true,
  },
  PAUSED: {
    label: 'Paused',
    classes: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/30',
    live: true,
  },
  IN_TRANSIT: {
    label: 'In Transit',
    classes: 'bg-blue-500/10 text-blue-600 border-blue-500/30',
    live: true,
  },
  REACHED_DESTINATION: {
    label: 'Reached Destination',
    classes: 'bg-purple-500/10 text-purple-600 border-purple-500/30',
    live: true,
  },
  COMPLETED: {
    label: 'Completed',
    classes: 'bg-success/30 text-primary border-success/60',
  },
  CANCELLED: {
    label: 'Cancelled',
    classes: 'bg-error/10 text-error border-error/25',
  },
};

export function StatusPill({ status }: { status: TripStatus }) {
  const s = STYLES[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium`}
    >
      {s.live && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
        </span>
      )}
      {s.label}
    </span>
  );
}
