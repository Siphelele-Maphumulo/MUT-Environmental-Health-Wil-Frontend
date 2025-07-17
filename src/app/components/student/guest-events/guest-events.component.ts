import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AttendanceServiceService } from '../../../services/attendance.service.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { AttendanceRegisterComponent } from '../../shared/attendance-register/attendance-register.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-guest-events',
  imports: [
    CommonModule,
    MatIconModule,
    MatCardModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatOptionModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatTooltipModule,
  ],
  templateUrl: './guest-events.component.html',
  styleUrls: ['./guest-events.component.scss'],
})
export class GuestEventsComponent implements OnInit {
  // Filter Controls
  titleControl = new FormControl('');
  guestNameControl = new FormControl('');
  eventTypeControl = new FormControl('all');
  eventDateControl = new FormControl<Date | null>(null);

  studentNumber: string | null = null;

  // Data Arrays
  lectures: any[] = [];
  filteredLectures: any[] = [];

  // Displayed Columns
  displayedColumns: string[] = [
    'title',
    'guest_name',
    'event_type',
    'event_date',
    'actions',
  ];

  // Loading States
  loadingStates: { [key: number]: boolean } = {};
  isFromAdmin = false;
  isAdminUser = false;
  userEmail: string | null = null;

  private isBrowser: boolean;

  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    private http: HttpClient,
    private attendanceService: AttendanceServiceService,
    private snackBar: MatSnackBar,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.userEmail = sessionStorage.getItem('userEmail');
      console.log('User Email:', this.userEmail);
      this.studentNumber = this.extractStudentNumberFromEmail(this.userEmail);
    }

    if (!this.studentNumber) {
      if (this.isBrowser) {
        // Use alert only in the browser
        alert('Could not retrieve your student number. Please log in again.');
      }
      // Optional: redirect to login page here
    }

    this.fetchLectures();
    this.setupFilterListeners();
  }

  extractStudentNumberFromEmail(email: string | null): string | null {
    if (!email || typeof email !== 'string') {
      console.error('Invalid email provided');
      return null;
    }
    const parts = email.split('@');
    if (parts.length < 2 || !parts[0]) {
      console.warn('Invalid email format:', email);
      return null;
    }
    return parts[0].trim();
  }

  fetchLectures(): void {
    this.authService.getGuestLectures().subscribe({
      next: (response) => {
        this.lectures = response.data || [];
        this.filteredLectures = [...this.lectures];
      },
      error: (error) => {
        console.error('Error fetching guest lectures:', error);
        this.snackBar.open('Failed to load guest lectures. Please try again.', 'Close', { duration: 5000, panelClass: ['red-snackbar'] });
      },
    });
  }

  setupFilterListeners(): void {
    this.titleControl.valueChanges.pipe(debounceTime(300)).subscribe(() => this.applyFilters());
    this.guestNameControl.valueChanges.pipe(debounceTime(300)).subscribe(() => this.applyFilters());
    this.eventTypeControl.valueChanges.subscribe(() => this.applyFilters());
    this.eventDateControl.valueChanges.subscribe(() => this.applyFilters());
  }

  applyFilters(): void {
    this.filteredLectures = this.lectures.filter((lecture) => {
      const matchesTitle = this.checkTitleFilter(lecture.title);
      const matchesGuestName = this.checkGuestNameFilter(lecture.guest_name);
      const matchesEventType = this.checkEventTypeFilter(lecture.event_type);
      const matchesEventDate = this.checkEventDateFilter(lecture.event_date);
      return matchesTitle && matchesGuestName && matchesEventType && matchesEventDate;
    });
  }

  private checkTitleFilter(title: string): boolean {
    const titleFilter = this.titleControl.value?.toLowerCase() || '';
    if (!titleFilter) return true;
    return title.toLowerCase().includes(titleFilter);
  }

  private checkGuestNameFilter(guestName: string): boolean {
    const guestNameFilter = this.guestNameControl.value?.toLowerCase() || '';
    if (!guestNameFilter) return true;
    return guestName.toLowerCase().includes(guestNameFilter);
  }

  private checkEventTypeFilter(eventType: string): boolean {
    const eventTypeFilter = this.eventTypeControl.value;
    if (!eventTypeFilter || eventTypeFilter === 'all') return true;
    return eventType.toLowerCase() === eventTypeFilter.toLowerCase();
  }

  private checkEventDateFilter(eventDate: string): boolean {
    if (!this.eventDateControl.value || !eventDate) return true;
    return (
      new Date(eventDate).toDateString() === new Date(this.eventDateControl.value).toDateString()
    );
  }

  clearFilters(): void {
    this.titleControl.reset('');
    this.guestNameControl.reset('');
    this.eventTypeControl.setValue('all');
    this.eventDateControl.reset(null);
    this.applyFilters();
  }

  downloadDocument(id: number, documentPath: string): void {
    if (!documentPath) {
      this.snackBar.open('No document path provided.', 'Close', { duration: 5000, panelClass: ['orange-snackbar'] });
      return;
    }
    this.loadingStates[id] = true;
    const fullUrl = `${this.authService.apiUrl.replace('/api', '')}/${documentPath}`;
    this.http.get(fullUrl, { responseType: 'blob' }).subscribe({
      next: (blob: Blob) => {
        try {
          const link = document.createElement('a');
          const url = window.URL.createObjectURL(blob);
          link.href = url;
          const filename = documentPath.split('/').pop() || 'document.pdf';
          link.download = filename;
          link.click();
          window.URL.revokeObjectURL(url);
          this.loadingStates[id] = false;
        } catch (error) {
          console.error('Error processing the downloaded file:', error);
          this.snackBar.open('An unexpected error occurred while processing the file.', 'Close', { duration: 5000, panelClass: ['red-snackbar'] });
          this.loadingStates[id] = false;
        }
      },
      error: (err) => {
        console.error('Error downloading document:', err);
        if (err.status !== 0 && !err.message.includes('CORS')) {
          this.snackBar.open('Failed to download the document. Please try again.', 'Close', { duration: 5000, panelClass: ['red-snackbar'] });
        }
        this.loadingStates[id] = false;
      },
    });
  }

  deleteLecture(id: number): void {
    if (confirm('Are you sure you want to delete this record?')) {
      this.authService.deleteGuestLecture(id).subscribe({
        next: () => {
          this.snackBar.open('Guest lecture deleted successfully.', 'Close', { duration: 5000, panelClass: ['green-snackbar'] });
          this.fetchLectures();
        },
        error: (error) => {
          console.error('Error deleting guest lecture:', error);
          this.snackBar.open('Failed to delete guest lecture. Please try again.', 'Close', { duration: 5000, panelClass: ['red-snackbar'] });
        },
      });
    }
  }

