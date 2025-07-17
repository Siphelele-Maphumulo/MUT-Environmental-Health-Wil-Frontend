import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../services/auth.service';

// Material Modules
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
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatIconModule,
    MatSnackBarModule,
    MatTooltipModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  hide = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar // Inject MatSnackBar for notifications
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: [
        '',
        [Validators.required, Validators.email, this.emailDomainValidator()],
      ],
      password: ['', [Validators.required, Validators.minLength(7)]],
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  getEmail(): string | null {
    return localStorage.getItem('email'); // Or sessionStorage
  }

  get password() {
    return this.loginForm.get('password');
  }

  // Custom validator to check if the email ends with @mut.ac.za
  emailDomainValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;
      const domain = value.split('@').pop();
      return domain === 'live.mut.ac.za' ? null : { pattern: true };
    };
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const credentials = this.loginForm.value;

      this.authService.studentLogin(credentials).subscribe({
        next: (response) => {
          console.log('Backend response:', response); // Debugging: Log the response

          // ✅ Fix: Use response.email directly
          if (response.email) {
            sessionStorage.setItem('userEmail', response.email);
          }

          // Show success message and navigate to the dashboard
          this.snackBar.open('Login successful!', 'Close', { duration: 3000 });
          this.router.navigate(['/student-dashboard']);
        },
        error: (err) => {
          console.error('Login failed:', err);
          this.snackBar.open(err.message || 'Invalid credentials', 'Close', {
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
    this.router.navigate(['/signup']);
  }
}
