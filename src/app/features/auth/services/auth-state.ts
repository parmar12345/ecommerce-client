import { Injectable } from '@angular/core';
import { signal } from '@angular/core';
import { LoginResponse } from '../models/auth.models';

@Injectable({
  providedIn: 'root',
})
export class AuthStateService  {
  private readonly accessToken =
    signal<string | null>(null);

  private readonly currentUser =
    signal<LoginResponse | null>(null);

  isAuthenticated() {
    return this.accessToken() !== null;
  }

  getAccessToken(): string | null {
    return this.accessToken();
  }

  getCurrentUser(): LoginResponse | null {
    return this.currentUser();
  }

  setAuth(response: LoginResponse): void {

    this.accessToken.set(
      response.accessToken
    );

    this.currentUser.set(
      response
    );
  }

  updateAccessToken(
  response: LoginResponse
): void {

  this.accessToken.set(
    response.accessToken
  );

  this.currentUser.set(
    response
  );
}

  clearAuth(): void {

    this.accessToken.set(null);

    this.currentUser.set(null);
  }
}
