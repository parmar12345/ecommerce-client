import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';

import { Orders } from '../../services/orders';
import { Order } from '../../models/order';

@Component({
  selector: 'app-order-details',
  imports: [RouterLink, DatePipe],
  templateUrl: './order-details.html',
  styleUrl: './order-details.css'
})
export class OrderDetails implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly ordersService = inject(Orders);

  order = signal<Order | null>(null);
  isLoading = signal(true);
  errorMessage = signal('');

  ngOnInit(): void {
    const orderId =
      this.route.snapshot.paramMap.get('orderId');

    console.log('Order ID:', orderId);

    if (!orderId) {
      this.errorMessage.set('Order ID was not found.');
      this.isLoading.set(false);
      return;
    }

    this.loadOrder(orderId);
  }

  private loadOrder(orderId: string): void {
    this.ordersService.getById(orderId).subscribe({
      next: (response) => {
        console.log('Order details:', response);

        this.order.set(response);
        this.isLoading.set(false);
      },

      error: (error) => {
        console.error('Failed to load order:', error);

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