// QUICK FIX FOR logbook.component.ts
// Copy this entire file content and replace your logbook.component.ts

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
import { lastValueFrom } from 'rxjs';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { UpdateDialogComponent } from '../../shared/update-dialog/update-dialog.component';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { DomSanitizer } from '@angular/platform-browser';
import { FileUrlService } from '../../../services/file-url.service';

interface Activity {
  name: string;
  hours: number;
}

interface LogSheet {
  id: number | string;
  log_date: string | Date | null;
  student_number: string;
  description: string;
  situation_description: string;
  situation_evaluation: string;
  situation_interpretation: string;
  student_signature: string | null;
  supervisor_signature: string | null;
  EHP_HI_Number: string;
  date_stamp: string | Date | null;
  created_at: string | Date;
  updatedAt?: string | Date | { $date: { $numberLong: string } };
  activities: Activity[];
  safeStudentSignature?: any;
  safeSupervisorSignature?: any;
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
  ];

  // Filter controls
  searchControl = new FormControl('');
  signatureFilterControl = new FormControl('all');
  logDateControl = new FormControl<Date | null>(null);
  dateStampControl = new FormControl<Date | null>(null);
  userEmail: string | null = null;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private location: Location,
    private authService: AuthService,
    public dialog: MatDialog,
    private sanitizer: DomSanitizer,
    private fileUrlService: FileUrlService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    // Authentication check
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    // Get user email and extract student number
    this.userEmail = this.authService.getUserEmail();
    this.studentNumber = this.extractStudentNumber(this.userEmail);

    if (this.studentNumber) {
      this.fetchLogSheets(this.studentNumber);
    } else {
      this.showError('Could not determine student number from email');
    }

    // Scroll to top (browser only)
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Handle navigation events
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd && isPlatformBrowser(this.platformId)) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });

    // Setup filter listeners
    this.setupFilterListeners();
  }

  calculateTotals(): void {
    const uniqueDates = new Set<string>();
    this.totalHoursWorked = 0;
    this.totalDaysWorked = 0;

    for (const log of this.viewlogSheets) {
      // Handle different date formats
      if (log.log_date) {
        let dateStr = '';
        if (log.log_date instanceof Date) {
          dateStr = log.log_date.toISOString().split('T')[0];
        } else if (typeof log.log_date === 'string') {
          dateStr = log.log_date.split('T')[0];
        }
        if (dateStr) {
          uniqueDates.add(dateStr);
        }
      }
      
      // Calculate total hours from activities
      for (const activity of log.activities) {
        if (activity && typeof activity.hours === 'number') {
          this.totalHoursWorked += activity.hours;
        }
      }
    }

    this.totalDaysWorked = uniqueDates.size;
  }

  setupFilterListeners(): void {
    this.dateStampControl.valueChanges.subscribe(() => this.applyFilters());
    this.logDateControl.valueChanges.subscribe(() => this.applyFilters());
    this.signatureFilterControl.valueChanges.subscribe(() => this.applyFilters());
  }

  applyFilters(): void {
    this.filteredLogSheets = this.viewlogSheets.filter((log) => {
      const matchesDateStamp = this.checkDateStamp(log.date_stamp);
      const matchesLogDate = this.checkLogDate(log.log_date);

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

  private checkLogDate(logDate: string | Date | null): boolean {
    if (!this.logDateControl.value) return true;
    if (!logDate) return false;
    
    const logDateObj = logDate instanceof Date ? logDate : new Date(logDate);
    const controlDate = this.logDateControl.value instanceof Date 
      ? this.logDateControl.value 
      : new Date(this.logDateControl.value);
      
    return logDateObj.toDateString() === controlDate.toDateString();
  }

  private checkDateStamp(dateStamp: string | Date | null): boolean {
    if (!this.dateStampControl.value || !dateStamp) return true;
    
    const stampDate = dateStamp instanceof Date ? dateStamp : new Date(dateStamp);
    const controlDate = this.dateStampControl.value instanceof Date 
      ? this.dateStampControl.value 
      : new Date(this.dateStampControl.value);
      
    return stampDate.toDateString() === controlDate.toDateString();
  }

  clearFilters(): void {
    this.searchControl.reset('');
    this.signatureFilterControl.setValue('all');
    this.dateStampControl.reset(null);
    this.logDateControl.reset(null);
  }

  private extractStudentNumber(email: string | null): string | null {
    if (!email) return null;
    const match = email.match(/^(\d+)/);
    return match ? match[1] : null;
  }

  async fetchLogSheets(studentNumber: string): Promise<void> {
    if (!studentNumber) {
      console.error('No student number provided');
      this.showError('Student number is required to fetch logsheets');
      return;
    }
  
    this.isLoading = true;
    this.viewlogSheets = [];
    this.filteredLogSheets = [];
  
    try {
      // Fetch all logsheets
      const response = await lastValueFrom(
        this.http.get<LogSheet[]>('http://localhost:8080/api/daily-logsheets')
      );
  
      console.log('=== LOGBOOK API RESPONSE ===');
      console.log('Raw logbook data from API:', response);
      
      if (!Array.isArray(response)) {
        throw new Error('Invalid response format from server');
      }
  
      // Filter for the specific student
      const studentLogs = response.filter(log => {
        const logStudentNumber = log.student_number?.toString() || '';
        return logStudentNumber === studentNumber.toString();
      });
  
      console.log(`Found ${studentLogs.length} logsheets for student ${studentNumber}`);
  
      // Process the filtered logs
      this.viewlogSheets = studentLogs.map(log => {
        // Convert dates to string format for display
        const formatDateForDisplay = (date: any): string => {
          const parsedDate = this.parseDate(date);
          return parsedDate ? parsedDate.toISOString().split('T')[0] : '';
        };
      
        return {
          ...log,
          id: log.id || `temp-${Date.now()}`,
          student_number: log.student_number?.toString() || studentNumber,
          activities: this.getActivities(log),
          date_stamp: formatDateForDisplay(log.updatedAt || log.date_stamp || log.created_at),
          log_date: formatDateForDisplay(log.log_date),
          created_at: formatDateForDisplay(log.created_at),
          // Pass the current log's student number to getSafeUrl
          safeStudentSignature: this.getSafeUrl(log.student_signature, log.student_number || studentNumber),
          safeSupervisorSignature: this.getSafeUrl(log.supervisor_signature, log.student_number || studentNumber),
        };
      });
  
      this.filteredLogSheets = [...this.viewlogSheets];
      this.calculateTotals();
  
      console.log('\n=== PROCESSING COMPLETE ===');
      console.log(`Successfully processed ${this.viewlogSheets.length} logsheets`);
      console.log('Total hours worked:', this.totalHoursWorked);
      console.log('Total days worked:', this.totalDaysWorked);
  
      if (this.viewlogSheets.length === 0) {
        console.warn('No logsheets found for student:', studentNumber);
        this.showMessage('No logsheets found for your student number');
      }
    } catch (error) {
      console.error('=== ERROR FETCHING LOGSHEETS ===');
      console.error('Error details:', error);
      this.showError('Failed to load logsheets. Please try again later.');
    } finally {
      this.isLoading = false;
    }
  }

  private parseDate(dateValue: any): Date | null {
    if (!dateValue) return null;
    try {
      if (typeof dateValue === 'object' && dateValue?.$date?.$numberLong) {
        return new Date(parseInt(dateValue.$date.$numberLong));
      }
      if (dateValue instanceof Date) {
        return dateValue;
      }
      return new Date(dateValue);
    } catch (e) {
      console.warn('Error parsing date:', dateValue, e);
      return null;
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

  /**
   * Sanitize and return safe URL for displaying signature
   * Backend stores paths as: "uploads/signatures/filename.png"
   * Fixes double "uploads/uploads/" issue from database
   */
/**
 * Sanitize and return safe URL for displaying signature
 * Convert backend URLs from /uploads/signatures/ to /uploads/student_number/
 */
getSafeUrl(filename: string | null, studentNumber?: string): string {
  if (!filename) return '';

  let fullUrl: string;
  const baseUrl = 'http://localhost:8080';
  
  // Normalize the filename
  const normalizedFilename = filename.trim().replace(/\\/g, '/');

  console.log(`[Viewlogsheets] Processing filename: "${filename}"`);

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

  console.log(`[Viewlogsheets] Signature URL:`, {
    original: filename,
    normalized: normalizedFilename,
    final: fullUrl
  });

  return fullUrl;
}

  onImageError(event: Event, logId: number): void {
    const img = event.target as HTMLImageElement;
    console.warn(`[Viewlogsheets] Image load failed for log ${logId}:`, img.src);
    
    // Optionally show a placeholder or hide the image
    img.style.display = 'none';
  }

downloadSignature(signatureUrl: string | null, type: string, logStudentNumber?: string): void {
  if (!signatureUrl) {
    this.showError('No signature available');
    return;
  }
  
  // Use the log's student number if provided, otherwise fall back to component's student number
  const studentNum = logStudentNumber || this.studentNumber;
  if (!studentNum) {
    this.showError('Student number not available');
    return;
  }
  
  // Get the safe URL using the fixed method
  const safeUrl = this.getSafeUrl(signatureUrl, studentNum);
  
  // Create and trigger download via anchor element
  const link = document.createElement('a');
  link.href = safeUrl;
  link.download = type === 'student' ? 'student_signature.png' : 'supervisor_signature.png';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Also trigger the file download service if needed
  this.fileUrlService.downloadFile(signatureUrl, `${type}_signature`);
}

  showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
    });
  }

  showMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
    });
  }

  showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar'],
    });
  }

  goBack(): void {
    this.location.back();
  }
}