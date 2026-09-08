import axios, { AxiosInstance, AxiosError } from 'axios';
import { API_CONFIG, getApiBaseUrl } from '../config/api';

export const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: getApiBaseUrl(),
    timeout: API_CONFIG.TIMEOUT_MS,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  return client;
};

export const formatApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ detail?: string; message?: string }>;
    if (axiosError.response?.data?.detail) {
      return `Server Error: ${axiosError.response.data.detail}`;
    }
    if (axiosError.code === 'ECONNABORTED') {
      return 'Request Timeout: CYVORA backend did not respond within timeout limits.';
    }
    if (axiosError.code === 'ERR_NETWORK') {
      return `CYVORA Backend Unavailable (Cannot connect to ${getApiBaseUrl()}). Running in DEMO MODE.`;
    }
    return axiosError.message || 'API request failed';
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Unknown connection error';
};
