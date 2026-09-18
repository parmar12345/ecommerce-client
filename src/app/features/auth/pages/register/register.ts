import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { AuthService } from '../../services/auth';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule,RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  readonly registerForm = this.fb.nonNullable.group({
    name: [
      '',
      [
        Validators.required,
        Validators.maxLength(100)
      ]
    ],

    email: [
      '',
      [
        Validators.required,
        Validators.email,
        Validators.maxLength(255)
      ]
    ],

    password: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(100)
      ]
    ]
  });

  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

 onSubmit(): void {
  this.successMessage = '';
  this.errorMessage = '';

  if (this.registerForm.invalid) {
    this.registerForm.markAllAsTouched();
    return;
  }

  this.isSubmitting = true;

  const request = this.registerForm.getRawValue();

  this.authService.register(request).subscribe({
    next: (response) => {
      this.isSubmitting = false;
      this.successMessage = response.message;
      this.registerForm.reset();
    },

    error: (error) => {
      this.isSubmitting = false;

      console.error('Registration failed:', error);

      this.errorMessage =
        error.error?.detail ??
        'Registration failed. Please try again.';
    }
  });
}
}
