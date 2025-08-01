/*
 * API Hook
 * Path: lib/hooks/api/useApi.ts
 *
 * This hook provides a clean, reusable interface for making API calls.
 * It wraps our pre-configured `axiosClient`, so all requests made through
 * this hook will automatically go through the secure server-side proxy.
 */
import { useMemo, useCallback } from "react";
import apiClient from "@/lib/api/client/axios-client";
import { AxiosRequestConfig, AxiosError } from "axios";

// Define a generic API error type for better error handling
export interface ApiError {
  message: string;
  status?: number;
  details?: unknown;
}

// Define the structure of our API hook
export interface UseApiReturnType {
  get: <T>(url: string, config?: AxiosRequestConfig) => Promise<T>;
  post: <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ) => Promise<T>;
  put: <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ) => Promise<T>;
  patch: <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ) => Promise<T>;
  delete: <T>(url: string, config?: AxiosRequestConfig) => Promise<T>;
}

/**
 * A hook for making API calls that automatically handles wiring up the
 * pre-configured Axios client.
 */
export const useApi = (): UseApiReturnType => {
  const handleError = useCallback((error: unknown): ApiError => {
    if (error instanceof AxiosError) {
      return {
        message: error.response?.data?.detail || error.message,
        status: error.response?.status,
        details: error.response?.data,
      };
    }
    return {
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }, []);

  const get = useCallback(
    async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
      try {
        const response = await apiClient.get<T>(url, config);
        return response.data;
      } catch (error) {
        throw handleError(error);
      }
    },
    [handleError]
  );

  const post = useCallback(
    async <T>(
      url: string,
      data?: unknown,
      config?: AxiosRequestConfig
    ): Promise<T> => {
      try {
        const response = await apiClient.post<T>(url, data, config);
        return response.data;
      } catch (error) {
        throw handleError(error);
      }
    },
    [handleError]
  );

  const put = useCallback(
    async <T>(
      url: string,
      data?: unknown,
      config?: AxiosRequestConfig
    ): Promise<T> => {
      try {
        const response = await apiClient.put<T>(url, data, config);
        return response.data;
      } catch (error) {
        throw handleError(error);
      }
    },
    [handleError]
  );

  const patch = useCallback(
    async <T>(
      url: string,
      data?: unknown,
      config?: AxiosRequestConfig
    ): Promise<T> => {
      try {
        const response = await apiClient.patch<T>(url, data, config);
        return response.data;
      } catch (error) {
        throw handleError(error);
      }
    },
    [handleError]
  );

  const del = useCallback(
    async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
      try {
        const response = await apiClient.delete<T>(url, config);
        return response.data;
      } catch (error) {
        throw handleError(error);
      }
    },
    [handleError]
  );

  return useMemo(
    () => ({
      get,
      post,
      put,
      patch,
      delete: del,
    }),
    [get, post, put, patch, del]
  );
};
