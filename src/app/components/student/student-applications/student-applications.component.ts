import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { isPlatformBrowser, Location } from '@angular/common';
import { Application, StudyLevel } from './application.model';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AuthService } from '../../../services/auth.service';
import { CodeService } from './code.service';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { NavigationEnd, Router } from '@angular/router';

type ApplicationStatus = 'Pending' | 'Accepted' | 'Rejected';
type DocumentType = 'signature' | 'id' | 'cv';

const STATUS_CLASSES: Record<string, string> = {
  'Pending': 'status-pending',
  'Accepted': 'status-accepted',
  'Rejected': 'status-rejected'
};

const DOCUMENT_TYPE_MAP = {
  'signature': 'SIGNATURE',
  'id': 'ID',
  'cv': 'CV'
};

const MIME_TYPES: Record<string, string> = {
  'pdf': 'application/pdf',
  'png': 'image/png',
  'jpg': 'image/jpeg',
  'jpeg': 'image/jpeg',
  'doc': 'application/msword',
  'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
};

interface ProcessedApplication extends Application {
  safeSignatureUrl: SafeResourceUrl;
  safeIdDocUrl: SafeResourceUrl;
  safeCvUrl: SafeResourceUrl;
  signatureUrl: string; // Add regular string URLs for images
  idDocUrl: string;
  cvUrl: string;
}

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
  styleUrls: ['./student-applications.component.scss']
})
export class StudentApplicationsComponent implements OnInit {
  // Data and state
  applications: ProcessedApplication[] = [];
  filteredApplications: ProcessedApplication[] = [];
  isLoading = false;
  error: string | null = null;
  userEmail: string | null = null;
  studentNumber: string | null = null;
  isUpdatingStatus: { [key: number]: boolean } = {};

  // Filter controls
  searchStatusControl = new FormControl('');
  searchFirstNameControl = new FormControl('');
  searchSurnameControl = new FormControl('');
  searchStudentNumberControl = new FormControl('');
  searchLevelControl = new FormControl('');
  searchEmailControl = new FormControl('');
  applicationDateControl = new FormControl<Date | null>(null);

  // Table columns
  displayedColumns: string[] = [
    'first_names', 'surname', 'student_number', 'level_of_study', 'email',
    'contact_cell_phone', 'municipality_name', 'town_situated', 'telephone_number',
    'signature_image', 'status', 'created_at', 'id_document', 'cv_document', 'actions'
  ];

  constructor(
    private http: HttpClient,
    private location: Location,
    private router: Router,
    private sanitizer: DomSanitizer,
    private snackBar: MatSnackBar,
    private codeService: CodeService,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}
  ngOnInit(): void {
    this.initializeAuth();
    this.initializeScrollHandling();
    this.loadApplications();
    this.setupFilterListeners();
  
    // Debug: Check initial status control value
    console.log('🔄 Initial status control value:', this.searchStatusControl.value);
  }

  onImageError(event: Event, type: string) {
    console.error(`Error loading ${type} image:`, event);
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
    
    // Show fallback text
    const fallbackElement = document.createElement('div');
    fallbackElement.className = 'image-fallback';
    fallbackElement.textContent = `${type.toUpperCase()} Image`;
    fallbackElement.style.cssText = `
      padding: 10px;
      background: #f5f5f5;
      border: 1px dashed #ccc;
      text-align: center;
      color: #666;
    `;
    
    img.parentNode?.insertBefore(fallbackElement, img);
    img.style.display = 'none';
  }

