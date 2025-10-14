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
import { SignDialogComponent } from '../../admin/sign-dialog/sign-dialog.component';
import { MentorSignDialogComponent } from './mentor-sign-dialog/mentor-sign-dialog.component';
// import { CodeService } from '../applications/code.service';

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
  mentor_check: string | null;
  EHP_HI_Number: string;
  date_stamp: string;
  created_at: string;
  activities: Activity[];
  [key: string]: any;
}

@Component({
  selector: 'app-viewlogsheets',
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
  templateUrl: './mentor-logsheets.component.html',
  styleUrls: ['./mentor-logsheets.component.scss'],
})
export class MentorLogsheetsComponent implements OnInit {
  viewlogSheets: LogSheet[] = [];
  filteredLogSheets: LogSheet[] = [];
  isLoading = true;

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
    'mentor_check',
    'EHP_HI_Number',
    'dateStamp',
    'actions',
  ];

  // Filter controls
  searchControl = new FormControl('');
  signatureFilterControl = new FormControl('all');
  dateStampControl = new FormControl<Date | null>(null);
  ehpFilterControl = new FormControl('');
  studentNumberControl = new FormControl(''); // New student number filter
  logDateControl = new FormControl<Date | null>(null);
  userEmail: string | null = null;

  constructor(
    private http: HttpClient,
    private location: Location,
    private router: Router,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer,
    private snackBar: MatSnackBar,
    // private codeService: CodeService, // Add this line
    private authService: AuthService, // Inject your AuthService here
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/staff-login']); // Redirect to login if not authenticated
    } else {
      // Get the logged-in user's email
      this.userEmail = this.authService.getUserEmail();
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

    this.fetchLogSheets();
    this.setupFilterListeners();
  }

  // Add this method to handle filter changes
  // Update the setupFilterListeners (remove signature filter from automatic updates)
  setupFilterListeners(): void {
    // Student number filter
    this.studentNumberControl.valueChanges
      .pipe(debounceTime(300))
      .subscribe(() => this.applyFilters());

    // Date stamp filter
    this.dateStampControl.valueChanges.subscribe(() => this.applyFilters());

    // EHP Number filter
    this.ehpFilterControl.valueChanges
      .pipe(debounceTime(300))
      .subscribe(() => this.applyFilters());

    // Log Date filter
    this.logDateControl.valueChanges.subscribe(() => this.applyFilters());

    // Remove the signatureFilterControl from automatic updates
    // It will now only apply when manually changed
  }

  // Modify applyFilters to handle automatic filtering
  applyFilters(): void {
    this.filteredLogSheets = this.viewlogSheets.filter((log) => {
      const matchesStudentNumber = this.checkStudentNumberFilter(
        log.student_number
      );
      const matchesDateStamp = this.checkDateStamp(log.date_stamp);
      const matchesEHP = this.checkEHPFilter(log.EHP_HI_Number);
      const matchesLogDate = this.checkLogDate(log.log_date);

      // Only apply signature filter if it's not 'all'
      const signatureFilter = this.signatureFilterControl.value;
      const matchesSignature =
        signatureFilter === 'all'
          ? true
          : signatureFilter === 'signed'
          ? !!log.supervisor_signature
          : !log.supervisor_signature;

      return (
        matchesStudentNumber &&
        matchesDateStamp &&
        matchesEHP &&
        matchesLogDate &&
        matchesSignature
      );
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

  // New dedicated student number filter
  private checkStudentNumberFilter(studentNumber: string): boolean {
    const studentNumberFilter =
      this.studentNumberControl.value?.toLowerCase() || '';
    if (!studentNumberFilter) return true;
    return studentNumber.toLowerCase().includes(studentNumberFilter);
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

  private checkEHPFilter(ehpNumber: string): boolean {
    const filterValue = this.ehpFilterControl.value?.toLowerCase() || '';
    if (!filterValue) return true;
    return ehpNumber?.toLowerCase().includes(filterValue);
  }

  clearFilters(): void {
    this.searchControl.reset('');
    this.studentNumberControl.reset('');
    this.signatureFilterControl.setValue('all');
    this.dateStampControl.reset(null);
    this.ehpFilterControl.reset('');
    this.logDateControl.reset(null); // Add this line
  }

  async fetchLogSheets(): Promise<void> {
    this.isLoading = true;
    try {
      const response = await lastValueFrom(
        this.http.get<LogSheet[]>('http://localhost:8080/api/daily-logsheets')
        //this.http.get<LogSheet[]>('http://localhost:8080/api/daily-logsheets')
      );
      this.viewlogSheets = response.map((log) => ({
        ...log,
        activities: this.getActivities(log),
      }));
      this.filteredLogSheets = [...this.viewlogSheets];
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

getSignatureUrl(filename: string | null): string {
  if (!filename) return '';

  let fullUrl: string;
  const baseUrl = 'http://localhost:8080';
  
  // Normalize the filename
  const normalizedFilename = filename.trim().replace(/\\/g, '/');

  // console.log(`[Viewlogsheets] Processing filename: "${filename}"`);

  // Handle different URL formats
  if (normalizedFilename.startsWith('http://') || normalizedFilename.startsWith('https://')) {
    // Already a full URL - use as is
    fullUrl = normalizedFilename;
  } 
  else if (normalizedFilename.includes('uploads/signatures/')) {
    // If it already contains the full path structure, just add base URL
    if (normalizedFilename.startsWith('/')) {
      fullUrl = `${baseUrl}${normalizedFilename}`;
    } else {
      fullUrl = `${baseUrl}/${normalizedFilename}`;
    }
  }
  else if (normalizedFilename.startsWith('uploads/')) {
    // Path starting with uploads/ - check if it's already the signatures path
    if (normalizedFilename.startsWith('uploads/signatures/')) {
      fullUrl = `${baseUrl}/${normalizedFilename}`;
    } else {
      // It's just "uploads/filename" - redirect to signatures folder
      const justFilename = normalizedFilename.replace('uploads/', '');
      fullUrl = `${baseUrl}/uploads/signatures/${justFilename}`;
    }
  } 
  else if (normalizedFilename.startsWith('/uploads/')) {
    // Path starting with /uploads/ - check if it's already the signatures path
    if (normalizedFilename.startsWith('/uploads/signatures/')) {
      fullUrl = `${baseUrl}${normalizedFilename}`;
    } else {
      // It's just "/uploads/filename" - redirect to signatures folder
      const justFilename = normalizedFilename.replace('/uploads/', '');
      fullUrl = `${baseUrl}/uploads/signatures/${justFilename}`;
    }
  } 
  else {
    // Just a filename without any path - add the full signatures path
    fullUrl = `${baseUrl}/uploads/signatures/${normalizedFilename}`;
  }

  // Fix any double path issues
  fullUrl = fullUrl
    .replace('/uploads/signatures/uploads/signatures/', '/uploads/signatures/')
    .replace('/uploads/uploads/signatures/', '/uploads/signatures/')
    .replace('//uploads/', '/uploads/')
    .replace(/\/\//g, '/') // Replace double slashes with single
    .replace(':/', '://'); // Fix protocol

  // console.log(`[Viewlogsheets] Signature URL:`, {
  //   original: filename,
  //   normalized: normalizedFilename,
  //   final: fullUrl
  // });

  return fullUrl;
}

  onImageError(event: Event, logId: number): void {
    const img = event.target as HTMLImageElement;
    console.warn(`[Viewlogsheets] Image load failed for log ${logId}:`, img.src);
    
    // Optionally show a placeholder or hide the image
    img.style.display = 'none';
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


  async updateLogSheet(
    id: number,
    updatedData: Partial<LogSheet>
  ): Promise<void> {
    try {
      const formData = this.buildFormData(updatedData);
      await lastValueFrom(this.authService.updateLogsheet(id, formData));
      this.showSuccess('Logsheet updated successfully');
      await this.fetchLogSheets();
    } catch (error) {
      console.error('Update error:', JSON.stringify(error, null, 2));
      this.showError('Failed to update logsheet');
    }
  }

  async signLogSheet(
    id: number,
    signatureData: Partial<LogSheet>
  ): Promise<void> {
    try {
      const formData = this.buildFormData(signatureData);
      await lastValueFrom(this.authService.updateLogsheet(id, formData));
      this.showSuccess('Logsheet signed successfully');
      await this.fetchLogSheets();
    } catch (error) {
      console.error('Sign error:', JSON.stringify(error, null, 2));
      this.showError('Failed to sign logsheet');
    }
  }

  openUpdateDialog(log: LogSheet): void {
    const dialogRef = this.dialog.open(UpdateDialogComponent, {
      width: '500px',
      data: { log },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.updateLogSheet(log.id, result);
    });
  }

openSignDialog(log: any): void {
  const dialogRef = this.dialog.open(MentorSignDialogComponent);

  dialogRef.afterClosed().subscribe((result: string) => {
    if (result === 'checked' || result === 'unChecked') {
      const url = `${this.authService.getApiUrl()}/update-mentor-check`;
      const body = {
        logsheetId: log.id,
        mentor_check: result,
      };

      const headers = this.authService.getAuthHeaders();

      this.http.post(url, body, { headers }).subscribe({
        next: (response: any) => {
          const msg = response?.message || 'Mentor check updated';
          this.showSuccess(msg);
          // Refresh the table
          this.fetchLogSheets();
        },
        error: (err) => {
          console.error('Error updating mentor check:', err);
          const errMsg = err?.error?.message || 'Error updating mentor check';
          this.showError(errMsg);
        },
      });
    }
  });
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
