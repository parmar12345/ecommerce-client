import { Component } from '@angular/core';
import { inject } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../services/auth';
import { ForgotPasswordRequest, ForgotPasswordResponse } from '../../models/auth.models';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-forgot-password',
  imports: [FormsModule,RouterModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {
  private readonly authService =
    inject(AuthService);

  private readonly cdr =
    inject(ChangeDetectorRef);


  email = '';

  isSubmitting = false;

  successMessage = '';

  errorMessage = '';


  forgotPassword(): void {

    const email =
      this.email.trim();


    /*
     * Clear previous messages.
     */
    this.successMessage = '';
    this.errorMessage = '';


    /*
     * Validate email.
     */
    if (!email) {

      this.errorMessage =
        'Please enter your email address.';

      return;
    }


    if (!this.isValidEmail(email)) {

      this.errorMessage =
        'Please enter a valid email address.';

      return;
    }


    this.isSubmitting = true;


    const request:
      ForgotPasswordRequest = {

        email

      };


    this.authService
      .forgotPassword(request)
      .subscribe({

        next: (response) => {

          this.isSubmitting = false;

          this.successMessage =
            response.message;

          this.cdr.detectChanges();

        },


        error: (error) => {

          this.isSubmitting = false;

          this.errorMessage =
            error.error?.detail ??
            'Unable to process your request.';

          this.cdr.detectChanges();

        }

      });
  }


  private isValidEmail(
    email: string
  ): boolean {

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailPattern.test(email);
  }
}
