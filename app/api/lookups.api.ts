import { privateApi } from '../libs/axios';
import type { Outlet, Vehicle } from '../libs/types';

export const lookupsApi = {
  getOutlets: () => privateApi.get<Outlet[]>('/outlets').then((r) => r.data),
  getVehicles: () => privateApi.get<Vehicle[]>('/trip/vehicles').then((r) => r.data),
};
