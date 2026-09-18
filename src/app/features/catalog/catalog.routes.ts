import { Routes } from '@angular/router';

export const catalogRoutes: Routes = [
  {
    path: 'products',
    loadComponent: () =>
      import('./pages/product-list/product-list')
        .then(m => m.ProductList),
  },
   {
    path: 'products/:id',
    loadComponent: () =>
      import('./pages/product-details/product-details')
        .then(m => m.ProductDetails),
  },
];