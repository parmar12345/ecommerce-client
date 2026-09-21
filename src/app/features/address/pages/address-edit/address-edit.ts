import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AddressService } from '../../services/address';
import { Address } from '../../models/address';
import { UpdateAddressRequest } from '../../models/update-address-request.model.ts';

@Component({
  selector: 'app-address-edit',
  imports: [FormsModule],
  templateUrl: './address-edit.html',
  styleUrl: './address-edit.css',
})
export class AddressEdit implements OnInit {

  private readonly addressService = inject(AddressService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  addressId = '';

  form: UpdateAddressRequest = {
    fullName: '',
    phoneNumber: '',
    addressLine1: '',
    addressLine2: null,
    city: '',
    state: '',
    postalCode: '',
    country: '',
  };

  isLoading = false;
  isSubmitting = false;
  errorMessage = '';

  ngOnInit(): void {
    this.addressId =
      this.route.snapshot.paramMap.get('id') ?? '';

    if (!this.addressId) {
      this.errorMessage = 'Invalid address.';
      return;
    }

    this.loadAddress();
  }

  loadAddress(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.addressService.getById(this.addressId).subscribe({
      next: (address: Address) => {
        this.form = {
          fullName: address.fullName,
          phoneNumber: address.phoneNumber,
          addressLine1: address.addressLine1,
          addressLine2: address.addressLine2,
          city: address.city,
          state: address.state,
          postalCode: address.postalCode,
          country: address.country,
        };

        this.isLoading = false;
      },

      error: (error) => {
        this.isLoading = false;

        console.error(
          'Failed to load address:',
          error
        );

        this.errorMessage =
          error?.error?.detail ||
          'Unable to load address.';
      },
    });
  }

  updateAddress(): void {
    this.errorMessage = '';

    if (
      !this.form.fullName.trim() ||
      !this.form.phoneNumber.trim() ||
      !this.form.addressLine1.trim() ||
      !this.form.city.trim() ||
      !this.form.state.trim() ||
      !this.form.postalCode.trim() ||
      !this.form.country.trim()
    ) {
      this.errorMessage =
        'Please fill in all required fields.';

      return;
    }

    this.isSubmitting = true;

    const request: UpdateAddressRequest = {
      ...this.form,
      fullName: this.form.fullName.trim(),
      phoneNumber: this.form.phoneNumber.trim(),
      addressLine1: this.form.addressLine1.trim(),
      addressLine2:
        this.form.addressLine2?.trim() || null,
      city: this.form.city.trim(),
      state: this.form.state.trim(),
      postalCode: this.form.postalCode.trim(),
      country: this.form.country.trim(),
    };

    this.addressService
      .update(this.addressId, request)
      .subscribe({
        next: () => {
          this.isSubmitting = false;

          this.router.navigate(['/address']);
        },

        error: (error) => {
          this.isSubmitting = false;

          console.error(
            'Failed to update address:',
            error
          );

          this.errorMessage =
            error?.error?.detail ||
            'Unable to update address.';
        },
      });
  }

  cancel(): void {
    this.router.navigate(['/address']);
  }
}