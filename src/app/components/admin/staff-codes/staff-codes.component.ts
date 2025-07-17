import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-staff-codes',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatIconModule,
    MatDialogModule,
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './staff-codes.component.html',
  styleUrls: ['./staff-codes.component.scss'],
})
export class StaffCodesComponent {
  staffCodeForm: FormGroup;
  generatedCode: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.staffCodeForm = this.fb.group({
      staff_name: ['', Validators.required],
      staff_email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit(): void {
    if (this.staffCodeForm.invalid) {
      this.snackBar.open(
        'Please fill out all required fields correctly.',
        'Close',
        {
          duration: 3000,
        }
      );
      return;
    }

    const formData = {
      staff_name: this.staffCodeForm.value.staff_name,
      staff_email: this.staffCodeForm.value.staff_email,
    };

    this.authService.createStaffCode(formData).subscribe({
      next: (response) => {
        this.generatedCode = response.data.code;
        this.staffCodeForm.reset();

        this.snackBar.open(
          `Staff code created successfully! The code has been emailed to ${formData.staff_email}.`,
          'Close',
          { duration: 5000 }
        );
      },
      error: (error) => {
        console.error('Error creating staff code:', error);
        this.snackBar.open(
          'Failed to create staff code. Please try again.',
          'Close',
          { duration: 3000 }
        );
      },
    });
  }

  copyToClipboard(): void {
    if (this.generatedCode) {
      navigator.clipboard
        .writeText(this.generatedCode)
        .then(() => {
          this.snackBar.open('Staff code copied to clipboard!', 'Close', {
            duration: 2000,
          });
        })
        .catch((err) => {
          console.error('Failed to copy staff code:', err);
          this.snackBar.open(
            'Failed to copy staff code. Please try again.',
            'Close',
            { duration: 3000 }
          );
        });
    }
  }
}
