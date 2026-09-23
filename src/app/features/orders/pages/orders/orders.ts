import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { Orders as OrdersService } from '../../services/orders';
import { Order } from '../../models/order';

@Component({
  selector: 'app-orders',
  imports: [RouterLink, DatePipe],
  templateUrl: './orders.html',
  styleUrl: './orders.css'
})
export class Orders implements OnInit {

  private readonly ordersService = inject(OrdersService);

  orders = signal<Order[]>([]);
  isLoading = signal(false);
  errorMessage = signal('');

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.ordersService.getAll().subscribe({
      next: (response) => {
        console.log('Orders:', response);

        this.orders.set(response);
        this.isLoading.set(false);
      },

      error: (error) => {
        console.error('Failed to load orders:', error);

        this.isLoading.set(false);

        this.errorMessage.set(
          error?.error?.detail ||
          error?.error?.message ||
          'Unable to load your orders.'
        );
      }
    });
  }
}