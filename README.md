# Driver App (Next.js PWA)

Installable web app for drivers: log in, see assigned trips, create a trip,
and start one — which pushes live location over the socket the whole time
it's ONGOING, so the manager's fleet map picks it up.

## Setup

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

Icons in `public/icons/` are placeholders (plain green circles) generated
just so the manifest has something to point at — swap them for real app
icons before shipping. `npm run build` runs in production mode with the
service worker active; `npm run dev` runs with the PWA disabled (that's
`next-pwa`'s default dev behavior, in `next.config.mjs`).

To actually test "Add to Home Screen": deploy it (or run `npm run build &&
npm start` and hit it from your phone on the same network) — PWA install
prompts don't reliably show up over `npm run dev`.

## What's built

1. **`/login`** — name + password. On success, stores a token + driver
   profile in `localStorage` and redirects to `/trips`.
2. **`/trips`** — list of the driver's own trips with status pills, a `+`
   FAB to schedule a new one. Tapping a trip opens its detail page.
3. **`/trips/new`** — pickup outlet, drop outlet, vehicle, date/time. Submits
   as the logged-in driver (no driver picker — assumed the backend attaches
   `driverId` from the JWT on create).
4. **`/trips/[id]`** — trip details + a status-appropriate action button
   (Start trip → I've reached → Complete trip). While `ONGOING`, the page
   calls `navigator.geolocation.watchPosition` and emits a throttled
   (~every 5s) `driver-location` socket event.

Route protection: `RequireAuth` (in `context/AuthContext.tsx`) redirects to
`/login` if there's no driver in storage; a 401 from any API call also
clears storage and bounces to `/login` (see `libs/axios.ts`).

## Backend assumptions — please check these

I don't have your auth/driver-scoped-trips controllers, so I had to guess
at a few things. Everything below is isolated to one or two files, so
fixing a wrong guess is a small, contained change:

| Assumption | Where | What to check |
|---|---|---|
| Login endpoint is `POST /auth/driver/login`, taking `{ name, password }`, returning `{ accessToken, driver }` | `api/auth.api.ts`, `libs/types.ts` (`LoginPayload`/`LoginResponse`) | Adjust path/shape to your actual auth controller. If it returns `access_token` (snake_case) instead, fix the destructure in `AuthContext.login()`. |
| "My trips" endpoint is `GET /trip/drivers/me/trips` | `api/trips.api.ts` (`MY_TRIPS_PATH`) | If the backend instead expects a query param (`GET /trips?driverId=me`) or infers the driver purely from the JWT on the existing `GET /trips`, this is a one-line fix. |
| Starting/reaching/completing a trip reuses `PATCH /trips/:id` with `{ status: '...' }`, on the assumption `UpdateTripDto` accepts an optional `status` field | `api/trips.api.ts` (`updateStatus`) | If status changes actually need a dedicated endpoint (e.g. `POST /trips/:id/start`), only `updateStatus` needs to change — `startTrip`/`markReached`/`completeTrip` call sites stay the same. |
| Creating a trip as a driver reuses the same `POST /trips` from `TripController`, with the backend attaching `driverId` from the authenticated user | `api/trips.api.ts` (`create`) | If the backend still expects `driverId` in the body, add it back to `CreateTripPayload` and the form. |
| **`driver-location` socket event isn't in the `TripGateway` you've shown me** — this is the part that actually needs a backend change, not just a path fix | `hooks/useLocationBroadcast.ts` | Add a handler like the one below. |

### Required TripGateway addition

```typescript
@SubscribeMessage('driver-location')
handleDriverLocation(
  @MessageBody() payload: { tripId: number; latitude: number; longitude: number; speed?: number; heading?: number },
  @ConnectedSocket() client: Socket,
) {
  // TODO: compute remainingDistanceKm / remainingTimeMinutes here if you
  // want the manager's ETA readout populated (e.g. via a directions API,
  // or straight-line distance as a cheap approximation), then persist the
  // ping if you want location history.
  this.notifyTripLocation(payload.tripId, {
    latitude: payload.latitude,
    longitude: payload.longitude,
    speed: payload.speed,
    heading: payload.heading,
  });
}
```

This just relays what the driver sends straight into the existing
`notifyTripLocation` → `trip-{id}` room broadcast, which the manager's
`LiveTripPanel`/`FleetMap` already listen for. Without this handler, the
driver app will emit `driver-location` into the void and nothing will show
up on the manager side.

## Known gaps / next steps

- **Auth token expiry**: no refresh-token flow — a 401 just logs the driver
  out. Fine for a v1, worth revisiting if your tokens are short-lived.
- **Offline handling**: the PWA will install and launch offline (service
  worker caches the app shell), but trip data/actions still need a live
  connection — no offline queueing of location pings or trip actions.
- **Background location**: `watchPosition` only runs while the tab/PWA is
  in the foreground. iOS Safari (and PWAs installed from it) suspend
  JavaScript aggressively when backgrounded — true background tracking
  needs a native wrapper (e.g. Capacitor) or a "keep the app open" pattern,
  not something a plain web PWA can guarantee.
- **Vehicle scoping**: the create-trip form lists *all* active vehicles,
  not just ones assigned to this driver — add a `driverId` filter to
  `GET /trip/vehicles` if drivers should only see their own.
