import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update-dialog',
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
      <h2 class="dialog-title">Update Today's Logsheet</h2>
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="update-form">
        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Description</mat-label>
          <input matInput formControlName="description" />
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Situation Description</mat-label>
          <input matInput formControlName="situation_description" />
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Situation Evaluation</mat-label>
          <input matInput formControlName="situation_evaluation" />
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Situation Interpretation</mat-label>
          <input matInput formControlName="situation_interpretation" />
        </mat-form-field>

        <div class="button-group">
          <button mat-button type="button" (click)="onCancel()">Cancel</button>
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
        background-color: rgb(191, 191, 191); /* A slightly darker grey */
        color: white; /* Text color */
        border: none; /* No border */
        border-radius: 8px; /* Adjust the value for roundness */
        padding: 10px 20px; /* Adjust for desired padding */
        font-size: 16px; /* Font size */
        cursor: pointer; /* Cursor change on hover */
        transition: background-color 0.3s ease; /* Smooth background change on hover */
      }

      button[mat-flat-cbutton] {
        background-color: rgb(191, 191, 191); /* A slightly darker grey */
        color: white; /* Text color */
        border: none; /* No border */
        border-radius: 4px; /* Adjust the value for roundness */
        padding: 5px 20px; /* Adjust for desired padding */
        font-size: 16px; /* Font size */
        cursor: pointer; /* Cursor change on hover */
        transition: background-color 0.3s ease; /* Smooth background change on hover */
      }

      button[mat-flat-button]:hover {
        background-color: rgb(37, 163, 79);
      }

      button[mat-flat-cbutton]:hover {
        background-color: rgb(163, 41, 37);
      }
    `,
  ],
})
export class UpdateDialogComponent {
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<UpdateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { log: any },
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      description: [data.log.description],
      situation_description: [data.log.situation_description],
      situation_evaluation: [data.log.situation_evaluation],
      situation_interpretation: [data.log.situation_interpretation],
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value); // Pass updated values back
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
