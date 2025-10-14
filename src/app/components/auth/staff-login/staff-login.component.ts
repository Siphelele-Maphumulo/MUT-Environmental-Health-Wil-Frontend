import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle'; //interesting, some modules cannot be detected automatically when importing them, such as this one

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'; // If you use snack bars for notifications
import { MatTooltipModule } from '@angular/material/tooltip'; // Tooltips, if needed
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-staff-login',
  imports: [
    CommonModule,
    NgIf,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatFormFieldModule, // MatFormField for form controls
    MatIconModule, // MatIcon for icons
    MatSnackBarModule, // Optional: For notifications
    MatTooltipModule, // Optional: For tooltips
  ],
  templateUrl: './staff-login.component.html',
  styleUrl: './staff-login.component.scss',
})
export class StaffLoginComponent {
  loginForm!: FormGroup;
  // Declare the 'hide' property to control password visibility
  hide: boolean = true;
  // just declaring them here
  // password: any;
  // email: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar // Inject MatSnackBar for notifications
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  // these make the code so much cleaner, notice the space between get and the property
  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const credentials = this.loginForm.value;
  
      this.authService.staffLogin(credentials).subscribe({
        next: (response) => {
          console.log('🔐 Staff Login Response:', response);
  
          // AuthService.staffLogin stores the auth data; call debug helper to log stored state
          this.authService.debugAuthState();

          // Show success message and navigate to the dashboard
          this.snackBar.open('Staff Logged in successfully!', 'Close', {
            duration: 3000,
          });
          this.router.navigate(['/admin-dashboard']);
        },
        error: (err) => {
          console.error('❌ Staff Login failed:', err);
          const errorMessage = err.error?.message || err.message || 'Invalid credentials';
          this.snackBar.open(errorMessage, 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar'],
          });
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  signUp(): void {
    this.router.navigate(['/staff-signup']);
  }
}
