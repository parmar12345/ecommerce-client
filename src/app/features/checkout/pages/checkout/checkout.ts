import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { CheckoutService } from '../../services/checkout';
import { CheckoutResponse } from '../../models/checkout-response';

import { AddressService } from '../../../address/services/address';
import { Address as AddressModel } from '../../../address/models/address';

@Component({
  selector: 'app-checkout',
  imports: [RouterLink],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout implements OnInit {

  private readonly checkoutService = inject(CheckoutService);
  private readonly addressService = inject(AddressService);
  private readonly router = inject(Router);

  addresses = signal<AddressModel[]>([]);
  selectedAddressId = signal('');
  checkoutResponse = signal<CheckoutResponse | null>(null);

  isLoading = signal(false);
  isLoadingAddresses = signal(false);
  errorMessage = signal('');

  ngOnInit(): void {
    this.loadAddresses();
  }

  loadAddresses(): void {
    this.isLoadingAddresses.set(true);
    this.errorMessage.set('');

    this.addressService.getAll().subscribe({
      next: (response) => {
        this.addresses.set(response);
        this.isLoadingAddresses.set(false);

        console.log(
          'Checkout addresses:',
          this.addresses()
        );
      },

      error: (error) => {
        this.isLoadingAddresses.set(false);

        console.error(
          'Failed to load addresses:',
          error
        );

        this.errorMessage.set(
          error?.error?.detail ||
          'Unable to load your addresses.'
        );
      }
    });
  }

  selectAddress(addressId: string): void {
    this.selectedAddressId.set(addressId);
    this.errorMessage.set('');

    console.log(
      'Selected address:',
      this.selectedAddressId()
    );
  }

  placeOrder(): void {

    if (!this.selectedAddressId()) {
      this.errorMessage.set(
        'Please select an address.'
      );
      return;
    }

    const request = {
      addressId: this.selectedAddressId()
    };

    this.isLoading.set(true);
    this.errorMessage.set('');

    console.log(
      'Checkout request:',
      request
    );

    this.checkoutService.checkout(request).subscribe({

      next: (response) => {

        console.log(
          'Checkout response:',
          response
        );

        this.checkoutResponse.set(response);
        this.isLoading.set(false);

        this.router.navigate([
          '/checkout/success',
          response.orderId
        ]);
      },

      error: (error) => {

        console.error(
          'Checkout error:',
          error
        );

        this.isLoading.set(false);

        this.errorMessage.set(
          error?.error?.detail ||
          error?.error?.message ||
          'Checkout failed.'
        );
      }
    });
  }
}