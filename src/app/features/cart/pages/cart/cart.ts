import { Component } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { CartService } from '../../services/cart';
import {
  CartResponse,
  AddToCartRequest,
  UpdateCartItemRequest
} from '../../models/cart.models';

@Component({
  selector: 'app-cart',
  imports: [DecimalPipe],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  private readonly cartService =
    inject(CartService);

  private readonly router =
    inject(Router);

  private readonly cdr =
    inject(ChangeDetectorRef);

  cart: CartResponse | null = null;

  isLoading = false;

  errorMessage = '';

  updatingItemId: string | null = null;

  removingItemId: string | null = null;

  isClearing = false;


  ngOnInit(): void {

    this.loadCart();

  }


  loadCart(): void {

    this.isLoading = true;

    this.errorMessage = '';

    this.cartService
      .getCart()
      .subscribe({

        next: (response) => {

          this.cart = response;

          this.isLoading = false;

          this.cdr.detectChanges();

        },

        error: () => {

          this.cart = null;

          this.errorMessage =
            'Unable to load your cart.';

          this.isLoading = false;

          this.cdr.detectChanges();

        }

      });

  }


  increaseQuantity(
    cartItemId: string,
    currentQuantity: number,
    availableStock: number
  ): void {

    if (
      currentQuantity >= availableStock
    ) {
      return;
    }

    this.updateQuantity(
      cartItemId,
      currentQuantity + 1
    );

  }


  decreaseQuantity(
    cartItemId: string,
    currentQuantity: number
  ): void {

    if (currentQuantity <= 1) {
      return;
    }

    this.updateQuantity(
      cartItemId,
      currentQuantity - 1
    );

  }


  updateQuantity(
    cartItemId: string,
    quantity: number
  ): void {

    if (quantity <= 0) {
      return;
    }

    this.updatingItemId = cartItemId;

    this.errorMessage = '';

    this.cartService
      .updateItem(
        cartItemId,
        { quantity }
      )
      .subscribe({

        next: (response) => {

          this.cart = response;

          this.updatingItemId = null;

          this.cdr.detectChanges();

        },

        error: (error) => {

          this.updatingItemId = null;

          this.errorMessage =
            error.error?.message ??
            'Unable to update cart item.';

          this.cdr.detectChanges();

        }

      });

  }


  removeItem(
    cartItemId: string
  ): void {

    this.removingItemId = cartItemId;

    this.errorMessage = '';

    this.cartService
      .removeItem(cartItemId)
      .subscribe({

        next: () => {

          this.loadCart();

          this.removingItemId = null;

        },

        error: (error) => {

          this.removingItemId = null;

          this.errorMessage =
            error.error?.message ??
            'Unable to remove cart item.';

          this.cdr.detectChanges();

        }

      });

  }


  clearCart(): void {

    if (!this.cart?.items.length) {
      return;
    }

    this.isClearing = true;

    this.errorMessage = '';

    this.cartService
      .clearCart()
      .subscribe({

        next: () => {

          this.loadCart();

          this.isClearing = false;

        },

        error: (error) => {

          this.isClearing = false;

          this.errorMessage =
            error.error?.message ??
            'Unable to clear cart.';

          this.cdr.detectChanges();

        }

      });

  }


  continueShopping(): void {

    this.router.navigate([
      '/catalog/products'
    ]);

  }


  getImageUrl(
    imageUrl: string | null
  ): string {

    if (!imageUrl) {
      return '';
    }

    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }

    return `https://localhost:7186${imageUrl}`;

  }
}