  // Initialization
  private initializeAuth(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/student-login']);
      return;
    }
    this.userEmail = this.authService.getUserEmail();
    this.studentNumber = this.authService.getStudentNumber();
  }

  private initializeScrollHandling(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  // Data loading
  loadApplications(): void {
    if (!this.ensureUserEmail()) return;

    this.isLoading = true;
    this.error = null;

    const apiUrl = `http://localhost:8080/api/student_applications?email=${encodeURIComponent(this.userEmail!)}`;

    this.http.get<Application[]>(apiUrl)
      .pipe(
        catchError(this.handleLoadError.bind(this)),
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: this.handleLoadSuccess.bind(this)
      });
  }

  private ensureUserEmail(): boolean {
    if (!this.userEmail) {
      this.userEmail = this.authService.getUserEmail();
      this.studentNumber = this.authService.getStudentNumber();
      
      if (!this.userEmail) {
        this.error = 'User email not found. Please log in again.';
        this.isLoading = false;
        return false;
      }
    }
    return true;
  }

  private handleLoadError(error: any) {
    this.error = 'Failed to load applications. Please try again later.';
    console.error('API Error:', error);
    return of([]);
  }

  private handleLoadSuccess(data: Application[]): void {
    this.applications = data.map(app => {
      console.log('Processing application:', {
        id: app.id,
        studentNumber: app.student_number,
        signature: app.signature_image,
        idDoc: app.id_document,
        cv: app.cv_document
      });

      const signatureUrl = this.constructDocumentUrl(app.signature_image, app.student_number, 'signature');
      const idDocUrl = this.constructDocumentUrl(app.id_document, app.student_number, 'id');
      const cvUrl = this.constructDocumentUrl(app.cv_document, app.student_number, 'cv');

      console.log(`[Application ${app.id}] URLs:`, {
        signature: signatureUrl,
        id: idDocUrl,
        cv: cvUrl
      });

      return {
        ...app,
        safeSignatureUrl: this.sanitizer.bypassSecurityTrustResourceUrl(signatureUrl),
        safeIdDocUrl: this.sanitizer.bypassSecurityTrustResourceUrl(idDocUrl),
        safeCvUrl: this.sanitizer.bypassSecurityTrustResourceUrl(cvUrl),
        signatureUrl: signatureUrl, // Regular string URL for img tags
        idDocUrl: idDocUrl,
        cvUrl: cvUrl
      } as ProcessedApplication;
    });
    
    this.filteredApplications = [...this.applications];
    console.log('Processed applications:', this.applications);
  }

  // Document handling - FIXED: Use regular string URLs for images
  private constructDocumentUrl(filename: string, studentNumber: string, docType: DocumentType): string {
    if (!filename || !studentNumber) {
      return '';
    }

    // If it's already a full URL, use it directly (fix double paths)
    if (filename.startsWith('http://') || filename.startsWith('https://')) {
      return filename.replace('/uploads/uploads/', '/uploads/');
    }
    
    // If it starts with uploads/, use it directly
    if (filename.startsWith('uploads/')) {
      return `http://localhost:8080/${filename}`;
    }
    
    // If it starts with /uploads/, use it directly
    if (filename.startsWith('/uploads/')) {
      return `http://localhost:8080${filename}`;
    }

    // Build URL using the pattern: uploads/{student_number}/{student_number}_{docType}.extension
    const extension = this.getFileExtension(filename);
    const docPrefix = DOCUMENT_TYPE_MAP[docType];
    
    // For signature, use png by default if no extension
    const finalExtension = docType === 'signature' && !filename.includes('.') ? 'png' : extension;
    
    return `http://localhost:8080/uploads/${studentNumber}/${studentNumber}_${docPrefix}.${finalExtension}`;
  }

  // FIXED: Download document with better error handling
  downloadDocument(app: ProcessedApplication, docType: DocumentType): void {
    if (!app.student_number) {
      this.showError('Student number not found');
      return;
    }

    const url = docType === 'signature' ? app.signatureUrl : 
                docType === 'id' ? app.idDocUrl : app.cvUrl;

    if (!url) {
      this.showError(`No ${docType} document URL available`);
      return;
    }

    this.isLoading = true;
    
    console.log(`[Download] Attempting to download ${docType} from:`, url);
    
    // Create a hidden anchor tag to trigger download
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = url;
    
    const extension = this.getFileExtension(url);
    const docName = DOCUMENT_TYPE_MAP[docType];
    link.download = `${app.student_number}_${docName}.${extension}`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Fallback: If direct download doesn't work, try HTTP request
    setTimeout(() => {
      this.http.get(url, { 
        responseType: 'blob',
        observe: 'response'
      })
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (response) => {
          if (response.status === 200 && response.body) {
            this.triggerBlobDownload(response.body, app.student_number!, docType, url);
          } else {
            console.warn('Direct download might have worked, or server returned:', response.status);
          }
        },
        error: (error) => {
          console.error(`HTTP download failed for ${docType}:`, error);
          // Don't show error if direct download worked
          if (error.status !== 0) { // CORS errors show as status 0
            this.showError(`Failed to download ${docType} document: ${error.message}`);
          }
        }
      });
    }, 1000);
  }

  private triggerBlobDownload(data: Blob, studentNumber: string, docType: DocumentType, url: string): void {
    const contentType = this.detectMimeType(url);
    const extension = this.getFileExtension(url);
    const docName = DOCUMENT_TYPE_MAP[docType];
    const filename = `${studentNumber}_${docName}.${extension}`;
    
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

  // FIXED: Open document in new tab
  openDocument(app: ProcessedApplication, docType: DocumentType): void {
    const url = docType === 'signature' ? app.signatureUrl : 
                docType === 'id' ? app.idDocUrl : app.cvUrl;

    if (!url) {
      this.showError(`No ${docType} document URL available`);
      return;
    }

    console.log(`[Open] Opening ${docType} document:`, url);
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  // Filtering
  private setupFilterListeners(): void {
    // Status and date filters (immediate)
    this.searchStatusControl.valueChanges.subscribe(() => this.applyFilters());
    this.applicationDateControl.valueChanges.subscribe(() => this.applyFilters());

    // Text filters with debounce
    const controls = [
      this.searchFirstNameControl,
      this.searchSurnameControl,
      this.searchStudentNumberControl,
      this.searchEmailControl,
      this.searchLevelControl
    ];

    controls.forEach(control => {
      control.valueChanges.pipe(debounceTime(300)).subscribe(() => this.applyFilters());
    });
  }

  applyFilters(): void {
    if (!this.applications) return;
  
    console.log('🔍 Applying filters:', {
      status: this.searchStatusControl.value,
      firstName: this.searchFirstNameControl.value,
      level: this.searchLevelControl.value,
      email: this.searchEmailControl.value,
      date: this.applicationDateControl.value
    });
  
    this.filteredApplications = this.applications.filter(app => {
      const passesFilters = 
        this.checkFirstNameFilter(app.first_names) &&
        this.checkSurnameFilter(app.surname) &&
        this.checkStudentNumberFilter(app.student_number) &&
        this.checkLevelFilter(app.level_of_study) &&
        this.checkEmailFilter(app.email) &&
        this.checkApplicationDate(app.created_at) &&
        this.checkStatusFilter(app.status);
  
      console.log(`📋 App ${app.id} (${app.status}) passes filters:`, passesFilters);
      return passesFilters;
    });
  
    console.log(`📊 Filtered results: ${this.filteredApplications.length} out of ${this.applications.length}`);
  }
  
  private checkStatusFilter(status: string): boolean {
    const selectedStatus = this.searchStatusControl.value;
    
    // Handle null/undefined/empty string
    if (!selectedStatus || selectedStatus === '') {
      return true;
    }
    
    // Case-insensitive comparison
    return status.toLowerCase() === selectedStatus.toLowerCase();
  }

  private checkFirstNameFilter(firstName: string): boolean {
    return this.checkTextFilter(this.searchFirstNameControl.value, firstName);
  }

  private checkSurnameFilter(surname: string): boolean {
    return this.checkTextFilter(this.searchSurnameControl.value, surname);
  }

  private checkStudentNumberFilter(studentNumber: string): boolean {
    return this.checkTextFilter(this.searchStudentNumberControl.value, studentNumber);
  }

  private checkEmailFilter(email: string): boolean {
    return this.checkTextFilter(this.searchEmailControl.value, email);
  }

  private checkTextFilter(searchTerm: string | null, value: string): boolean {
    if (!searchTerm) return true;
    return value.toLowerCase().includes(searchTerm.toLowerCase());
  }

  private checkLevelFilter(level: StudyLevel): boolean {
    const selectedLevel = this.searchLevelControl.value;
    return !selectedLevel || level.toString() === selectedLevel;
  }

  private checkApplicationDate(createdAt: string): boolean {
    if (!this.applicationDateControl.value) return true;
    const createdDate = new Date(createdAt);
    const selectedDate = new Date(this.applicationDateControl.value);
    return createdDate.getFullYear() === selectedDate.getFullYear() &&
           createdDate.getMonth() === selectedDate.getMonth();
  }

  // UI Helpers
  clearFilters(): void {
    this.searchFirstNameControl.reset('');
    this.searchSurnameControl.reset('');
    this.searchStudentNumberControl.reset('');
    this.searchLevelControl.reset('');
    this.searchEmailControl.reset('');
    this.searchStatusControl.reset('');
    this.applicationDateControl.reset(null);
  }

  viewDetails(application: ProcessedApplication): void {
    console.log('Viewing:', application);
  }

  goBack(): void {
    this.location.back();
  }

  getStatusClass(status: string): string {
    console.log('🔍 getStatusClass called with status:', status, 'type:', typeof status);
    
    // Normalize the status
    const normalizedStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    console.log('🔍 Normalized status:', normalizedStatus);
    
    const STATUS_CLASSES: Record<string, string> = {
      'Pending': 'status-pending',
      'Accepted': 'status-accepted', 
      'Rejected': 'status-rejected'
    };
    
    const result = STATUS_CLASSES[normalizedStatus] || 'status-pending';
    console.log('🔍 Returning class:', result);
    
    return result;
  }

  getStudyLevelLabel(level: string): string {
    const studyLevelMap: Record<string, string> = {
      '1': '1st Year', '2': '2nd Year', '3': '3rd Year',
      '4': 'Undergraduate', '5': 'Postgraduate', '6': 'Doctorate'
    };
    return studyLevelMap[level] || 'Extended Study Level';
  }

  // Status Management
  updateStatus(application: ProcessedApplication, newStatus: ApplicationStatus): void {
    const previousStatus = application.status;
    this.isUpdatingStatus[application.id] = true;

    this.authService.updateWilApplicationStatus(application.id, newStatus)
      .pipe(finalize(() => {
        delete this.isUpdatingStatus[application.id];
      }))
      .subscribe({
        next: (response) => this.handleStatusUpdateSuccess(application, newStatus, response),
        error: (error) => this.handleStatusUpdateError(error, application, previousStatus)
      });
  }

  private handleStatusUpdateSuccess(application: ProcessedApplication, newStatus: ApplicationStatus, response: any): void {
    application.status = newStatus;
    application.created_at = new Date().toISOString();

    let message = response.message;
    if (newStatus === 'Accepted' && response.code) {
      message += ` - Code: ${response.code} has been emailed to ${application.email}`;
    } else if (newStatus === 'Rejected') {
      message += ` - Notification sent to ${application.email}`;
    }

    this.showSuccess(message);
  }

  private handleStatusUpdateError(error: any, application: ProcessedApplication, previousStatus: ApplicationStatus): void {
    console.error('Status update failed:', error);
    application.status = previousStatus;

    let errorMessage = error.error?.message || error.message || 'Failed to update status';
    if (error.status === 404) {
      errorMessage = 'Application not found - it may have been deleted';
      this.removeApplication(application.id);
    } else if (error.status === 0) {
      errorMessage = 'Network error - please check your connection';
    }

    this.showError(errorMessage);
  }

  // Utility Methods
  private removeApplication(appId: number): void {
    this.applications = this.applications.filter(app => app.id !== appId);
    this.filteredApplications = this.filteredApplications.filter(app => app.id !== appId);
  }

  private getFileExtension(filename: string): string {
    return filename.split('.').pop()?.toLowerCase() || 'pdf';
  }

  private detectMimeType(url: string): string {
    const extension = this.getFileExtension(url);
    return MIME_TYPES[extension] || 'application/octet-stream';
  }

  // Notification Helpers
  private showError(message: string): void {
    this.showNotification(message, 'error-snackbar', 5000);
  }

  private showSuccess(message: string, duration: number = 3000): void {
    this.showNotification(message, 'success-snackbar', duration);
  }

  private showNotification(message: string, panelClass: string, duration: number): void {
    const config: MatSnackBarConfig = {
      duration,
      panelClass: [panelClass]
    };
    this.snackBar.open(message, 'Close', config);
  }

  // Add this method to handle the datepicker event
  onMonthSelected(event: any, datepicker: MatDatepicker<any>) {
    this.applicationDateControl.setValue(event);
    datepicker.close();
  }
}