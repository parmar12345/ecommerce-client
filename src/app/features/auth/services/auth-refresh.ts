import { Injectable } from '@angular/core';
import { AuthService } from './auth';
import { Observable } from 'rxjs';
import { LoginResponse } from '../models/auth.models';
import { shareReplay, finalize } from 'rxjs/operators';
import { inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthRefreshService {

  private readonly authService =
    inject(AuthService);

  private refreshRequest:
    Observable<LoginResponse> | null = null;


  refresh(): Observable<LoginResponse> {

    /*
     * If a refresh request is already
     * running, return the same request.
     */
    if (this.refreshRequest) {

      return this.refreshRequest;
    }


    /*
     * Start a new refresh request.
     */
    this.refreshRequest =
      this.authService
        .refreshToken()
        .pipe(

          /*
           * Share the same HTTP request
           * with all subscribers.
           */
          shareReplay({
            bufferSize: 1,
            refCount: false
          }),

          /*
           * Once the request finishes,
           * allow a future refresh request.
           */
          finalize(() => {

            this.refreshRequest = null;

          })

        );


    return this.refreshRequest;
  }
}