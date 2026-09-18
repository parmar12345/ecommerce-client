import { Routes } from '@angular/router';

export const addressRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/address/address').then(
        (m) => m.Address
      ),
  },
   {
    path: 'create',
    loadComponent: () =>
      import('./pages/address-create/address-create').then(
        (m) => m.AddressCreate
      ),
  },
   {
    path: ':id/edit',
    loadComponent: () =>
      import('./pages/address-edit/address-edit').then(
        (m) => m.AddressEdit
      ),
  },
];