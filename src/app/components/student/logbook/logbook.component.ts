import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Location } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { lastValueFrom, firstValueFrom } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { UpdateDialogComponent } from '../../shared/update-dialog/update-dialog.component';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  MatDatepickerInputEvent,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { DomSanitizer } from '@angular/platform-browser';

interface Activity {
  name: string;
  hours: number;
}

interface LogSheet {
  id: number;
  log_date: string;
  student_number: string;
  description: string;
  situation_description: string;
  situation_evaluation: string;
  situation_interpretation: string;
  student_signature: string | null;
  supervisor_signature: string | null;
  EHP_HI_Number: string;
  date_stamp: string;
  created_at: string;
  activities: Activity[];
  [key: string]: any;
}

@Component({
  selector: 'app-logbook',
  templateUrl: './logbook.component.html',
  styleUrls: ['./logbook.component.scss'],
  standalone: true,
  imports: [
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    RouterModule,
    ReactiveFormsModule,
    MatOptionModule,
    MatSelectModule,
  ],
})
export class LogbookComponent implements OnInit {
  totalHoursWorked: number = 0;
  totalDaysWorked: number = 0;

  viewlogSheets: LogSheet[] = [];
  filteredLogSheets: LogSheet[] = [];
  isLoading = true;
  studentNumber: string | null = null;

  displayedColumns: string[] = [
    'studentNumber',
    'date',
    'activities',
    'description',
    'situationDescription',
    'situationEvaluation',
    'situationInterpretation',
    'student_signature',
    'supervisor_signature',
    'EHP_HI_Number',
    'dateStamp',
    // 'actions',
  ];

  // Filter controls
  searchControl = new FormControl('');
  signatureFilterControl = new FormControl('all');
  dateStampControl = new FormControl<Date | null>(null);
  logDateControl = new FormControl<Date | null>(null);
  userEmail: string | null = null;

  constructor(
    private http: HttpClient,
    private location: Location,
    private router: Router,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer,
    private snackBar: MatSnackBar,
    private authService: AuthService, // Inject your AuthService here
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
    } else {
      this.userEmail = this.authService.getUserEmail();
      // Set the studentNumber property
      this.studentNumber = this.extractStudentNumber(this.userEmail);

      if (this.studentNumber) {
        this.fetchLogSheets(this.studentNumber);
      } else {
        this.showError('Could not determine student number from email');
      }
    }

    // Scroll to the top of the page when the component initializes (browser-only)
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' }); // Smooth scrolling
    }

    // Handle scroll restoration for navigation events
    this.router.events.subscribe((event) => {
      if (
        event instanceof NavigationEnd &&
        isPlatformBrowser(this.platformId)
      ) {
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Smooth scrolling
      }
    });

    this.setupFilterListeners();
  }

  calculateTotals(): void {
    // Set of unique log dates
    const uniqueDates = new Set<string>();

    // Reset totals
    this.totalHoursWorked = 0;
    this.totalDaysWorked = 0;

    for (const log of this.viewlogSheets) {
      uniqueDates.add(log.log_date);

      for (const activity of log.activities) {
        if (activity && typeof activity.hours === 'number') {
          this.totalHoursWorked += activity.hours;
        }
      }
    }

    this.totalDaysWorked = uniqueDates.size;
  }

  // Add this method to handle filter changes
  // Update the setupFilterListeners (remove signature filter from automatic updates)
  setupFilterListeners(): void {
    // Date stamp filter
    this.dateStampControl.valueChanges.subscribe(() => this.applyFilters());

    // Log Date filter
    this.logDateControl.valueChanges.subscribe(() => this.applyFilters());

    // Remove the signatureFilterControl from automatic updates
    // It will now only apply when manually changed
  }

  // Modify applyFilters to handle automatic filtering
  applyFilters(): void {
    this.filteredLogSheets = this.viewlogSheets.filter((log) => {
      const matchesDateStamp = this.checkDateStamp(log.date_stamp);
      const matchesLogDate = this.checkLogDate(log.log_date);

      // Only apply signature filter if it's not 'all'
      const signatureFilter = this.signatureFilterControl.value;
      const matchesSignature =
        signatureFilter === 'all'
          ? true
          : signatureFilter === 'signed'
          ? !!log.supervisor_signature
          : !log.supervisor_signature;

      return matchesDateStamp && matchesLogDate && matchesSignature;
    });
  }

  //Add this new filter method
  private checkLogDate(logDate: string): boolean {
    if (!this.logDateControl.value) return true;
    return (
      new Date(logDate).toDateString() ===
      new Date(this.logDateControl.value).toDateString()
    );
  }

  // Existing general search filter (keeps searching EHP and description)
  private checkSearchFilter(log: LogSheet): boolean {
    const searchTerm = this.searchControl.value?.toLowerCase() || '';
    if (!searchTerm) return true;
    return (
      (log.EHP_HI_Number &&
        log.EHP_HI_Number.toLowerCase().includes(searchTerm)) ||
      log.description.toLowerCase().includes(searchTerm)
    );
  }

  // Rest of your existing filter methods remain exactly the same:
  private checkSignatureStatus(signature: string | null): boolean {
    const filter = this.signatureFilterControl.value;
    if (filter === 'all') return true;
    if (filter === 'signed') return !!signature;
    if (filter === 'unsigned') return !signature;
    return true;
  }

  private checkDateStamp(dateStamp: string): boolean {
    if (!this.dateStampControl.value || !dateStamp) return true;
    return (
      new Date(dateStamp).toDateString() ===
      new Date(this.dateStampControl.value).toDateString()
    );
  }

  clearFilters(): void {
    this.searchControl.reset('');
    this.signatureFilterControl.setValue('all');
    this.dateStampControl.reset(null);
    this.logDateControl.reset(null); // Add this line
  }

  // Add this new method to extract student number from email
  private extractStudentNumber(email: string | null): string | null {
    if (!email) return null;
    const match = email.match(/^(\d+)/); // Match digits at start of email
    return match ? match[1] : null;
  }

  // Modify fetchLogSheets to accept studentNumber parameter
  async fetchLogSheets(studentNumber: string): Promise<void> {
    this.isLoading = true;
    try {
      const response = await lastValueFrom(
        this.http.get<LogSheet[]>(
          `https://mut-environmental-health-wil-backend.onrender.com /api/logbook?student_number=${studentNumber}`
        )
      );
      this.viewlogSheets = response.map((log) => ({
        ...log,
        activities: this.getActivities(log),
      }));
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
    const activities: Activity[] = [];
    for (let i = 1; i <= 14; i++) {
      const activityKey = `activity${i}`;
      const hoursKey = `hours${i}`;
      if (log[activityKey]) {
        activities.push({
          name: log[activityKey],
          hours: log[hoursKey] || 0,
        });
      }
    }
    return activities;
  }

  getSignatureUrl(signatureUrl: string | null): string {
    return signatureUrl || '';
  }

  private buildFormData(data: any): FormData {
    const formData = new FormData();

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

  private async showConfirmationDialog(message: string): Promise<boolean> {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: { message },
    });
    const result = await firstValueFrom(dialogRef.afterClosed());
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

  navigateToSignLogSheets(logsheetId: number): void {
    this.router.navigate(['/sign-logsheets', logsheetId]);
  }

  goBack(): void {
    this.location.back();
  }
}
