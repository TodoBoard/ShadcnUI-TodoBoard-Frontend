export interface TwoFactorStatus {
  enabled: boolean;
  setup_pending: boolean;
}

export interface TwoFactorSetupResponse {
  secret: string;
  provisioning_uri: string;
}

export interface TwoFactorEnableRequest {
  totp_code: string;
}
