import {
  HttpErrorResponse,
  HttpInterceptorFn
} from '@angular/common/http';

import { inject } from '@angular/core';

import {
  catchError,
  switchMap,
  throwError
} from 'rxjs';

import { AuthStateService } from '../services/auth-state';
import { AuthRefreshService } from '../services/auth-refresh';


export const authInterceptor: HttpInterceptorFn = (
  req,
  next
) => {

  const authState =
    inject(AuthStateService);

  const authRefreshService =
    inject(AuthRefreshService);


  const accessToken =
    authState.getAccessToken();


  /*
   * Authentication endpoints should not
   * receive the access token automatically.
   */
  const isAuthRequest =
  req.url.includes('/Auth/login') ||
  req.url.includes('/Auth/refresh-token') ||
  req.url.includes('/Auth/logout') ||
  req.url.includes('/Auth/register') ||
  req.url.includes('/Auth/verify-email') ||
  req.url.includes('/Auth/resend-verification') ||
  req.url.includes('/Auth/forgot-password') ||
  req.url.includes('/Auth/reset-password');

  let authRequest = req;


  /*
   * Attach access token to protected requests.
   */
  if (
    accessToken &&
    !isAuthRequest
  ) {

    authRequest = req.clone({

      setHeaders: {

        Authorization:
          `Bearer ${accessToken}`

      }

    });
  }


  return next(authRequest).pipe(

    catchError(
      (error: HttpErrorResponse) => {

        /*
         * Only handle 401 responses.
         */
        if (
          error.status !== 401 ||
          isAuthRequest
        ) {

          return throwError(
            () => error
          );
        }


        /*
         * Refresh the access token.
         *
         * AuthRefreshService guarantees that
         * only one refresh request is active
         * at a time.
         */
        return authRefreshService
          .refresh()
          .pipe(

            switchMap((response) => {

              /*
               * Store the new access token
               * in memory.
               */
              authState.updateAccessToken(
                response
              );


              /*
               * Retry the original request
               * with the new access token.
               */
              const retryRequest =
                req.clone({

                  setHeaders: {

                    Authorization:
                      `Bearer ${response.accessToken}`

                  }

                });


              return next(
                retryRequest
              );

            }),


            catchError(
              (refreshError) => {

                /*
                 * Refresh failed.
                 *
                 * Clear the client authentication
                 * state.
                 */
                authState.clearAuth();


                return throwError(
                  () => refreshError
                );

              }
            )

          );

      }
    )

  );
};