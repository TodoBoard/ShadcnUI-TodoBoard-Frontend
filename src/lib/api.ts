import axios from "axios";
import { env } from "@/config/env";
import {
  LoginFormData,
  LoginResponse,
  RegisterFormData,
  RegisterResponse,
} from "@/models/auth";
import { ProjectStatisticsResponse } from "@/models/stats";
import { setAuthToken, clearAuthToken } from "@/lib/authHelpers";
import { Notification } from "@/models/notifications";

const api = axios.create({
  baseURL: env.apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.detail || "An unexpected error occurred";
  }
  return "An unexpected error occurred";
};

export const Auth = {
  login: async (data: LoginFormData): Promise<void> => {
    const response = await api.post<LoginResponse>("/login", data, {
      params: { remember_me: data.remember_me },
    });
    setAuthToken(response.data.access_token, data.username, data.remember_me);
  },

  register: async (data: RegisterFormData): Promise<void> => {
    const response = await api.post<RegisterResponse>("/register", data);
    setAuthToken(response.data.access_token, data.username);
  },

  logout: (): void => {
    clearAuthToken();
  },
};

export const Projects = {
  getStatistics: async (): Promise<ProjectStatisticsResponse> => {
    const response = await api.get<ProjectStatisticsResponse>(
      "/projects/statistics"
    );
    return response.data;
  },
};

export const Notifications = {
  getAll: async (): Promise<Notification[]> => {
    const response = await api.get<Notification[]>("/notifications");
    return response.data;
  },

  markAsRead: async (notificationId: string): Promise<void> => {
    await api.post(`/notifications/${notificationId}/read`);
  },
};

export default api;
