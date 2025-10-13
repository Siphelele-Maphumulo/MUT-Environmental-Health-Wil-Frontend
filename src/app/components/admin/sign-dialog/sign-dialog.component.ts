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
      
      <!-- Supervisor Information Display -->
      <div class="supervisor-info" *ngIf="supervisorInfo">
        <div class="info-item">
          <strong>Supervisor:</strong> {{ supervisorInfo.name }}
        </div>
        <div class="info-item">
          <strong>Email:</strong> {{ supervisorInfo.email }}
        </div>
        <div class="info-item" *ngIf="supervisorInfo.signature">
          <strong>Signature:</strong> 
          <span class="signature-status success">✓ Available</span>
        </div>
        <div class="info-item" *ngIf="!supervisorInfo.signature">
          <strong>Signature:</strong> 
          <span class="signature-status warning">⚠️ Not Found</span>
        </div>
      </div>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="update-form">
        <!-- EHP HI Number (Editable Input) -->
        <mat-form-field appearance="fill" class="full-width">
          <mat-label>EHP HI Number</mat-label>
          <input matInput formControlName="ehp_hi_number" placeholder="Enter EHP HI Number" />
        </mat-form-field>

        <div class="signature-note">
          <p>Signature automatically attached from your staff profile✅ </p>
        </div>

        <div class="button-group">
          <button
            mat-flat-button
            color="warn"
            type="button"
            (click)="onCancel()"
          >
            Cancel
          </button>
          <button 
            mat-flat-button 
            color="primary" 
            type="submit"
            [disabled]="!supervisorInfo?.signature || form.invalid"
          >
            Sign Logsheet
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [
    `
      .dialog-container {
        background-color: #fafafa;
        padding: 20px;
        max-width: 500px;
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

      .supervisor-info {
        background: white;
        padding: 15px;
        border-radius: 8px;
        margin-bottom: 20px;
        border-left: 4px solid #2196F3;
      }

      .info-item {
        margin-bottom: 8px;
        display: flex;
        justify-content: space-between;
      }

      .signature-status {
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 0.9em;
      }

      .signature-status.success {
        background-color: #e8f5e8;
        color: #2e7d32;
      }

      .signature-status.warning {
        background-color: #fff3e0;
        color: #ef6c00;
      }

      .update-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .full-width {
        width: 100%;
      }

      .signature-note {
        background-color: #e3f2fd;
        padding: 10px;
        border-radius: 4px;
        font-size: 0.9em;
        color: #1565c0;
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

      button[mat-flat-button][color='primary']:hover:not([disabled]) {
        background-color: #219653;
      }

      button[mat-flat-button][color='warn']:hover {
        background-color: #c62828;
      }

      button[mat-flat-button][disabled] {
        background-color: #cccccc;
        color: #666666;
        cursor: not-allowed;
      }
    `,
  ],
})
export class SignDialogComponent {
  form: FormGroup;
  supervisorInfo: any = null;

  constructor(
    public dialogRef: MatDialogRef<SignDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { log: any },
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      ehp_hi_number: [data.log.EHP_HI_Number || ''], // Use backend-expected field name
    });

    // Load supervisor info when dialog opens
    this.loadSupervisorInfo();
  }

  ngOnInit(): void {
  this.form = this.fb.group({
    ehp_hi_number: [this.data.log.EHP_HI_Number || ''],
  });

  // Check authentication state
  console.log('🔐 Current authentication state:');
  console.log('- Is authenticated:', this.authService.isAuthenticated());
  console.log('- User email:', this.authService.getCurrentUserEmail());
  console.log('- Token:', this.authService.getToken());

  this.loadSupervisorInfo();
}

  async loadSupervisorInfo(): Promise<void> {
    try {
      // Get current supervisor info
      const response = await lastValueFrom(this.authService.getCurrentSupervisorByEmail());
      
      if (response.success && response.supervisor) {
        this.supervisorInfo = {
          name: response.supervisor.name,
          email: response.supervisor.email,
          signature: response.supervisor.signature_image
        };
        console.log('✅ Supervisor info loaded:', this.supervisorInfo);
      } else {
        console.error('❌ Failed to load supervisor info:', response);
        this.supervisorInfo = {
          name: 'Unknown',
          email: 'Unknown',
          signature: null
        };
      }
    } catch (error) {
      console.error('❌ Error loading supervisor info:', error);
      this.supervisorInfo = {
        name: 'Error loading',
        email: 'Error loading',
        signature: null
      };
    }
  }

async onSubmit(): Promise<void> {
  if (this.form.valid && this.supervisorInfo?.signature) {
    const data = {
      ehp_hi_number: this.form.value.ehp_hi_number
    };

    console.log('Data to be sent:', data);

    try {
      console.log('Sending to authService...');
      const response = await lastValueFrom(
        this.authService.signLogsheet(this.data.log.id, data) // Pass the object directly
      );

      console.log('Signing successful:', response);
      this.dialogRef.close({ 
        success: true,
        message: 'Logsheet signed successfully!',
        supervisor_name: this.supervisorInfo.name,
        data: response 
      });
    } catch (error) {
      console.error('Error signing logsheet:', error);
      this.dialogRef.close({ 
        success: false,
        message: 'Failed to sign logsheet',
        error: error 
      });
    }
  }
}

// Close dialog without saving
onCancel(): void {
  this.dialogRef.close({ success: false, message: 'Cancelled by user' });
}
}