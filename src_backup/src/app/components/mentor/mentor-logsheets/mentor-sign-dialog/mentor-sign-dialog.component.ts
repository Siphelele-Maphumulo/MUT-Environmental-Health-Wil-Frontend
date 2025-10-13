import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-mentor-sign-dialog',
  standalone: true,
  imports: [MatDialogModule, MatIconModule, MatButtonModule],
  templateUrl: './mentor-sign-dialog.component.html',
  styles: [`
    .dialog-title {
      display: flex;
      align-items: center;
      color: #3f51b5;
      font-weight: 600;
      padding: 16px 24px;
      margin: 0;
      border-bottom: 1px solid #f0f0f0;
      
      .title-icon {
        margin-right: 12px;
        color: #3f51b5;
      }
    }

    .dialog-content {
      padding: 24px;
      
      .confirmation-message {
        display: flex;
        align-items: center;
        font-size: 16px;
        color: #555;
        
        .message-icon {
          margin-right: 12px;
          color: #ff9800;
          font-size: 28px;
        }
        
        .checked-text {
          color: #4caf50;
          font-weight: 600;
        }
      }
    }

    .dialog-actions {
      padding: 12px 24px;
      border-top: 1px solid #f0f0f0;
      justify-content: flex-end;
      gap: 8px;
      
      .action-button {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 500;
        transition: all 0.2s ease;
        
        &:hover {
          transform: translateY(-1px);
        }
        
        mat-icon {
          font-size: 18px;
        }
      }
      
      .confirm-button {
        background-color: #4caf50;
        color: white;
        
        &:hover {
          background-color: #3d8b40;
        }
      }
      
      .uncheck-button {
        background-color: #f44336;
        color: white;
        
        &:hover {
          background-color: #d32f2f;
        }
      }
    }
  `]
})
export class MentorSignDialogComponent {
  constructor(private dialogRef: MatDialogRef<MentorSignDialogComponent>) {}

  confirm(status: boolean) {
    const value = status ? 'checked' : 'unChecked';
    this.dialogRef.close(value);
  }
}