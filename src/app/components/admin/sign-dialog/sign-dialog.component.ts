import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-sign-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  template: `
    <div class="dialog-container">
      <h2 class="dialog-title">Supervisor's Signature</h2>
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="update-form">
        <!-- Supervisor Signature Upload -->
        <div class="form-group full-width">
          <label for="supervisor_signature">Supervisor/EHP Signature:</label>
          <input
            type="file"
            id="supervisor_signature"
            accept="image/*"
            (change)="onFileSelected($event)"
            class="form-control"
          />
        </div>

        <!-- EHP HI Number (Editable Input) -->
        <mat-form-field appearance="fill" class="full-width">
          <mat-label>EHP HI Number</mat-label>
          <input matInput formControlName="ehp_hi_number" />
        </mat-form-field>

        <div class="button-group">
          <button
            mat-flat-button
            color="warn"
            type="button"
            (click)="onCancel()"
          >
            Cancel
          </button>
          <button mat-flat-button color="primary" type="submit">Update</button>
        </div>
      </form>
    </div>
  `,
  styles: [
    `
      .dialog-container {
        background-color: #fafafa;
        padding: 20px;
        max-width: 700px;
        margin: 15px;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      }

      .dialog-title {
        margin-bottom: 20px;
        color: rgb(0, 0, 0);
        font-size: 1.8em;
        text-align: center;
        font-weight: bold;
      }

      .update-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .full-width {
        width: 100%;
      }

      .button-group {
        display: flex;
        justify-content: center;
        gap: 10px;
        margin-top: 20px;
      }

      button[mat-flat-button] {
        border-radius: 8px;
        padding: 10px 20px;
        font-size: 16px;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }

      button[mat-flat-button][color='primary']:hover {
        background-color: #219653;
      }

      button[mat-flat-button][color='warn']:hover {
        background-color: #c62828;
      }
    `,
  ],
})
export class SignDialogComponent {
  form: FormGroup;
  selectedSupervisorSignature: File | null = null;

  constructor(
    public dialogRef: MatDialogRef<SignDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { log: any },
    private fb: FormBuilder,
    private authService: AuthService // Inject AuthService to make API calls
  ) {
    // Update the form group to match
    this.form = this.fb.group({
      ehp_hi_number: [data.log.EHP_HI_Number || ''], // Use backend-expected field name
    });
  }

  async onSubmit(): Promise<void> {
    if (this.form.valid) {
      const updatedData = {
        EHP_HI_Number: this.form.value.EHP_HI_Number,
        supervisor_signature: this.selectedSupervisorSignature,
      };

      // Debug: Log the data before sending
      console.log('Data to be sent:', updatedData);

      try {
        const formData = this.buildFormData(updatedData);

        // Debug: Log FormData contents
        formData.forEach((value, key) => {
          console.log(key, value);
        });

        console.log('Sent to authService', formData);
        const response = await lastValueFrom(
          this.authService.signLogsheet(this.data.log.id, formData)
        );

        console.log('Update successful:', response);
        this.dialogRef.close({ updatedData });
      } catch (error) {
        console.error('Error updating logsheet:', error);
        // Add user feedback here
      }
    }
  }

  // Helper method to build FormData from the updated data
  // sign-dialog.component.ts
  private buildFormData(updatedData: any): FormData {
    const formData = new FormData();

    // Append the HI number from form value
    if (this.form.value.ehp_hi_number) {
      formData.append('ehp_hi_number', this.form.value.ehp_hi_number);
    }

    if (updatedData.supervisor_signature) {
      formData.append(
        'supervisor_signature',
        updatedData.supervisor_signature,
        updatedData.supervisor_signature.name
      );
    }

    return formData;
  }

  // Handle file selection
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedSupervisorSignature = input.files[0];
      console.log('Selected file:', this.selectedSupervisorSignature);
    } else {
      console.log('No file selected');
    }
  }

  // Close dialog without saving
  onCancel(): void {
    this.dialogRef.close();
  }
}
