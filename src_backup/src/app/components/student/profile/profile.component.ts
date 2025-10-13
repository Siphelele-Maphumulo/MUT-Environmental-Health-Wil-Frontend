import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    MatToolbarModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatGridListModule,
    MatIconModule,
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  cvFile: File | null = null;
  idFile: File | null = null;
  isLoading = false;
  cvPreview: string | null = null;
  idPreview: string | null = null;
  userEmail: string = '';
  errorMessage: string | undefined;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.userEmail = this.authService.getUserEmail() || '';
    if (!this.userEmail) {
      this.showErrorGo('No logged-in user found');
      return;
    }

    this.loadProfileData();
  }

  private initForm(): void {
    this.profileForm = this.fb.group({
      title: ['', Validators.required],
      fullNames: ['', Validators.required],
      surname: ['', Validators.required],
      currentPassword: [''],
      newPassword: ['', [Validators.minLength(8)]],
      confirmPassword: [''],
      agreeTerms: [false, Validators.requiredTrue],
    });
  }

  private loadProfileData(): void {
    this.isLoading = true;
    this.authService.getProfile(this.userEmail).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.profileForm.patchValue({
            title: response.data.title,
            fullNames: response.data.fullNames,
            surname: response.data.surname,
            agreeTerms: true,
          });

          this.cvPreview = response.data.cvDocument;
          this.idPreview = response.data.idDocument;
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Profile load error:', error);
        this.showError(error.error?.message || 'Failed to load profile');
        this.isLoading = false;
      },
    });
  }

  onFileSelected(event: Event, type: 'cv' | 'id'): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Validate file type
      if (type === 'cv' && !file.name.match(/\.(pdf|doc|docx)$/i)) {
        this.showError('Only PDF, DOC, or DOCX files are allowed for CV');
        return;
      }

      if (type === 'id' && !file.name.match(/\.(jpg|jpeg|png|pdf)$/i)) {
        this.showError('Only JPG, PNG, or PDF files are allowed for ID');
        return;
      }

      if (type === 'cv') {
        this.cvFile = file;
        this.previewFile(file, 'cv');
      } else {
        this.idFile = file;
        this.previewFile(file, 'id');
      }
    }
  }

  private previewFile(file: File, type: 'cv' | 'id'): void {
    const reader = new FileReader();
    reader.onload = () => {
      if (type === 'cv') {
        this.cvPreview = reader.result as string;
      } else {
        this.idPreview = reader.result as string;
      }
    };
    reader.readAsDataURL(file);
  }

  onSubmit(): void {
    if (!this.profileForm.valid) {
      this.markFormGroupTouched(this.profileForm);
      this.showError('Please correct the highlighted errors.');
      return;
    }

    if (
      this.profileForm.value.newPassword &&
      this.profileForm.value.newPassword !== this.profileForm.value.confirmPassword
    ) {
      this.showError('Passwords do not match');
      return;
    }

    this.isLoading = true;

    const formData = new FormData();
    const formValues = this.profileForm.value;

    formData.append('title', formValues.title);
    formData.append('fullNames', formValues.fullNames);
    formData.append('surname', formValues.surname);

    if (this.cvFile) formData.append('cvDocument', this.cvFile);
    if (this.idFile) formData.append('idDocument', this.idFile);

    // Add password fields only if newPassword is provided
    if (formValues.newPassword) {
      formData.append('currentPassword', formValues.currentPassword);
      formData.append('newPassword', formValues.newPassword);
    }

    this.authService.updateProfile(formData).subscribe({
      next: () => {
        this.showSuccess('Profile updated successfully');
        this.loadProfileData(); // Refresh data
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Profile update error:', error);
        this.showError(error.error?.message || 'Failed to update profile');
        this.isLoading = false;
      },
    });
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['success-snackbar'],
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar'],
    });
  }

  showErrorGo(message: string): void {
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = '';
    }, 10000);
  }
}