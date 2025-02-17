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
import { ProjectListResponse } from "@/models/projects";
import { TwoFactorStatus, TwoFactorSetupResponse } from "@/models/security";

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

export const handleApiError = (
  error: unknown,
  isAuth: boolean = false,
  isTwoFactor: boolean = false
): string => {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 401 && !isAuth && !isTwoFactor) {
      Auth.logout();
      window.location.href = "/auth/login";
    }

    if (isAuth || isTwoFactor) {
      return error.response?.data?.detail || "Authentication failed";
    }

    return "Failed to contact API";
  }
  return "Failed to contact API";
};

export const Auth = {
  login: async (data: LoginFormData): Promise<void> => {
    const response = await api.post<LoginResponse>("/login", data, {
      params: { remember_me: data.remember_me },
    });
    setAuthToken(
      response.data.access_token,
      response.data.username,
      response.data.avatar_id,
      data.remember_me
    );
  },

  register: async (data: RegisterFormData): Promise<void> => {
    const response = await api.post<RegisterResponse>("/register", data);
    setAuthToken(
      response.data.access_token,
      response.data.username,
      response.data.avatar_id,
      false
    );
  },

  logout: (): void => {
    clearAuthToken();
  },
};

export const Projects = {
  getStatistics: async (): Promise<ProjectStatisticsResponse> => {
    try {
      const response = await api.get<ProjectStatisticsResponse>(
        "/projects/statistics"
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getProjects: async (): Promise<ProjectListResponse> => {
    try {
      const response = await api.get<ProjectListResponse>("/projects");
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

export const Notifications = {
  getAll: async (): Promise<Notification[]> => {
    try {
      const response = await api.get<Notification[]>("/notifications");
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  markAsRead: async (notificationId: string): Promise<void> => {
    try {
      await api.post(`/notifications/${notificationId}/read`);
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

export const Security = {
  getTwoFactorStatus: async (): Promise<TwoFactorStatus> => {
    try {
      const response = await api.get<TwoFactorStatus>("/2fa/status");
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  setupTwoFactor: async (): Promise<TwoFactorSetupResponse> => {
    try {
      const response = await api.get<TwoFactorSetupResponse>("/2fa/setup");
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  enableTwoFactor: async (code: string): Promise<void> => {
    try {
      await api.post("/2fa/enable", { totp_code: code });
    } catch (error) {
      throw handleApiError(error, false, true);
    }
  },

  disableTwoFactor: async (code: string): Promise<void> => {
    try {
      await api.post("/2fa/disable", { totp_code: code });
    } catch (error) {
      throw handleApiError(error, false, true);
    }
  },
};

export default api;
