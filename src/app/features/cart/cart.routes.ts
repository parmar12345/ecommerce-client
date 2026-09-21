import { Routes } from '@angular/router';

export const cartRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/cart/cart')
        .then(m => m.Cart),
  },
];