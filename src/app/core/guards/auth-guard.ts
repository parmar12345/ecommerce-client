import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthStateService } from '../../features/auth/services/auth-state';


export const authGuard: CanActivateFn = (route, state) => {
   const authState =
    inject(AuthStateService);

  const router =
    inject(Router);

  if (authState.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree([
    '/auth/login'
  ]);
};
