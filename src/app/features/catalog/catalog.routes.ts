import { Routes } from '@angular/router';

export const catalogRoutes: Routes = [
  {
    path: 'products',
    loadComponent: () =>
      import('./pages/product-list/product-list')
        .then(m => m.ProductList),
  },
];