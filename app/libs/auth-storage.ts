import Cookies from 'js-cookie';

const ACCESS_TOKEN_KEY = 'accessToken';
const DRIVER_NAME_KEY = 'driverName';
const DRIVER_ID = 'driverId';

export const authStorage = {
  getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;

    return (
      Cookies.get(ACCESS_TOKEN_KEY) ??
      null
    );
  },

  getDriverName(): string | null {
    if (typeof window === 'undefined') return null;

    return (
      Cookies.get(DRIVER_NAME_KEY) ??
      null
    );
  },

  getDriverId(): string | null {
    if (typeof window === 'undefined') return null;

    return (
      Cookies.get(DRIVER_ID) ??
      null
    );
  },

  set(accessToken: string, driverName: string, driverId:string) {
    if (typeof window === 'undefined') return;

    // Cookies (expires in 100 years)
    Cookies.set(ACCESS_TOKEN_KEY, accessToken, {
      expires: 365 * 100,
      sameSite: 'Lax',
      path: '/',
    });

    Cookies.set(DRIVER_NAME_KEY, driverName, {
      expires: 365 * 100,
      sameSite: 'Lax',
      path: '/',
    });

    Cookies.set(DRIVER_ID, driverId, {
      expires: 365 * 100,
      sameSite: 'Lax',
      path: '/',
    });
  },

  clear() {
    if (typeof window === 'undefined') return;

    Cookies.remove(ACCESS_TOKEN_KEY, { path: '/' });
    Cookies.remove(DRIVER_NAME_KEY, { path: '/' });
    Cookies.remove(DRIVER_ID, { path: '/' });
  },
};