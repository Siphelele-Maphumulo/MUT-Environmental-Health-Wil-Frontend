
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidatorFn,
  ValidationErrors,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { StaffSignupCodeComponent } from '../staff-signup/staff-sigup-code/staff-sigup-code.component';

interface Title {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-mentor-signup',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    CommonModule,
    NgIf,
    MatFormFieldModule,
    MatIconModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatOptionModule,
    MatSelectModule,
  ],
  templateUrl: './mentor-signup.component.html',
  styleUrl: './mentor-signup.component.scss'
})
export class MentorSignupComponent {
  signupForm!: FormGroup;
  hide = true;
  hideConfirm = true;

  title: Title[] = [
    { value: 'Mr', viewValue: 'Mr' },
    { value: 'Mrs', viewValue: 'Mrs' },
    { value: 'Ms', viewValue: 'Ms' },
    { value: 'Dr', viewValue: 'Dr' },
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService, // Inject AuthService
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group(
      {
        email: [
          '',
          [Validators.required, Validators.email, this.emailDomainValidator()],
        ],
        title: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(7)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );

    this.signupForm.get('password')?.valueChanges.subscribe(() => {
      this.signupForm.get('confirmPassword')?.updateValueAndValidity();
    });
  }

  emailDomainValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;
      const domain = value.split('@').pop();
      return domain === 'mut.ac.za' ? null : { pattern: true };
    };
  }

  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmit(): void {
    if (this.signupForm.valid) {
      this.openPinDialog();
    } else {
      const errors = this.getFormValidationErrors();
      this.snackBar.open(errors.join('\n'), 'Close', {
        duration: 5000,
        panelClass: ['error-snackbar'],
      });
    }
  }

  getFormValidationErrors(): string[] {
    const errors: string[] = [];
    const controls = this.signupForm.controls;

    if (controls['email'].hasError('required')) {
      errors.push('Email is required');
    } else if (controls['email'].hasError('email')) {
      errors.push('Invalid email format');
    } else if (controls['email'].hasError('pattern')) {
      errors.push('Email must end with @mut.ac.za');
    }

    if (controls['title'].hasError('required')) {
      errors.push('Title is required');
    }

    if (controls['password'].hasError('required')) {
      errors.push('Password is required');
    } else if (controls['password'].hasError('minlength')) {
      errors.push('Password must be at least 7 characters');
    }

    if (controls['confirmPassword'].hasError('required')) {
      errors.push('Confirm Password is required');
    }

    if (this.signupForm.hasError('mismatch')) {
      errors.push('Passwords do not match');
    }

    return errors;
  }

  openPinDialog(): void {
    let attempts = 0;
    const maxAttempts = 3;
    const email = this.signupForm.get('email')?.value;

    const askForCode = () => {
      const dialogRef = this.dialog.open(StaffSignupCodeComponent, {
        width: '300px',
        disableClose: true,
      });

      dialogRef.afterClosed().subscribe((code) => {
        if (code || code.trim() !== '') {
          this.authService.validateStaffCode(code).subscribe(
            (isValid) => {
              if (isValid) {
                this.signupForm.addControl('code', this.fb.control(code)); // Add code to form

                this.authService.mentorSignup(this.signupForm.value).subscribe({
                  next: () => {
                    this.snackBar.open('Mentor successful!', 'Close', {
                      duration: 3000,
                    });
                    this.router.navigate(['/mentor-login']);
                  },
                  error: (error) => {
                    console.error('Signup error:', error);
                    this.snackBar.open(
                      'Signup failed. Please try again.',
                      'Close',
                      { duration: 5000 }
                    );
                  },
                });
              } else {
                this.snackBar.open(
                  'You have Entered an incorrect code!. Please contact Secretary or Wil Coordinator.',
                  'Close',
                  { duration: 5000 }
                );
              }
            },
            (error) => {
              console.error('Validation error:', error);
              this.snackBar.open(
                'Server error during code validation.',
                'Close',
                { duration: 5000 }
              );
            }
          );
        } else {
          this.snackBar.open(
            'You must enter the signup code to proceed.',
            'Close',
            { duration: 3000 }
          );
        }
      });
    };

    askForCode();
  }

  login(): void {
    this.router.navigate(['/mentor-login']);
  }
}
