import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AddressService } from '../../services/address';
import { CreateAddressRequest } from '../../models/create-address-request.model.ts';


@Component({
  selector: 'app-address-create',
  imports: [FormsModule],
  templateUrl: './address-create.html',
  styleUrl: './address-create.css',
})
export class AddressCreate {
   private readonly addressService = inject(AddressService);
  private readonly router = inject(Router);

  form: CreateAddressRequest = {
    fullName: '',
    phoneNumber: '',
    addressLine1: '',
    addressLine2: null,
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
  };

  isSubmitting = false;
  errorMessage = '';

  createAddress(): void {
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

    const request: CreateAddressRequest = {
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

    this.addressService.create(request).subscribe({
      next: () => {
        this.isSubmitting = false;

        this.router.navigate(['/address']);
      },

      error: (error) => {
        this.isSubmitting = false;

        console.error(
          'Failed to create address:',
          error
        );

        this.errorMessage =
          error?.error?.detail ||
          'Unable to create address.';
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/address']);
  }
}
