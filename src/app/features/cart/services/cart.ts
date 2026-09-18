import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  AddToCartRequest,
  UpdateCartItemRequest,
  CartResponse
} from '../models/cart.models';
import { inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CartService {
      private readonly http = inject(HttpClient);

  private readonly apiUrl =
    `${environment.apiUrl}/Cart`;

  getCart(): Observable<CartResponse> {
    return this.http.get<CartResponse>(
      this.apiUrl
    );
  }

  addItem(
    request: AddToCartRequest
  ): Observable<CartResponse> {
    return this.http.post<CartResponse>(
      `${this.apiUrl}/items`,
      request
    );
  }

  updateItem(
    cartItemId: string,
    request: UpdateCartItemRequest
  ): Observable<CartResponse> {
    return this.http.put<CartResponse>(
      `${this.apiUrl}/items/${cartItemId}`,
      request
    );
  }

  removeItem(
    cartItemId: string
  ): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/items/${cartItemId}`
    );
  }

  clearCart(): Observable<void> {
    return this.http.delete<void>(
      this.apiUrl
    );
  }
}
