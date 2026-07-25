import { privateApi } from '../libs/axios';
import type { TripOutlet, Vehicle } from '../libs/types';

export const lookupsApi = {
  getOutlets: () => privateApi.get<TripOutlet[]>('/outlets').then((r) => r.data),
  getVehicles: () => privateApi.get<Vehicle[]>('/trip/vehicles').then((r) => r.data),
};
