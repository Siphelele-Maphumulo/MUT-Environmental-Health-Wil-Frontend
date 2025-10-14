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

@Component({
  selector: 'app-event-code',
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
  templateUrl: './event-code.component.html',
  styleUrl: './event-code.component.scss',
})
export class CreateEventCodeComponent {
  eventCodeForm: FormGroup;
  generatedCode: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.eventCodeForm = this.fb.group({
      guest_name: ['', Validators.required],
      guest_email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit(): void {
    if (this.eventCodeForm.invalid) {
      alert('Please fill out all required fields correctly.');
      return;
    }

    const formData = this.eventCodeForm.value;

    this.authService.createEventCode(formData).subscribe({
      next: (response) => {
        this.generatedCode = response.data.event_code;
        this.eventCodeForm.reset(); // Reset the form after successful submission

        // Display a success message with the email information
        alert(
          `Event code created successfully! The code has been emailed to ${formData.guest_email}.`
        );
      },
      error: (error) => {
        console.error('Error creating event code:', error);
        alert('Failed to create event code. Please try again.');
      },
    });
  }

  copyToClipboard(): void {
    if (this.generatedCode) {
      navigator.clipboard
        .writeText(this.generatedCode)
        .then(() => {
          alert('Event code copied to clipboard!');
        })
        .catch((err) => {
          console.error('Failed to copy event code:', err);
          alert('Failed to copy event code. Please try again.');
        });
    }
  }
}