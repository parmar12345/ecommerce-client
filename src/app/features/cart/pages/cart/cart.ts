import {
  ChangeDetectorRef,
  Component,
  OnInit,
  inject
} from '@angular/core';

import { DecimalPipe } from '@angular/common';

import { RouterLink } from '@angular/router';

import { CartService } from '../../services/cart';

import { Cart as CartModel } from '../../models/cart';

import { environment } from '../../../../../environments/environment';


@Component({
  selector: 'app-cart',

  imports: [
    DecimalPipe,
    RouterLink
  ],

  templateUrl: './cart.html',

  styleUrl: './cart.css',
})
export class Cart implements OnInit {

  private readonly cartService =
    inject(CartService);

  private readonly cdr =
    inject(ChangeDetectorRef);


  // ==========================================
  // Cart
  // ==========================================

  cart: CartModel | null = null;


  // ==========================================
  // Loading
  // ==========================================

  isLoading = true;


  // ==========================================
  // Error
  // ==========================================

  errorMessage = '';


  // ==========================================
  // API Base URL
  // ==========================================

  apiUrl =
    environment.apiUrl.replace('/api', '');


  // ==========================================
  // On Init
  // ==========================================

  ngOnInit(): void {

    this.loadCart();

  }


  // ==========================================
  // Load Cart
  // ==========================================

  loadCart(): void {

    this.isLoading = true;

    this.errorMessage = '';

    this.cartService
      .getCart()
      .subscribe({

        next: (response) => {

          console.log(
            'Cart:',
            response
          );

          this.cart = response;

          this.isLoading = false;

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            'Failed to load cart:',
            error
          );

          this.errorMessage =
            'Failed to load cart.';

          this.isLoading = false;

          this.cdr.detectChanges();

        },

      });
  }


  // ==========================================
  // Increase Quantity
  // ==========================================

  increaseQuantity(
    itemId: string,
    currentQuantity: number
  ): void {

    this.cartService
      .updateItem(
        itemId,
        {
          quantity: currentQuantity + 1
        }
      )
      .subscribe({

        next: (response) => {

          console.log(
            'Quantity increased:',
            response
          );

          this.cart = response;

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            'Failed to increase quantity:',
            error
          );

        },

      });
  }


  // ==========================================
  // Decrease Quantity
  // ==========================================

  decreaseQuantity(
    itemId: string,
    currentQuantity: number
  ): void {

    if (currentQuantity <= 1) {

      return;

    }

    this.cartService
      .updateItem(
        itemId,
        {
          quantity: currentQuantity - 1
        }
      )
      .subscribe({

        next: (response) => {

          console.log(
            'Quantity decreased:',
            response
          );

          this.cart = response;

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            'Failed to decrease quantity:',
            error
          );

        },

      });
  }


  // ==========================================
  // Remove Item
  // ==========================================

  removeItem(
    itemId: string
  ): void {

    this.cartService
      .removeItem(itemId)
      .subscribe({

        next: () => {

          console.log(
            'Item removed from cart.'
          );

          this.loadCart();

        },

        error: (error) => {

          console.error(
            'Failed to remove item:',
            error
          );

        },

      });
  }


  // ==========================================
  // Clear Cart
  // ==========================================

  clearCart(): void {

    this.cartService
      .clearCart()
      .subscribe({

        next: () => {

          console.log(
            'Cart cleared.'
          );

          this.loadCart();

        },

        error: (error) => {

          console.error(
            'Failed to clear cart:',
            error
          );

        },

      });
  }

}