import axios from "axios";
import { clientEnv } from "@/config/env";
import {
  LoginFormData,
  LoginResponse,
  RegisterFormData,
  RegisterResponse,
  PasswordResetCheckResponse,
  PasswordResetCheckData,
  PasswordResetConfirmData,
  PasswordResetConfirmResponse,
} from "@/models/auth";
import { ProjectStatisticsResponse } from "@/models/stats";
import { setAuthToken, clearAuthToken } from "@/lib/authHelpers";
import { Notification, MarkAsReadResponse } from "@/models/notifications";
import { ProjectListResponse } from "@/models/projects";
import { TwoFactorStatus, TwoFactorSetupResponse } from "@/models/security";
import { InviteCreate, InviteResponse } from "@/models/invites";

const api = axios.create({
  baseURL: clientEnv.apiUrl,
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

    if (isAuth || isTwoFactor || error.response?.status === 400) {
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

  checkPasswordReset: async (
    username: string
  ): Promise<PasswordResetCheckResponse> => {
    try {
      const data: PasswordResetCheckData = { username };
      const response = await api.post<PasswordResetCheckResponse>(
        "/password-reset/check",
        data
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error, true);
    }
  },

  confirmPasswordReset: async (
    data: PasswordResetConfirmData
  ): Promise<PasswordResetConfirmResponse> => {
    try {
      const response = await api.post<PasswordResetConfirmResponse>(
        "/password-reset/confirm",
        data
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error, true);
    }
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

  createInvite: async (
    projectId: string,
    data: InviteCreate
  ): Promise<InviteResponse> => {
    try {
      const response = await api.post<InviteResponse>(
        `/project/${projectId}/invite`,
        data
      );
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

  markAsRead: async (notificationId: string): Promise<MarkAsReadResponse> => {
    try {
      const response = await api.post<MarkAsReadResponse>(
        `/notifications/${notificationId}/read`
      );
      return response.data;
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
