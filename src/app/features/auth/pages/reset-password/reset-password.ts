import { Component } from '@angular/core';
import { inject } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth';
import { ResetPasswordRequest, ResetPasswordResponse } from '../../models/auth.models';
import { FormsModule } from '@angular/forms';
import { OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  imports: [FormsModule,RouterModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPassword implements OnInit {

  private readonly route =
    inject(ActivatedRoute);

  private readonly authService =
    inject(AuthService);

  private readonly cdr =
    inject(ChangeDetectorRef);


  token = '';

  newPassword = '';

  confirmPassword = '';


  isSubmitting = false;

  successMessage = '';

  errorMessage = '';


  ngOnInit(): void {

    /*
     * Read the password-reset token
     * from the URL.
     *
     * Example:
     * /auth/reset-password?token=abc123
     */
    this.token =
      this.route.snapshot
        .queryParamMap
        .get('token') ?? '';


    if (!this.token) {

      this.errorMessage =
        'Password reset token is missing.';
    }
  }


  resetPassword(): void {

    this.successMessage = '';
    this.errorMessage = '';


    /*
     * Validate token.
     */
    if (!this.token) {

      this.errorMessage =
        'Password reset token is missing.';

      return;
    }


    /*
     * Validate new password.
     */
    if (!this.newPassword) {

      this.errorMessage =
        'Please enter a new password.';

      return;
    }


    /*
     * Basic frontend validation.
     *
     * The backend remains responsible
     * for the actual password rules.
     */
    if (this.newPassword.length < 8) {

      this.errorMessage =
        'Password must be at least 8 characters.';

      return;
    }


    /*
     * Confirm password.
     */
    if (
      this.newPassword !==
      this.confirmPassword
    ) {

      this.errorMessage =
        'Passwords do not match.';

      return;
    }


    this.isSubmitting = true;


    const request:
      ResetPasswordRequest = {

        token: this.token,

        newPassword:
          this.newPassword

      };


    this.authService
      .resetPassword(request)
      .subscribe({

        next: (response) => {

          this.isSubmitting = false;

          this.successMessage =
            response.message;

          /*
           * Clear passwords from
           * the component state.
           */
          this.newPassword = '';
          this.confirmPassword = '';

          this.cdr.detectChanges();

        },


        error: (error) => {

          this.isSubmitting = false;

          this.errorMessage =
            error.error?.detail ??
            'Unable to reset your password.';

          this.cdr.detectChanges();

        }

      });
  }
}
