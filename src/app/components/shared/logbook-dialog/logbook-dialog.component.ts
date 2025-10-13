import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Required for [(ngModel)]
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

// Import Angular Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../services/auth.service';

// Define interfaces for LogSheet and Activity
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { UpdateDialogComponent } from '../../shared/update-dialog/update-dialog.component';
import { LogbookService } from '../../../services/logbook/logbook.service';
import { SignDialogComponent } from '../../admin/sign-dialog/sign-dialog.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import {
  MatCheckboxChange,
  MatCheckboxModule,
} from '@angular/material/checkbox';

interface LogSheet {
  id: number;
  log_date: string;
  student_number: string;
  ehp_hi_number?: string;
  student_signature?: string | null;
  supervisor_signature?: string | null;
  situation_description?: string;
  situation_evaluation?: string;
  situation_interpretation?: string;
  description?: string;
  activities?: Activity[]; // New format
  // Old format properties (optional)
  activity1?: string;
  hours1?: number;
  activity2?: string;
  hours2?: number;
  // ... up to activity14/hours14
  [key: string]: any; // For any additional dynamic properties
}

interface Activity {
  name: string;
  hours: number;
}

interface StudentInfo {
  fullName: string;
  student_number: string;
}

interface DialogData {
  studentNumber: string;
}

@Component({
  selector: 'app-logbook-dialog',
  templateUrl: './logbook-dialog.component.html',
  styleUrls: ['./logbook-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatOptionModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatPaginatorModule,
    MatCheckboxModule,
  ],
})
export class LogbookDialogComponent implements OnInit {
  onLogsheetChecked(arg0: any, arg1: boolean) {
    throw new Error('Method not implemented.');
  }
  studentNumber!: string;
  studentName: string = '';
  viewlogSheets: LogSheet[] = [];
  filteredLogSheets: LogSheet[] = [];
  totalHoursWorked: number = 0;
  totalDaysWorked: number = 0;
  totalDaysLeft: number = 180;

  isLoading: boolean = true;
  currentLogsheetId: any;
  isSigning: boolean = false;
  signed: any;
  log: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { studentNumber: string },
    private dialogRef: MatDialogRef<LogbookDialogComponent>,
    private logbookService: LogbookService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // ✅ Get student number from dialog data
    this.studentNumber = this.data.studentNumber;

