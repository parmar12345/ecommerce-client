import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { inject, ChangeDetectorRef } from '@angular/core';
import { LoginRequest } from '../../models/auth.models';
import { FormsModule } from '@angular/forms';
import { AuthStateService } from '../../services/auth-state';
import { LoginResponse } from '../../models/auth.models';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule,RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
 private readonly authService =
    inject(AuthService);

  private readonly authState =
    inject(AuthStateService);

  private readonly router =
    inject(Router);

  private readonly cdr =
    inject(ChangeDetectorRef);


  email = '';

  password = '';

  isLoggingIn = false;

  errorMessage = '';


  login(): void {

  const email = this.email.trim();

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

  if (!this.password) {
    this.errorMessage =
      'Please enter your password.';
    return;
  }

  this.isLoggingIn = true;
  this.errorMessage = '';

  const request: LoginRequest = {
    email,
    password: this.password
  };

  this.authService
    .login(request)
    .subscribe({

     next: (response) => {

  console.log('LOGIN SUCCESS:', response);

  this.isLoggingIn = false;

  this.authState.setAuth(response);

  console.log(
    'IS AUTHENTICATED:',
    this.authState.isAuthenticated()
  );

  this.router.navigate(['/products'])
    .then((success) => {

      console.log(
        'NAVIGATION RESULT:',
        success
      );

    })
    .catch((error) => {

      console.error(
        'NAVIGATION ERROR:',
        error
      );

    });

  this.authService
    .getMe()
    .subscribe({
      next: (user) => {

        console.log(
          'CURRENT USER:',
          user
        );

        this.cdr.detectChanges();
      },

      error: (error) => {

        console.error(
          'GET-ME FAILED:',
          error
        );

        this.cdr.detectChanges();
      }
    });
},
      error: (error) => {

        this.isLoggingIn = false;

        this.errorMessage =
          error.error?.detail ??
          'Login failed. Please check your credentials.';

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
