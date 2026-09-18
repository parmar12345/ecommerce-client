export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  userId: string;
  name: string;
  email: string;
  message: string;
}

export interface VerifyEmailResponse {
  message: string;
}


export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  userId: string;
  name: string;
  email: string;
  accessToken: string;
  expiresAt: string;
}

export interface GetMeResponse {
  userId: string;
  name: string;
  email: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  message: string;
}