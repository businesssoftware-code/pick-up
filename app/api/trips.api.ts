import { privateApi } from '../libs/axios';
import { PaginatedTrips, type CreateTripPayload, type Trip, type TripStatus } from '../libs/types';

// NOTE: assumed endpoint — filtering to "my" trips wasn't in the
// TripController you shared (that one returns ALL trips, meant for
// managers). Adjust the path if your driver-scoped route differs
// (e.g. GET /trips?driverId=me, or the backend infers the driver from the
// JWT some other way).
const MY_TRIPS_PATH = '/trip/drivers/me/trips';

export const tripsApi = {
  getMyTrips: (page: number = 1, limit: number = 10) => privateApi.get<PaginatedTrips>(MY_TRIPS_PATH+`?page=${page}&limit=${limit}`).then((r) => r.data),
  getMyActiveTrips: () => privateApi.get<Trip[]>(MY_TRIPS_PATH+"/active").then((r) => r.data),
  findOne: (id: number) => privateApi.get<Trip>(`/trips/${id}`).then((r) => r.data),

  // driverId isn't sent — assumed the backend attaches it from the JWT
  // for a driver-initiated create, same TripController.create() route.
  create: (payload: CreateTripPayload) =>
    privateApi.post<Trip>('/trips', payload).then((r) => r.data),

  // Reuses the existing PATCH /trips/:id from TripController, assuming
  // UpdateTripDto accepts an optional `status` field. If starting/reaching/
  // completing a trip actually needs a dedicated endpoint on your backend
  // (e.g. POST /trips/:id/start), swap the implementation below — the
  // call sites (startTrip/markReached/completeTrip) won't need to change.
  updateStatus: (id: number, status: string) =>
    privateApi.patch<Trip>(`/trips/${id}/${status}`).then((r) => r.data),

  startTrip: (id: number) => tripsApi.updateStatus(id, 'start'),
  markReached: (id: number) => tripsApi.updateStatus(id, 'REACHED_DESTINATION'),
  completeTrip: (id: number) => tripsApi.updateStatus(id, 'complete'),
};
