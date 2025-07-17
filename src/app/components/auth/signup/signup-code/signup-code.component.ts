import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms'; // Import FormsModule

@Component({
  selector: 'app-signup-code',
  template: `
    <div
      style="width: 100%; height:180%; text-align: center; padding: 0 10px 10px;"
    >
      <h1 mat-dialog-title>Enter Signup Code</h1>
      <div mat-dialog-content>
        <mat-form-field appearance="fill" style="width: 100%; height:150%">
          <mat-label>Pin Code</mat-label>
          <input matInput [(ngModel)]="pinCode" type="password" />
        </mat-form-field>
      </div>
      <div mat-dialog-actions style="gap: 20px;">
        <button
          mat-button
          style="background-color:rgba(247, 144, 144, 0.39)"
          (click)="onCancel()"
        >
          Cancel
        </button>
        <button
          mat-button
          style="background-color:rgba(152, 219, 180, 0.4)"
          (click)="onSubmit()"
        >
          Submit
        </button>
      </div>
    </div>
  `,
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule],
})
export class SignupCodeComponent {
  pinCode: string = '';

  constructor(private dialogRef: MatDialogRef<SignupCodeComponent>) {}

  onCancel(): void {
    this.dialogRef.close(); // Don't pass any value
  }

  onSubmit(): void {
    console.log('Pin Code:', this.pinCode);
    this.dialogRef.close(this.pinCode); // Only submit if user clicks Submit
  }
}
