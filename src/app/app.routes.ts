import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth-guard';

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
    path: 'address',
    canActivate: [
      authGuard
    ],
    loadChildren: () =>
      import('./features/address/address.routes')
        .then(m => m.addressRoutes)
  },

  {
    path: 'checkout',
    canActivate: [
      authGuard
    ],
    loadChildren: () =>
      import('./features/checkout/checkout.routes')
        .then(m => m.checkoutRoutes)
  },
  {
    path: 'orders',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/orders/orders.routes')
        .then(m => m.ordersRoutes)
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