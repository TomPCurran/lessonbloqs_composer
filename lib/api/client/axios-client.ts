/*
 * Axios Client Configuration
 * Path: lib/api/client/axios-client.ts
 *
 * Pre-configured Axios instance for API calls through the secure proxy.
 * All authentication is handled server-side by the proxy route.
 */
import axios, { AxiosError, AxiosInstance } from "axios";

/**
 * Creates a pre-configured Axios instance for API calls
 */
const createAxiosClient = (): AxiosInstance => {
  const axiosClient = axios.create({
    baseURL: "/api/proxy",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    timeout: 30000, // 30 second timeout
  });

  // Request interceptor for logging and debugging
  axiosClient.interceptors.request.use(
    (config) => {
      if (process.env.NODE_ENV === "development") {
        console.log(
          `API Request: ${config.method?.toUpperCase()} ${config.url}`
        );
      }
      return config;
    },
    (error) => {
      console.error("Request interceptor error:", error);
      return Promise.reject(error);
    }
  );

  // Response interceptor for global error handling
  axiosClient.interceptors.response.use(
    (response) => {
      return response;
    },
    (error: AxiosError) => {
      // Log error details for debugging
      if (process.env.NODE_ENV === "development") {
        console.error("API Error:", {
          status: error.response?.status,
          message: error.message,
          url: error.config?.url,
          data: error.response?.data,
        });
      }

      // Handle specific error cases
      if (error.response?.status === 401) {
        console.error("Authentication error: Please sign in again.");
        // Only redirect on client-side
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      } else if (error.response?.status === 403) {
        console.error("Authorization error: Insufficient permissions.");
      } else if (error.response?.status === 503) {
        console.error("Service unavailable: Backend API is not accessible.");
      } else if (error.response?.status === 429) {
        console.error("Rate limit exceeded: Too many requests.");
      } else if (error.code === "ECONNABORTED") {
        console.error(
          "Request timeout: The request took too long to complete."
        );
      }

      return Promise.reject(error);
    }
  );

  return axiosClient;
};

const axiosClient = createAxiosClient();

export default axiosClient;