    if (this.studentNumber) {
      this.loadStudentInfo();
      this.fetchLogSheets(this.studentNumber);
    } else {
      console.error('No student number provided via dialog data');
      this.isLoading = false;
    }
  }

  async fetchLogSheets(studentNumber: string): Promise<void> {
    this.isLoading = true;
    try {
      const response = await lastValueFrom(
        this.http.get<{ exists: boolean; logsheets: LogSheet[] }>(
          // `http://localhost:8080/api/get-logsheet/${studentNumber}`
          `http://localhost:8080/api/get-logsheet/${studentNumber}`
        )
      );

      console.log('Full API response:', response);

      this.viewlogSheets = response.logsheets || [];
      console.log('Processed logsheets:', this.viewlogSheets);

      this.filteredLogSheets = [...this.viewlogSheets];
      this.calculateTotals();
    } catch (error) {
      console.error('Error fetching logsheets:', error);
      this.showError('Failed to load logsheets');
    } finally {
      this.isLoading = false;
    }
  }

  getActivities(log: LogSheet): Activity[] {
    // If the log has the new format with activities array, use that
    if (log.activities && Array.isArray(log.activities)) {
      return log.activities.map((activity) => ({
        name: activity.name,
        hours: Number(activity.hours) || 0,
      }));
    }

    // Fallback to old format (activity1, hours1, etc.)
    const activities: Activity[] = [];
    for (let i = 1; i <= 14; i++) {
      const activityName = log[`activity${i}`];
      const activityHours = log[`hours${i}`];

      if (activityName && !isNaN(Number(activityHours))) {
        activities.push({
          name: String(activityName),
          hours: Number(activityHours),
        });
      }
    }
    return activities;
  }

  calculateTotals(): void {
    const uniqueDates = new Set<string>();
    this.totalHoursWorked = 0;

    for (const log of this.viewlogSheets) {
      const date = new Date(log.log_date).toISOString().split('T')[0];
      uniqueDates.add(date);

      const activities = this.getActivities(log);
      for (const activity of activities) {
        this.totalHoursWorked += activity.hours;
      }
    }

    this.totalDaysWorked = uniqueDates.size;
    this.totalDaysLeft = Math.max(0, 180 - this.totalDaysWorked);
  }

  getProgressColorClass(): string {
    if (this.totalDaysWorked === 0) return 'bg-secondary'; // No days worked yet

    const progressRatio = this.totalDaysLeft / this.totalDaysWorked;

    if (progressRatio > 0.6) {
      return 'bg-danger'; // Red
    } else if (progressRatio > 0.5) {
      return 'bg-warning'; // Orange
    } else if (progressRatio < 0.3) {
      return 'bg-success'; // Green
    }

    return 'bg-info'; // Default blue
  }

  getSignatureUrl(signatureUrl: string | null): string {
    return signatureUrl ? `http://localhost:8080/uploads/${signatureUrl}` : '';
  }

  private buildFormData(data: any): FormData {
    if (!data.id) {
      throw new Error('Missing logsheet ID');
    }
    const formData = new FormData();

    const id = data.id || this.currentLogsheetId;
    if (!id) {
      throw new Error('Missing logsheet ID');
    }
    formData.set('id', id.toString());

    formData.set('logDate', data.logDate || data.log_date || '');
    formData.set(
      'studentNumber',
      data.studentNumber || data.student_number || ''
    );
    formData.set('description', data.description || '');
    formData.set(
      'situationDescription',
      data.situationDescription || data.situation_description || ''
    );
    formData.set(
      'situationEvaluation',
      data.situationEvaluation || data.situation_evaluation || ''
    );
    formData.set(
      'situationInterpretation',
      data.situationInterpretation || data.situation_interpretation || ''
    );
    formData.set('dateStamp', data.dateStamp || data.date_stamp || '');

    if (data.student_signature instanceof File) {
      formData.append('student_signature', data.student_signature);
    }
    if (data.supervisor_signature instanceof File) {
      formData.append('supervisor_signature', data.supervisor_signature);
    }

    if (data.activities && Array.isArray(data.activities)) {
      data.activities.forEach((activity: any, index: number) => {
        formData.append(`activity${index + 1}`, activity.name);
        formData.append(`hours${index + 1}`, activity.hours.toString());
      });
    }

    if (data.ehp_hi_number) {
      formData.set('ehp_hi_number', data.ehp_hi_number);
    }

    return formData;
  }

  async deleteLogSheet(id: number): Promise<void> {
    const confirmed = await this.showConfirmationDialog(
      'Are you sure you want to delete this logsheet?'
    );
    if (!confirmed) return;

    try {
      const response = await lastValueFrom(this.authService.deleteLogSheet(id));
      if (response.status === 200) {
        this.showSuccess('Logsheet deleted successfully');
        this.viewlogSheets = this.viewlogSheets.filter((log) => log.id !== id);
        this.applyFilters();
      }
    } catch (error) {
      console.error('Delete error:', error);
      this.showError('Failed to delete logsheet');
    }
  }

  applyFilters(): void {
    this.filteredLogSheets = [...this.viewlogSheets];
    this.calculateTotals();
  }

  async updateLogSheet(
    id: number,
    updatedData: Partial<LogSheet>
  ): Promise<void> {
    console.log('Update Row ID:', this.currentLogsheetId);
    try {
      const formData = this.buildFormData(updatedData);
      await lastValueFrom(this.authService.updateLogsheet(id, formData));
      this.showSuccess('Logsheet updated successfully');
      await this.fetchLogSheets(this.studentNumber);
    } catch (error) {
      console.error('Update error:', error);
      this.showError('Failed to update logsheet');
    }
  }

  async signLogSheet(
    logsheetId: number,
    signatureData: Partial<LogSheet>
  ): Promise<void> {
    this.isSigning = true;
    try {
      this.currentLogsheetId = logsheetId;
      const formData = this.buildFormData({
        ...signatureData,
        id: logsheetId, // Ensure ID is included
      });

      console.log('FormData being sent:', formData); // Debug log

      const response = await lastValueFrom(
        this.authService.signLogsheet(logsheetId, formData)
      );

      this.showSuccess('Logsheet signed successfully');
      await this.fetchLogSheets(this.studentNumber);
    } catch (error) {
      console.error('Sign error:', error);
      this.showError('Failed to sign logsheet. Please try again.');
    } finally {
      this.isSigning = false;
      this.currentLogsheetId = null;
    }
  }

  openUpdateDialog(log: LogSheet): void {
    const dialogRef = this.dialog.open(UpdateDialogComponent, {
      width: '600px',
      data: { log },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.updateLogSheet(log.id, result);
    });
  }

  openSignDialog(log: LogSheet): void {
    console.log('Opening sign dialog for logsheet:', log);
    if (!log?.id) {
      console.error('No logsheet ID found in:', log);
      this.showError('Cannot sign - missing logsheet ID');
      return;
    }

    const dialogRef = this.dialog.open(SignDialogComponent, {
      width: '600px',
      data: {
        log,
        studentNumber: this.studentNumber,
        studentName: this.studentName,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('Dialog closed with result:', result);
      if (result) {
        console.log('Attempting to sign logsheet ID:', log.id);
        this.signLogSheet(log.id, result);
      }
    });
  }

  private async showConfirmationDialog(message: string): Promise<boolean> {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: { message },
    });

    const result = await lastValueFrom(dialogRef.afterClosed());
    return !!result;
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar'],
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar'],
    });
  }

  async loadStudentInfo(): Promise<void> {
    try {
      const res = await lastValueFrom(
        this.http.get<StudentInfo>(
          `http://localhost:8080/api/student/${this.studentNumber}`
        )
      );
      this.studentName = res.fullName;
    } catch (error) {
      console.error('Failed to load student info:', error);
    }
  }

