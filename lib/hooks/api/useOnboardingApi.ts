/*
 * Onboarding API Hook
 * Path: lib/hooks/api/useOnboardingApi.ts
 *
 * Specialized API hook for onboarding requests that uses the onboarding proxy.
 * This bypasses the regular auth flow that expects database users.
 */
import { useMemo, useCallback } from "react";
import axios, { AxiosRequestConfig, AxiosError } from "axios";

// Create a separate axios instance for onboarding
const onboardingAxiosClient = axios.create({
  baseURL: "/api/onboarding/proxy",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 30000,
});

// Add response interceptor for error handling
onboardingAxiosClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // During onboarding, 401 responses are expected for new users
    // Don't log these as errors since they're part of normal flow
    if (error.response?.status === 401) {
      // Just pass through the error without logging
      return Promise.reject(error);
    }

    // Log other errors that are unexpected
    if (error.response?.status && error.response.status >= 500) {
      console.error(
        "Onboarding server error:",
        error.response.status,
        error.response.data
      );
    }

    return Promise.reject(error);
  }
);

export interface ApiError {
  message: string;
  statusCode?: number;
  errorDetails?: unknown;
}

export const useOnboardingApi = () => {
  const handleError = useCallback((error: unknown): ApiError => {
    if (error instanceof AxiosError) {
      return {
        message: error.response?.data?.detail || error.message,
        statusCode: error.response?.status,
        errorDetails: error.response?.data,
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
        const response = await onboardingAxiosClient.get<T>(url, config);
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
        const response = await onboardingAxiosClient.post<T>(url, data, config);
        return response.data;
      } catch (error) {
        throw handleError(error);
      }
    },
    [handleError]
  );

  return useMemo(() => ({ get, post }), [get, post]);
};