registerForLecture(eventId: number): void {
  if (!this.studentNumber) {
    this.snackBar.open('Student number missing, please login.', 'Close', { duration: 3000, panelClass: ['orange-snackbar'] });
    return;
  }

  this.loadingStates[eventId] = true;
  
  this.authService.registerForLecture(eventId, this.studentNumber).subscribe({
    next: (response) => {
      this.loadingStates[eventId] = false;
      this.snackBar.open(response.message, 'Close', { duration: 3000, panelClass: ['orange-snackbar'] });
      this.fetchLectures(); // Refresh the list
      this.openAttendanceRegister()
    },
    error: (error) => {
      this.loadingStates[eventId] = false;
      
      // Default error message
      let errorMessage = 'Failed to register for the lecture please check the register and try again!.';
      
      // Check for specific error cases
      if (error.error && error.error.message) {
        // Use the server-provided message if available
        errorMessage = error.error.message;
        
        // Special handling for "already registered" case
        if (error.status === 409 || 
            error.error.message.includes('already registered') || 
            error.error.message.includes('Maximum registrations')) {
          errorMessage = 'Registration failed: ' + error.error.message;
        }
      } else if (error.status === 0) {
        errorMessage = 'Network error: Could not connect to server';
      } else if (error.status === 403) {
        errorMessage = 'Registration not allowed: ' + 
                      (error.error?.message || 'Not eligible or registration closed');
      }

      this.snackBar.open(errorMessage, 'Close', { 
        duration: 5000,
        panelClass: ['error-snackbar'] // Optional: add custom styling
      });
      
      console.error('Registration error:', error);
    }
  });
}

  openAttendanceRegister(): void {
    this.dialog.open(AttendanceRegisterComponent, {
      width: '90vw',
      height: '90vh',
      disableClose: true, // Prevent closing on backdrop click
      panelClass: 'custom-modal-container' // optional for styling
    });
  }
}