import { Component } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { PinDialogComponent } from '../../admin/event-management/pin-dialog/pin-dialog.component';

@Component({
  selector: 'app-mentor-event-management',
  templateUrl: './mentor-event-management.component.html',
  styleUrl: './mentor-event-management.component.scss',
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
})
export class MentorEventManagementComponent {
  eventForm: FormGroup;
  selectedFile: File | null = null;
  selectedFileName: string | null = null;
  isLoading: boolean = false;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      event_type: ['', Validators.required],
      event_date: ['', Validators.required],
    });
  }

  // Handle file selection
  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.selectedFileName = this.selectedFile.name;
    }
  }

  // Open PIN dialog for validation
  openPinDialog(): void {
    const dialogRef = this.dialog.open(PinDialogComponent, {
      width: '300px',
    });

    dialogRef.afterClosed().subscribe((code) => {
      if (code && code.trim() !== '') {
        this.authService.validateEventCode(code).subscribe((response: any) => {
          if (response.success) {
            const guestName = response.data?.guest_name; // Extract guest_name from the response
            if (guestName) {
              console.log('Guest name retrieved:', guestName); // Debugging
              this.submitEvent(guestName); // Pass guest_name to submitEvent
            } else {
              alert('Failed to retrieve guest details. Please try again.');
            }
          } else {
            alert('Invalid event code. Please try again.');
          }
        });
      } else {
        alert('Please enter a valid event code.');
      }
    });
  }

  // Submit the form data to the backend
  submitEvent(guestName: string): void {
    console.log('Submitting event with guest name:', guestName); // Debugging

    if (!this.eventForm || this.eventForm.invalid) {
      alert('Please fill out all required fields.');
      return;
    }

    if (!this.selectedFile) {
      alert('Please upload a document.');
      return;
    }

    const formData = new FormData();
    formData.append('title', this.eventForm.get('title')?.value);
    formData.append('guest_name', guestName); // Include guest_name in the form data
    formData.append('event_type', this.eventForm.get('event_type')?.value);
    formData.append(
      'event_date',
      this.eventForm.get('event_date')?.value.toISOString()
    );
    formData.append('document', this.selectedFile);

    // Log FormData contents for debugging
    console.log('FormData contents:');
    formData.forEach((value, key) => {
      console.log(key, value);
    });

    // Construct the correct URL without duplicate /api
    const apiUrl = `${this.authService.apiUrl}/guest-lectures`; // Remove /api if already included

    this.isLoading = true; // Show loading indicator
    this.authService.addGuestLecture(formData).subscribe({
      next: (response) => {
        console.log('Event creation response:', response); // Debugging
        alert('Event created successfully!');
        this.router.navigate(['/home']);
        this.isLoading = false; // Hide loading indicator
      },
      error: (error) => {
        console.error('Error creating event:', error);
        alert('Failed to create event. Please try again.');
        this.isLoading = false; // Hide loading indicator
      },
    });
  }
}
