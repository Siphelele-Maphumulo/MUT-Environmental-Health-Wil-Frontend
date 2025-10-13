import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { isPlatformBrowser, Location } from '@angular/common';
import { Application, StudyLevel } from './application.model';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

// Import Angular Material modules
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SafeUrl } from '@angular/platform-browser';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AuthService } from '../../../services/auth.service';
import { CodeService } from './code.service';
import { MatNativeDateModule } from '@angular/material/core';
import {
  MatDatepicker,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { NavigationEnd } from '@angular/router';
import { Router } from '@angular/router';
import path from 'node:path';

@Component({
  selector: 'app-student-applications',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './student-applications.component.html',
  styleUrl: './student-applications.component.scss'
})
export class StudentApplicationsComponent implements OnInit {
  onMonthSelected($event: any, _t40: MatDatepicker<any>) {
    //Add this new filter method
    throw new Error('Method not implemented.');
  }
  // API URL for fetching applications
get apiUrl(): string {
  return `http://localhost:8080/api/student_applications?email=${encodeURIComponent(this.userEmail || '')}`;
}


  // Data and state variables
  applications: Application[] = [];
  filteredApplications: Application[] = [];
  isLoading = false;
  error: string | null = null;

  // Filter controls
  searchStatusControl = new FormControl('');
  searchFirstNameControl = new FormControl('');
  searchSurnameControl = new FormControl('');
  searchStudentNumberControl = new FormControl('');
  searchLevelControl = new FormControl('');
  searchEmailControl = new FormControl('');
  applicationDateControl = new FormControl<Date | null>(null);

  // Columns to display in the table
  displayedColumns: string[] = [
    'first_names',
    'surname',
    'student_number',
    'level_of_study',
    'email',
    'contact_cell_phone',
    'municipality_name',
    'town_situated',
    'telephone_number',
    'signature_image',
    'status',
    'created_at',
    'id_document',
    'cv_document',
    'actions',
  ];

  isUpdatingStatus: { [key: number]: boolean } = {};
  codeGenerationService: any;
  changeDetector: any;
  userEmail: string | null = null;

  constructor(
    private http: HttpClient,
    private location: Location,
    private router: Router,
    private sanitizer: DomSanitizer,
    private snackBar: MatSnackBar,
    private codeService: CodeService, // Add this line
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

    this.loadApplications();
    this.setupFilterListeners();
  }

  /**
   * Maps study level number to a human-readable label.
   */
  getStudyLevelLabel(level: string): string {
    const studyLevelMap: { [key: string]: string } = {
      '1': '1st Year',
      '2': '2nd Year',
      '3': '3rd Year',
      '4': 'Undergraduate',
      '5': 'Postgraduate',
      '6': 'Doctorate',
    };
    return studyLevelMap[level] || 'Extended Study Level';
  }

  /**
   * Fetches applications from the backend API.
   */
  loadApplications(): void {
    this.isLoading = true;
    this.error = null;

    this.http
      .get<Application[]>(this.apiUrl)
      .pipe(
        catchError((err) => {
          this.error = 'Failed to load applications. Please try again later.';
          console.error('API Error:', err);
          return of([]);
        }),
        finalize(() => (this.isLoading = false))
      )
      .subscribe({
        next: (data) => {
          this.applications = data.map((app) => ({
            ...app,
            safeSignatureUrl: this.getSafeUrl(app.signature_image),
            safeIdDocUrl: this.getSafeUrl(app.id_document),
            safeCvUrl: this.getSafeUrl(app.cv_document),
          }));
          this.filteredApplications = [...this.applications];
        },
      });
  }

  /**
   * Sets up listeners for filter changes
   */
  private setupFilterListeners(): void {
    // Text filters with debounce

    this.searchStatusControl.valueChanges.subscribe(() => this.applyFilters());

    this.searchFirstNameControl.valueChanges
      .pipe(debounceTime(300))
      .subscribe(() => this.applyFilters());

    this.searchSurnameControl.valueChanges
      .pipe(debounceTime(300))
      .subscribe(() => this.applyFilters());

    this.searchStudentNumberControl.valueChanges
      .pipe(debounceTime(300))
      .subscribe(() => this.applyFilters());

    this.searchEmailControl.valueChanges
      .pipe(debounceTime(300))
      .subscribe(() => this.applyFilters());

    // Level filter (immediate)
    this.searchLevelControl.valueChanges.subscribe(() => this.applyFilters());

    // Application Date filter
    this.applicationDateControl.valueChanges.subscribe(() =>
      this.applyFilters()
    );
  }

  /**
   * Applies all active filters to the applications list
   */
  applyFilters(): void {
    if (!this.applications) return;

    this.filteredApplications = this.applications.filter((app) => {
      return (
        this.checkFirstNameFilter(app.first_names) &&
        this.checkSurnameFilter(app.surname) &&
        this.checkStudentNumberFilter(app.student_number.toString()) &&
        this.checkLevelFilter(app.level_of_study) &&
        this.checkEmailFilter(app.email) &&
        this.checkApplicationDate(app.created_at) &&
        this.checkStatusFilter(app.status)
      );
    });
  } // Add this filter check method
  private checkStatusFilter(status: string): boolean {
    const selectedStatus = this.searchStatusControl.value;
    if (!selectedStatus) return true;
    return status === selectedStatus;
  }

  /**
   * Checks if application matches first name filter
   */
  private checkFirstNameFilter(firstName: string): boolean {
    const searchTerm = this.searchFirstNameControl.value?.toLowerCase() || '';
    if (!searchTerm) return true;
    return firstName.toLowerCase().includes(searchTerm);
  }

  /**
   * Checks if application matches surname filter
   */
  private checkSurnameFilter(surname: string): boolean {
    const searchTerm = this.searchSurnameControl.value?.toLowerCase() || '';
    if (!searchTerm) return true;
    return surname.toLowerCase().includes(searchTerm);
  }

  /**
   * Checks if application matches student number filter
   */
  private checkStudentNumberFilter(studentNumber: string): boolean {
    const searchTerm =
      this.searchStudentNumberControl.value?.toLowerCase() || '';
    if (!searchTerm) return true;
    return studentNumber.toLowerCase().includes(searchTerm);
  }

  /**
   * Checks if application matches level filter
   */
  private checkLevelFilter(level: StudyLevel): boolean {
    const selectedLevel = this.searchLevelControl.value;
    if (!selectedLevel) return true;

    // Convert both to string for comparison (adjust based on your enum structure)
    return level.toString() === selectedLevel;
  }

  /**
   * Checks if application matches email filter
   */
  private checkEmailFilter(email: string): boolean {
    const searchTerm = this.searchEmailControl.value?.toLowerCase() || '';
    if (!searchTerm) return true;
    return email.toLowerCase().includes(searchTerm);
  }

  // Add this new filter method
  private checkApplicationDate(created_at: string): boolean {
    if (!this.applicationDateControl.value) return true;

    const createdDate = new Date(created_at);
    const selectedDate = new Date(this.applicationDateControl.value);

    // Compare only year and month
    return (
      createdDate.getFullYear() === selectedDate.getFullYear() &&
      createdDate.getMonth() === selectedDate.getMonth()
    );
  }

  /**
   * Clears all filters
   */
  clearFilters(): void {
    this.searchFirstNameControl.reset('');
    this.searchSurnameControl.reset('');
    this.searchStudentNumberControl.reset('');
    this.searchLevelControl.reset('');
    this.searchEmailControl.reset('');
    this.searchStatusControl.reset('');
    this.applicationDateControl.reset(null);
  }

  /**
   * View application details
   */
  viewDetails(application: Application): void {
    console.log('Viewing:', application);
  }

  /**
   * Sanitize and return safe URL for displaying signature or image
   */
  getSafeUrl(filename: string | null, studentNumber?: string): SafeUrl {
    if (!filename) return this.sanitizer.bypassSecurityTrustResourceUrl('');
  
    let fullUrl: string;
    
    // Check if already a full URL
    if (filename.startsWith('http://') || filename.startsWith('https://')) {
      fullUrl = filename;
    } 
    // If we have a student number, use the correct path pattern
    else if (studentNumber) {
      // Extract just the filename if a path was provided
      const baseFilename = path.basename(filename);
      fullUrl = `http://localhost:8080/uploads/${studentNumber}/${studentNumber}_Signature.png`;
    }
    // Fallback to the original logic if no student number is provided
    else if (filename.startsWith('uploads/')) {
      fullUrl = `http://localhost:8080/${filename}`;
    } 
    else if (filename.startsWith('/uploads/')) {
      fullUrl = `http://localhost:8080${filename}`;
    } 
    else {
      fullUrl = `http://localhost:8080/uploads/${filename}`;
    }
  
    console.log(`[StudentApp] Signature URL: "${filename}" -> "${fullUrl}"`);
    return this.sanitizer.bypassSecurityTrustResourceUrl(fullUrl);
  }

  downloadDocument(url: string, docType: string): void {
    if (!url) {
      this.showErrorSnackbar('No document URL provided');
      return;
    }

    this.isLoading = true;
    const fullUrl = url.startsWith('http')
      ? url
      : `http://localhost:8080/${url}`;

    this.http
      .get(fullUrl, {
        responseType: 'blob',
        observe: 'response',
      })
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response) => {
          if (response.status === 200 && response.body) {
            try {
              const contentType =
                response.headers.get('Content-Type') ||
                this.detectMimeType(url);
              const filename = this.extractFilename(url, docType);

              this.triggerDownload(response.body, contentType, filename);
            } catch (e) {
              console.error('Error preparing download:', e);
              this.showErrorSnackbar('Failed to prepare document for download');
            }
          } else {
            console.warn(
              'Download response received, but with unexpected status:',
              response.status
            );
            this.showErrorSnackbar(
              `Unexpected response while downloading ${docType}`
            );
          }
        },
        error: (err) => {
          console.error(`Error downloading ${docType} document:`, err);
          if (err.status === 404) {
            this.showErrorSnackbar(`${docType} document not found`);
          } else {
            this.showErrorSnackbar(`Failed to download ${docType} document`);
          }
        },
      });
  }

  /**
   * Opens a document in a new tab
   */
  openDocument(url: string): void {
    if (!url) {
      this.showErrorSnackbar('No document URL provided');
      return;
    }

    const fullUrl = url.startsWith('http')
      ? url
      : `http://localhost:8080/${url}`;
    window.open(fullUrl, '_blank', 'noopener,noreferrer');
  }

  /**
   * Navigates back to the previous page.
   */
  goBack(): void {
    this.location.back();
  }

  /**
   * Helper method to trigger file download
   */
  private triggerDownload(
    data: Blob,
    contentType: string,
    filename: string
  ): void {
    const blob = new Blob([data], { type: contentType });
    const downloadUrl = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
    }, 100);
  }

  /**
   * Extracts filename from URL with fallback
   */
  private extractFilename(url: string, docType: string): string {
    const filename = url.split('/').pop() || `${docType}_document`;
    // Remove any query parameters
    return filename.split('?')[0];
  }

  /**
   * Detects proper MIME type for downloads
   */
  private detectMimeType(url: string): string {
    const extension = url.split('.').pop()?.toLowerCase()?.split('?')[0];
    const extensionMap: Record<string, string> = {
      pdf: 'application/pdf',
      png: 'image/png',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      doc: 'application/msword',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    };
    return extensionMap[extension!] || 'application/octet-stream';
  }

  /**
   * Shows error message in snackbar
   */
  private showErrorSnackbar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar'],
    });
  }

  // Update updateStatus method
  updateStatus(
    application: Application,
    newStatus: 'Pending' | 'Accepted' | 'Rejected'
  ): void {
    const previousStatus = application.status;
    this.isUpdatingStatus[application.id] = true;

    this.authService
      .updateWilApplicationStatus(application.id, newStatus)
      .pipe(
        finalize(() => {
          delete this.isUpdatingStatus[application.id];
          this.changeDetector.markForCheck();
        })
      )
      .subscribe({
        next: (response) => {
          application.status = newStatus;
          application.created_at = new Date().toISOString();

          let message = response.message;
          if (newStatus === 'Accepted' && response.code) {
            message += ` - Code: ${response.code} has been emailed to ${application.email}`;
          } else if (newStatus === 'Rejected') {
            message += ` - Notification sent to ${application.email}`;
          }

          this.showSuccessSnackbar(message, 3000);
          this.updateLocalApplicationStatus(application.id, newStatus);
        },
        error: (error) => {
          console.error('Update failed:', error);
          application.status = previousStatus;

          let errorMessage = error.message;
          // Check if status was updated but email failed
          if (
            error.message.includes('Status updated but failed to send email')
          ) {
            errorMessage += `. Code: ${error.details?.code}`;
          }

          this.showErrorSnackbar(errorMessage);
        },
      });
  }

  // Helper method to update local applications array

  // Helper method to handle missing applications
  private removeMissingApplication(appId: number): void {
    this.applications = this.applications.filter((app) => app.id !== appId);
    this.changeDetector.markForCheck();
  }

  // Helper Methods

  private storeGeneratedCode(
    appId: number,
    code: string,
    email: string,
    firstName: string,
    lastName: string
  ): void {
    // Implement your code storage logic here
    console.log(`Stored code ${code} for ${firstName} ${lastName} (${email})`);
    // Example: this.codeService.storeCode(appId, code, email);
  }

  private showStatusNotification(
    status: 'Pending' | 'Accepted' | 'Rejected',
    message: string
  ): void {
    const config = {
      duration: status === 'Accepted' ? 5000 : 3000,
      panelClass: [`status-${status.toLowerCase()}-snackbar`],
    };

    if (status === 'Rejected') {
      this.snackBar.open(message, 'Dismiss', config);
    } else {
      this.snackBar.open(message, 'Close', config);
    }
  }

  private updateLocalApplicationStatus(
    appId: number,
    newStatus: 'Pending' | 'Accepted' | 'Rejected'
  ): void {
    const index = this.applications.findIndex((app) => app.id === appId);
    if (index !== -1) {
      this.applications[index] = {
        ...this.applications[index],
        status: newStatus,
        created_at: new Date().toISOString(),
      };
      this.changeDetector.markForCheck();
    }
  }

  private handleStatusUpdateError(
    error: any,
    application: Application,
    previousStatus: 'Pending' | 'Accepted' | 'Rejected'
  ): void {
    console.error('Status update failed:', error);
    application.status = previousStatus;

    let errorMessage =
      error.error?.message || error.message || 'Failed to updatee status';

    // Special handling for specific error types
    if (error.status === 404) {
      errorMessage = 'Application not found - it may have been deleted';
      this.handleMissingApplication(application.id);
    } else if (error.status === 0) {
      errorMessage = 'Network error - please check your connection';
    }

    this.showErrorSnackbar(errorMessage);
  }

  private handleMissingApplication(appId: number): void {
    this.applications = this.applications.filter((app) => app.id !== appId);
    this.changeDetector.markForCheck();
    console.warn(`Removed missing application ${appId} from local list`);
  }

  private refreshApplicationData(): void {
    // Optional: Add logic to refresh data if needed
    // this.loadApplications();
  }

  private showSuccessSnackbar(message: string, p0: number): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar'],
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Pending':
        return 'status-pending';
      case 'Accepted':
        return 'status-accepted';
      case 'Rejected':
        return 'status-rejected';
      default:
        return '';
    }
  }
}
function throwError(error: any): any {
  throw new Error('Function not implemented.');
}
