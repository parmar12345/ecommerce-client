import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import { AuthService } from './auth';
import { AuthStateService } from './auth-state';
import { AuthRefreshService } from './auth-refresh';

@Injectable({
  providedIn: 'root',
})
export class AuthInitializerService {

  private readonly authRefreshService =
    inject(AuthRefreshService);

  private readonly authState =
    inject(AuthStateService);


  initialize(): Promise<void> {

  console.log('AUTH INITIALIZER: starting');

  return new Promise((resolve) => {

    this.authRefreshService
      .refresh()
      .subscribe({

        next: (response) => {

          console.log(
            'AUTH INITIALIZER: REFRESH SUCCESS',
            response
          );

          this.authState.setAuth(response);

          console.log(
            'AUTH INITIALIZER: AUTHENTICATED',
            this.authState.isAuthenticated()
          );

          resolve();

        },

        error: (error) => {

          console.error(
            'AUTH INITIALIZER: REFRESH FAILED',
            error
          );

          this.authState.clearAuth();

          resolve();

        }

      });

  });

}
}