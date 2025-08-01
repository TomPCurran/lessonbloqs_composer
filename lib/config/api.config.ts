export const API_CONFIG = {
  baseURL: "/api/proxy", // Use proxy instead of direct backend URL
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
};

// Backend URL for API proxy
export const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

export const API_ENDPOINTS = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    logout: "/auth/logout",
    refresh: "/auth/refresh",
    me: "/auth/me",
  },

  // Lessons endpoints
  lessons: {
    list: "/lessons",
    create: "/lessons",
    get: (id: string) => `/lessons/${id}`,
    update: (id: string) => `/lessons/${id}`,
    delete: (id: string) => `/lessons/${id}`,
    publish: (id: string) => `/lessons/${id}/publish`,
    duplicate: (id: string) => `/lessons/${id}/duplicate`,
  },

  // Bloqs endpoints
  bloqs: {
    create: "/bloqs",
    update: (id: string) => `/bloqs/${id}`,
    delete: (id: string) => `/bloqs/${id}`,
    reorder: "/bloqs/reorder",
    generateContent: "/bloqs/generate",
  },

  // Collaboration endpoints
  collaboration: {
    join: (lessonId: string) => `/collaboration/${lessonId}/join`,
    leave: (lessonId: string) => `/collaboration/${lessonId}/leave`,
    cursor: (lessonId: string) => `/collaboration/${lessonId}/cursor`,
  },
} as const;
