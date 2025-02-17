export interface LoginFormData {
  username: string;
  password: string;
  remember_me: boolean;
}

export interface RegisterFormData {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  username: string;
  avatar_id: number;
}

export interface RegisterResponse {
  access_token: string;
  token_type: string;
  username: string;
  avatar_id: number;
}

export interface PasswordResetFormData {
  username: string;
  totp_code: string;
  new_password: string;
}

export interface PasswordResetResponse {
  detail: string;
}

export interface PasswordResetCheckResponse {
  message: string;
}

export interface PasswordResetCheckData {
  username: string;
}

export interface PasswordResetConfirmData {
  username: string;
  totp_code: string;
  new_password: string;
}

export interface PasswordResetConfirmResponse {
  message: string;
}
