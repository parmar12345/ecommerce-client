import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth';
import { OnInit, inject ,ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-verify-email',
  imports: [FormsModule,RouterLink],
  templateUrl: './verify-email.html',
  styleUrl: './verify-email.css',
})
export class VerifyEmail implements OnInit {
  
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);
  private readonly cdr = inject(ChangeDetectorRef);

  // Verification state
  isVerifying = true;
  isVerified = false;

  // Resend state
  isResending = false;
  resendSuccess = false;

  // Messages
  message = '';
  errorMessage = '';
  resendMessage = '';

  // Email input
  email = '';

  ngOnInit(): void {

    const token =
      this.route.snapshot.queryParamMap.get('token');

    console.log('Verification token:', token);

    if (!token) {

      this.isVerifying = false;

      this.errorMessage =
        'Email verification token is missing.';

      this.cdr.detectChanges();

      return;
    }

    this.verifyEmail(token);
  }

  private verifyEmail(token: string): void {

    this.authService
      .verifyEmail(token)
      .subscribe({

        next: (response) => {

          this.isVerifying = false;
          this.isVerified = true;

          this.message = response.message;

          this.cdr.detectChanges();
        },

        error: (error) => {

          this.isVerifying = false;
          this.isVerified = false;

          this.errorMessage =
            error.error?.detail ??
            'Email verification failed.';

          this.cdr.detectChanges();
        }

      });
  }

 resendVerification(): void {

  const email = this.email.trim();

  if (!email) {

    this.resendSuccess = false;

    this.resendMessage =
      'Please enter your email address.';

    return;
  }

  if (!this.isValidEmail(email)) {

    this.resendSuccess = false;

    this.resendMessage =
      'Please enter a valid email address.';

    return;
  }

  this.isResending = true;
  this.resendSuccess = false;
  this.resendMessage = '';

  this.authService
    .resendVerification(email)
    .subscribe({

      next: (response) => {

        this.isResending = false;
        this.resendSuccess = true;

        this.resendMessage =
          response.message;

        this.cdr.detectChanges();
      },

      error: (error) => {

        this.isResending = false;
        this.resendSuccess = false;

        this.resendMessage =
          error.error?.detail ??
          'Unable to resend verification email.';

        this.cdr.detectChanges();
      }

    });
}

private isValidEmail(email: string): boolean {

  const emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailPattern.test(email);
}
}
