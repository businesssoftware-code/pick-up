
import { publicAPI } from '../libs/axios';
import type { LoginPayload, LoginResponse } from '../libs/types';

// NOTE: assumed endpoint/shape — this wasn't part of any backend code shared
// so far. Adjust the path and response shape to match your actual auth
// controller (e.g. it might return { access_token } instead of
// { accessToken }, or use email/phone instead of name).
export const authApi = {
  login: (payload: LoginPayload) =>
    publicAPI.post<LoginResponse>('/trip/drivers/login', payload).then((r) => r.data),
};
