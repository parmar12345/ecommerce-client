import { Routes } from '@angular/router';

export const checkoutRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/checkout/checkout')
        .then(m => m.Checkout)
  },
 {
    path: 'success/:orderId',
    loadComponent: () =>
      import('./pages/order-success/order-success')
        .then(m => m.OrderSuccess)
  }
];