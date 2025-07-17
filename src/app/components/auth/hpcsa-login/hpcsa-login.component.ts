import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-hpcsa-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatSlideToggleModule
  ],
  templateUrl: './hpcsa-login.component.html',
  styleUrls: ['./hpcsa-login.component.scss']
})
export class HpcsaLoginComponent implements OnInit {
  loginForm: FormGroup;
  hide = true;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // Additional initialization if needed
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      const { email, password } = this.loginForm.value;

      this.authService.hpcsaLogin(email, password).subscribe({
        next: (response) => {
          this.loading = false;
          this.showSuccessMessage('Login successful!');
          this.router.navigate(['/hpcsa-dashboard']);
        },
        error: (error) => {
          this.loading = false;
          const errorMessage = error.error?.message || 'Login failed. Please try again.';
          this.showErrorMessage(errorMessage);
        }
      });
    } else {
      const errors = this.getFormValidationErrors();
      this.showErrorMessage(errors.join('\n'));
    }
  }

  private showSuccessMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  private showErrorMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  private getFormValidationErrors(): string[] {
    const errors: string[] = [];

    if (this.email?.hasError('required')) {
      errors.push('Email is required');
    } else if (this.email?.hasError('email')) {
      errors.push('Invalid email format');
    }

    if (this.password?.hasError('required')) {
      errors.push('Password is required');
    } else if (this.password?.hasError('minlength')) {
      errors.push('Password must be at least 6 characters');
    }

    return errors;
  }

  navigateToSignup(): void {
    this.router.navigate(['/hpcsa-signup']);
  }
}