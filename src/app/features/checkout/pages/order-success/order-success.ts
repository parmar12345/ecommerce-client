import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CheckoutService } from '../../services/checkout';
import { OrderResponse } from '../../models/order-response';

@Component({
  selector: 'app-order-success',
  imports: [],
  templateUrl: './order-success.html',
  styleUrl: './order-success.css'
})
export class OrderSuccess implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly checkoutService = inject(CheckoutService);

  order = signal<OrderResponse | null>(null);
  isLoading = signal(true);
  errorMessage = signal('');

  ngOnInit(): void {
    const orderId =
      this.route.snapshot.paramMap.get('orderId');

    if (!orderId) {
      this.errorMessage.set('Order ID was not found.');
      this.isLoading.set(false);
      return;
    }

    this.loadOrder(orderId);
  }

  private loadOrder(orderId: string): void {
    this.checkoutService.getOrder(orderId).subscribe({
      next: (response) => {
        console.log('Order response:', response);

        this.order.set(response);
        this.isLoading.set(false);
      },

      error: (error) => {
        console.error('Get order error:', error);

        this.errorMessage.set(
          error?.error?.detail ||
          error?.error?.message ||
          'Unable to load order.'
        );

        this.isLoading.set(false);
      }
    });
  }
}