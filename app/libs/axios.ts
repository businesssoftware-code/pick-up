
import axios, { AxiosError } from 'axios';
import { ApiErrorResponse } from './types';
import { authStorage } from './auth-storage';



export const privateApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_POINT,
    withCredentials: true,
});


privateApi.interceptors.request.use(
  config => {
    const token = typeof window !== 'undefined' ? authStorage.getAccessToken() : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);


privateApi.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      alert('Unauthorized - need to pass to home page');
      // You can redirect to login here if needed

    }
    return Promise.reject(error);
  }
);


export const publicAPI = axios.create({

    baseURL: process.env.NEXT_PUBLIC_API_BASE_POINT,
    

});


export function getErrorMessage(err: unknown): string {
  const axiosErr = err as AxiosError<ApiErrorResponse>;

  const apiError = axiosErr.response?.data;
   
    const apiMessage = Array.isArray(apiError?.message)
    ? apiError?.message[0]
    : apiError?.message;

  return (
    apiMessage   ||
    apiError?.error ||     // sometimes they send "error" instead of message
    apiError?.statusCode?.toString() ||
    axiosErr.message ||
    "Something went wrong"
  );
}
