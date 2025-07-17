import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatOptionModule } from '@angular/material/core';

interface Title {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-hpcsa-signup',
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
    MatProgressSpinnerModule,
    MatOptionModule
  ],
  templateUrl: './hpcsa-signup.component.html',
  styleUrls: ['./hpcsa-signup.component.scss']
})
export class HpcsaSignupComponent implements OnInit {
  signupForm!: FormGroup;
  hide = true;
  hideConfirm = true;
  loading = false;
  selectedFile: File | null = null;

  private apiUrl = 'http://localhost:8080/api';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      hi_number: ['', [Validators.required, this.hpcsaNumberValidator()]],
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required],
      surname: ['', Validators.required],
      contact: [''],
      password: ['', [Validators.required, Validators.minLength(7)]],
      confirmPassword: ['', Validators.required],
      // Note: hpcsa_signature is now handled via file upload and should not be part of form control
    }, { validators: this.passwordMatchValidator });
  }

  hpcsaNumberValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;
      const isValid = /^[A-Za-z0-9]{6,20}$/.test(value);
      return isValid ? null : { invalidHpcsaNumber: true };
    };
  }

  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onSubmit(): void {
    if (this.signupForm.valid) {
      this.loading = true;
      const formData = new FormData();

      Object.keys(this.signupForm.value).forEach(key => {
        if (key !== 'confirmPassword') {
          formData.append(key, this.signupForm.value[key]);
        }
      });

      if (this.selectedFile) {
        formData.append('hpcsa_signature', this.selectedFile);
      }

      console.log('Form Values:', this.signupForm.value);
      this.logFormDataContents(formData);

      this.http.post<{ success: boolean; message: string; auditorId: number }>(
        `${this.apiUrl}/hpcsa/signup`,
        formData
      ).subscribe({
        next: resp => {
          this.loading = false;
          this.snackBar.open(resp.message, 'Close', { duration: 3000, panelClass: ['success-snackbar'] });
          this.router.navigate(['/hpcsa-login']);
        },
        error: err => {
          this.loading = false;
          const msg = err.error?.message || 'Registration failed. Please try again.';
          this.snackBar.open(msg, 'Close', { duration: 5000, panelClass: ['error-snackbar'] });
        }
      });

    } else {
      const errors = this.getFormValidationErrors();
      this.snackBar.open(errors.join('\n'), 'Close', { duration: 5000, panelClass: ['error-snackbar'] });
    }
  }

  private logFormDataContents(formData: FormData): void {
    console.log('--- FormData Contents ---');
    formData.forEach((value, key) => {
      if (value instanceof File) {
        console.log(`${key}: File(${value.name}, ${value.size} bytes)`);
      } else {
        console.log(`${key}: ${value}`);
      }
    });
    console.log('-------------------------');
  }

  getFormValidationErrors(): string[] {
    const errors: string[] = [];
    const controls = this.signupForm.controls;

    if (controls['hi_number'].hasError('required')) errors.push('HPCSA number is required');
    else if (controls['hi_number'].hasError('invalidHpcsaNumber')) errors.push('Invalid HPCSA number format');

    if (controls['email'].hasError('required')) errors.push('Email is required');
    else if (controls['email'].hasError('email')) errors.push('Invalid email format');

    if (controls['name'].hasError('required')) errors.push('Name is required');
    if (controls['surname'].hasError('required')) errors.push('Surname is required');

    if (controls['password'].hasError('required')) errors.push('Password is required');
    else if (controls['password'].hasError('minlength')) errors.push('Password must be at least 7 characters');

    if (controls['confirmPassword'].hasError('required')) errors.push('Confirm Password is required');
    if (this.signupForm.hasError('mismatch')) errors.push('Passwords do not match');

    return errors;
  }

  login(): void {
    this.router.navigate(['/hpcsa-login']);
  }
}
