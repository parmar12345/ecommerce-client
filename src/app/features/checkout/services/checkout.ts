import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { CheckoutRequest } from '../models/checkout-request';
import { CheckoutResponse } from '../models/checkout-response';
import { OrderResponse } from '../models/order-response';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

   private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/Checkout`;
  private ordersApiUrl = `${environment.apiUrl}/Orders`;

  checkout(request: {
    addressId: string;
  }): Observable<CheckoutResponse> {

    return this.http.post<CheckoutResponse>(
      this.apiUrl,
      request
    );
  }

  getOrder(orderId: string): Observable<OrderResponse> {

    return this.http.get<OrderResponse>(
      `${this.ordersApiUrl}/${orderId}`
    );
  }
}