import { Injectable, inject } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import {
  BehaviorSubject,
  Observable,
  tap
} from 'rxjs';

import { environment } from '../../../../environments/environment.development';

import { Cart } from '../models/cart';

import { AddToCartRequest } from '../models/add-to-cart-request';

import { UpdateCartItemRequest } from '../models/update-cart-item-request';

@Injectable({
  providedIn: 'root',
})
export class CartService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    `${environment.apiUrl}/Cart`;

  // ==========================================
  // Cart State
  // ==========================================

  private readonly cartSubject =
    new BehaviorSubject<Cart | null>(null);

  readonly cart$ =
    this.cartSubject.asObservable();

  // ==========================================
  // Cart Count
  // ==========================================

  private readonly cartCountSubject =
    new BehaviorSubject<number>(0);

  readonly cartCount$ =
    this.cartCountSubject.asObservable();

  // ==========================================
  // Get Cart
  // ==========================================

  getCart(): Observable<Cart> {

    return this.http
      .get<Cart>(this.apiUrl)
      .pipe(
        tap((cart) => {
          this.updateCartState(cart);
        })
      );
  }

  // ==========================================
  // Add Item
  // ==========================================

  addItem(
    request: AddToCartRequest
  ): Observable<Cart> {

    return this.http
      .post<Cart>(
        `${this.apiUrl}/items`,
        request
      )
      .pipe(
        tap((cart) => {
          this.updateCartState(cart);
        })
      );
  }

  // ==========================================
  // Update Item
  // ==========================================

  updateItem(
    cartItemId: string,
    request: UpdateCartItemRequest
  ): Observable<Cart> {

    return this.http
      .put<Cart>(
        `${this.apiUrl}/items/${cartItemId}`,
        request
      )
      .pipe(
        tap((cart) => {
          this.updateCartState(cart);
        })
      );
  }

  // ==========================================
  // Remove Item
  // ==========================================

  removeItem(
    cartItemId: string
  ): Observable<void> {

    return this.http
      .delete<void>(
        `${this.apiUrl}/items/${cartItemId}`
      )
      .pipe(
        tap(() => {
          this.getCart().subscribe();
        })
      );
  }

  // ==========================================
  // Clear Cart
  // ==========================================

  clearCart(): Observable<void> {

    return this.http
      .delete<void>(this.apiUrl)
      .pipe(
        tap(() => {

          this.updateCartState({
            id: '',
            items: [],
            totalItems: 0,
            subtotal: 0
          });

        })
      );
  }

  // ==========================================
  // Update State
  // ==========================================

  private updateCartState(
    cart: Cart
  ): void {

    this.cartSubject.next(cart);

    this.cartCountSubject.next(
      cart.totalItems
    );
  }
}