async onCheckboxChange(event: MatCheckboxChange): Promise<void> {
  const studentNumber = this.studentNumber;

  if (!studentNumber) {
    console.error('Student number is not available in component');
    this.showError('Student number is missing - cannot update verification');
    event.source.checked = false;
    return;
  }

  if (event.checked) {
    const confirmed = confirm(
      `Click OK to confirm that you have reviewed and approved ${this.studentName}'s work as an HPCSA officer.`
    );

    if (!confirmed) {
      event.source.checked = false;
      return;
    }
  }


    try {
      // ✅ API call also uses this.studentNumber
      await lastValueFrom(
        this.http.post(
          `http://localhost:8080/api/update-hpcsa-report/${studentNumber}`,
          {}
        )
      );
      
      this.showSuccess(
        `Successfully ${
          event.checked ? 'verified' : 'unverified'
        } activities for student  ${this.studentName}`
      );
      // Refresh the page after confirmation
      window.location.reload();
      this.closeDialog();
      // Automatically refresh data
    } catch (error) {
      console.error('Error updating verification status:', error);
      event.source.checked = !event.checked; // Revert checkbox on error
      this.showError(
        `Failed to update verification status for student ${this.studentName}`
      );
    }
  }

  private async updateVerificationStatus(
    logsheetId: number,
    verified: boolean
  ): Promise<void> {
    const response = await lastValueFrom(
      this.http.patch(
        `http://localhost:8080/api/logsheets/${logsheetId}/verify`,
        { verified }
      )
    );
    console.log('Verification update response:', response);
  }
  closeDialog(): void {
    this.dialogRef.close();
  }
}
