import { Routes } from '@angular/router';

export const ordersRoutes: Routes = [

  {
    path: '',
    loadComponent: () =>
      import('./pages/orders/orders')
        .then(m => m.Orders)
  },

  {
    path: ':orderId',
    loadComponent: () =>
      import('./pages/order-details/order-details')
        .then(m => m.OrderDetails)
  }

];