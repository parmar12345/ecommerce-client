import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AddressService } from '../../services/address';
import { Address as AddressModel } from '../../models/address';

@Component({
  selector: 'app-address',
  imports: [RouterLink],
  templateUrl: './address.html',
  styleUrl: './address.css',
})
export class Address implements OnInit {

  private readonly addressService = inject(AddressService);

  addresses: AddressModel[] = [];
  isLoading = false;
  errorMessage = '';

  deletingAddressId: string | null = null;
  settingDefaultAddressId: string | null = null;

  ngOnInit(): void {
    this.loadAddresses();
  }

  loadAddresses(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.addressService.getAll().subscribe({
      next: (response) => {
        this.addresses = response;
        this.isLoading = false;

        console.log('Addresses:', this.addresses);
      },

      error: (error) => {
        this.isLoading = false;

        console.error(
          'Failed to load addresses:',
          error
        );

        this.errorMessage =
          error?.error?.detail ||
          'Unable to load your addresses.';
      },
    });
  }

  deleteAddress(addressId: string): void {
    const confirmed = window.confirm(
      'Are you sure you want to delete this address?'
    );

    if (!confirmed) {
      return;
    }

    this.deletingAddressId = addressId;
    this.errorMessage = '';

    this.addressService.delete(addressId).subscribe({
      next: () => {
        this.deletingAddressId = null;

        this.loadAddresses();
      },

      error: (error) => {
        this.deletingAddressId = null;

        console.error(
          'Failed to delete address:',
          error
        );

        this.errorMessage =
          error?.error?.detail ||
          'Unable to delete address.';
      },
    });
  }

  setDefaultAddress(addressId: string): void {
    this.settingDefaultAddressId = addressId;
    this.errorMessage = '';

    this.addressService.setDefault(addressId).subscribe({
      next: () => {
        this.settingDefaultAddressId = null;

        this.loadAddresses();
      },

      error: (error) => {
        this.settingDefaultAddressId = null;

        console.error(
          'Failed to set default address:',
          error
        );

        this.errorMessage =
          error?.error?.detail ||
          'Unable to set default address.';
      },
    });
  }
}