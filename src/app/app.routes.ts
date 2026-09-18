import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { inject } from '@angular/core';

export const routes: Routes = [

  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.routes')
        .then(m => m.authRoutes)
  },

  {
    path: '',
    loadChildren: () =>
      import('./features/catalog/catalog.routes')
        .then(m => m.catalogRoutes)
  },

  {
    path: 'cart',
    canActivate: [
      authGuard
    ],
    loadComponent: () =>
      import('./features/cart/pages/cart/cart')
        .then(m => m.Cart)
  },

  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },

  {
    path: '**',
    redirectTo: 'auth/login'
  }
];
