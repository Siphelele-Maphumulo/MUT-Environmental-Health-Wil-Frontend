import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-user-type-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule, MatIconModule],
  template: `
    <div class="dialog-container">
      <h2 mat-dialog-title class="dialog-title">User Management</h2>

      <mat-dialog-content class="dialog-content">
        <p class="lead">Select user type to manage</p>
        <div class="options-container">
          <button mat-raised-button class="option-button staff-btn"
                  (click)="selectUserType('staff')" aria-label="Manage Staff">
            <mat-icon class="mr-2">supervisor_account</mat-icon>
            Staff
          </button>
          <button mat-raised-button class="option-button student-btn"
                  (click)="selectUserType('students')" aria-label="Manage Students">
            <mat-icon class="mr-2">school</mat-icon>
            Students
          </button>
        </div>
      </mat-dialog-content>

      <mat-dialog-actions align="end" class="dialog-actions">
        <button mat-raised-button class="cancel-btn"
                (click)="onNoClick()">
          <mat-icon class="mr-2">cancel</mat-icon>
          Cancel
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
.dialog-container {
  background-color: #fafafa;
  padding: 20px;
  width: 100%;
  max-width: 500px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  animation: fadeIn 0.3s ease-out;
}

.dialog-title {
  margin-bottom: 20px;
  color: #3f51b5;
  font-weight: 600;
  text-align: center;
}

.dialog-content {
  padding: 20px 0;
}

.lead {
  color: #555;
  margin-bottom: 25px;
  text-align: center;
}

.options-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.option-button {
  padding: 12px;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s ease;
  color: #fff;
}

.staff-btn {
  background-color:rgb(139, 190, 241); /* Blue */
}

.staff-btn:hover {
  background-color: #1565c0;
}

.student-btn {
  background-color:rgb(154, 240, 158); /* Green */
}

.student-btn:hover {
  background-color: #1b5e20;
}

.cancel-btn {
  background-color:rgb(238, 125, 125) !important; /* Red */
}

.cancel-btn:hover {
  background-color: #b71c1c !important;
}

.dialog-actions {
  border-top: 1px solid #eee;
  padding-top: 15px;
}

.mr-2 {
  margin-right: 8px;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

  `]
})
export class UserTypeDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<UserTypeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  selectUserType(type: string): void {
    this.dialogRef.close(type);
  }
}
