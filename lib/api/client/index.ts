import axiosClient from "./axios-client";
import type { AxiosRequestConfig, AxiosResponse } from "axios";

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status: number;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: any;
}

class ApiClient {
  async get<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response: AxiosResponse<T> = await axiosClient.get(url, config);
    return {
      data: response.data,
      status: response.status,
    };
  }

  async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response: AxiosResponse<T> = await axiosClient.post(
      url,
      data,
      config
    );
    return {
      data: response.data,
      status: response.status,
    };
  }

  async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response: AxiosResponse<T> = await axiosClient.put(url, data, config);
    return {
      data: response.data,
      status: response.status,
    };
  }

  async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response: AxiosResponse<T> = await axiosClient.patch(
      url,
      data,
      config
    );
    return {
      data: response.data,
      status: response.status,
    };
  }

  async delete<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response: AxiosResponse<T> = await axiosClient.delete(url, config);
    return {
      data: response.data,
      status: response.status,
    };
  }
}

export const apiClient = new ApiClient();
export { axiosClient };
