import { Injectable } from '@angular/core';
import { RegisterRequest, RegisterResponse, VerifyEmailResponse, LoginRequest,
   LoginResponse, GetMeResponse, ForgotPasswordResponse, ForgotPasswordRequest, 
   ResetPasswordResponse , ResetPasswordRequest} from '../models/auth.models';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';


@Injectable({
  providedIn: 'root',
})

export class AuthService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/Auth`;

  register(
    request: RegisterRequest
  ): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(
      `${this.apiUrl}/register`,
      request
    );
  }


  verifyEmail(
    token: string
  ): Observable<VerifyEmailResponse> {
    return this.http.get<VerifyEmailResponse>(
      `${this.apiUrl}/verify-email`,
      {
        params: {
          token
        }
      }
    );
  }


  resendVerification(
    email: string
  ): Observable<{ message: string }> {

    return this.http.post<{ message: string }>(
      `${this.apiUrl}/resend-verification`,
      {
        email
      }
    );
  }


  login(
    request: LoginRequest
  ): Observable<LoginResponse> {

    return this.http.post<LoginResponse>(
      `${this.apiUrl}/login`,
      request,
      {
        withCredentials: true
      }
    );
  }


  refreshToken(): Observable<LoginResponse> {

    return this.http.post<LoginResponse>(
      `${this.apiUrl}/refresh-token`,
      {},
      {
        withCredentials: true
      }
    );
  }

  getMe(): Observable<GetMeResponse> {

    return this.http.get<GetMeResponse>(
      `${this.apiUrl}/get-me`
    );
  }


  forgotPassword(
    request: ForgotPasswordRequest
  ): Observable<ForgotPasswordResponse> {

    return this.http.post<ForgotPasswordResponse>(
      `${this.apiUrl}/forgot-password`,
      request
    );
  }


  resetPassword(
  request: ResetPasswordRequest
): Observable<ResetPasswordResponse> {

  return this.http.post<ResetPasswordResponse>(
    `${this.apiUrl}/reset-password`,
    request
  );
}

logout(): Observable<{ message: string }> {

  return this.http.post<{ message: string }>(
    `${this.apiUrl}/logout`,
    {},
    {
      withCredentials: true
    }
  );
}
}
