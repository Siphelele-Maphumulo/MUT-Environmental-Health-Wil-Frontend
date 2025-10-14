import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  // Displayed Columns - ADDED register_status column
  displayedColumns: string[] = [
    'title',
    'guest_name',
    'event_type',
    'event_date',
    'register_status', // Added this column
    'actions',
  ];

  // Loading States
  loadingStates: { [key: number]: boolean } = {};
  isFromAdmin = false;
  isAdminUser = false;
  userEmail: string | null = null;

  private isBrowser: boolean;
  private baseUrl = 'http://localhost:8080';

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
      // Use AuthService as the single source of truth for user email
      this.userEmail = this.authService.getUserEmail();
      console.log('User Email:', this.userEmail);
      this.studentNumber = this.extractStudentNumberFromEmail(this.userEmail);
    }

    if (!this.studentNumber) {
      if (this.isBrowser) {
        alert('Could not retrieve your student number. Please log in again.');
      }
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
      this.lectures = (response.data || []).map((lecture: any) => ({
        ...lecture,
        // Ensure we're using the numeric id field
        id: lecture.id, // This should be 21, not the MongoDB _id
        register_status: this.normalizeStatus(lecture.register_status)
      }));
      
      // Debug: Log the lectures to verify IDs
      console.log('Fetched lectures:', this.lectures.map(l => ({ 
        id: l.id, 
        title: l.title,
        _id: l._id // This will show if MongoDB _id is present
      })));
      
      this.filteredLectures = [...this.lectures];
    },
    error: (error) => {
      console.error('Error fetching guest lectures:', error);
      this.snackBar.open('Failed to load guest lectures. Please try again.', 'Close', { 
        duration: 5000, 
        panelClass: ['red-snackbar'] 
      });
    },
  });
}

  // Helper method to normalize status values
  private normalizeStatus(status: string): string {
    if (!status) return 'Inactive';
    
    const statusMap: { [key: string]: string } = {
      'active': 'Active',
      'inactive': 'Inactive', 
      'pending': 'Pending',
      'cancelled': 'Cancelled'
    };
    
    return statusMap[status.toLowerCase()] || status;
  }

  // Check if registration is allowed for a lecture
  canRegister(lecture: any): boolean {
    return lecture.register_status === 'Active';
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
      this.snackBar.open('No document path provided.', 'Close', { 
        duration: 5000, 
        panelClass: ['orange-snackbar'] 
      });
      return;
    }

    this.loadingStates[id] = true;
    
    const cleanPath = documentPath.replace(/^\/+/, '');
    const fullUrl = `${this.baseUrl}/${cleanPath}`;
    
    console.log(`📥 Downloading document from: ${fullUrl}`);
    
    const headers = this.getAuthHeaders();
    
    const options = {
      responseType: 'blob' as 'blob',
      headers: headers
    };

    this.http.get(fullUrl, options).subscribe({
      next: (blob: Blob) => {
        try {
          if (blob.size === 0) {
            throw new Error('Downloaded file is empty');
          }

          const filename = this.extractFilename(documentPath);
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = filename;
          
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          window.URL.revokeObjectURL(url);
          
          console.log(`✅ Successfully downloaded: ${filename}`);
          this.snackBar.open(`Document downloaded: ${filename}`, 'Close', { 
            duration: 3000, 
            panelClass: ['green-snackbar'] 
          });
          
        } catch (error) {
          console.error('Error processing the downloaded file:', error);
          this.snackBar.open('Error processing downloaded file. The file may be corrupted.', 'Close', { 
            duration: 5000, 
            panelClass: ['red-snackbar'] 
          });
        } finally {
          this.loadingStates[id] = false;
        }
      },
      error: (err) => {
        console.error('Error downloading document:', err);
        this.loadingStates[id] = false;
        
        let errorMessage = 'Failed to download document. Please try again.';
        
        if (err.status === 0) {
          errorMessage = 'Network error: Cannot connect to server. Please check your connection.';
        } else if (err.status === 404) {
          errorMessage = 'Document not found. The file may have been moved or deleted.';
        } else if (err.status === 401) {
          errorMessage = 'Authentication required. Please log in again.';
        } else if (err.status === 403) {
          errorMessage = 'Access denied. You do not have permission to download this document.';
        } else if (err.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        } else if (err.message?.includes('CORS')) {
          errorMessage = 'CORS error: Cannot download from this server.';
        }
        
        this.snackBar.open(errorMessage, 'Close', { 
          duration: 6000, 
          panelClass: ['red-snackbar'] 
        });
      }
    });
  }

  private extractFilename(path: string): string {
    if (!path) return 'document.pdf';
    
    const cleanPath = path.split('?')[0];
    const filename = cleanPath.split('/').pop() || 'document';
    
    if (!filename.includes('.')) {
      return `${filename}.pdf`;
    }
    
    return filename;
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    
    if (token) {
      return new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      });
    }
    
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

registerForLecture(lecture: any): void {
  if (!this.studentNumber) {
    this.snackBar.open('Student number missing, please login.', 'Close', { 
      duration: 3000, 
      panelClass: ['orange-snackbar'] 
    });
    return;
  }

  // Check if registration is allowed
  if (!this.canRegister(lecture)) {
    this.snackBar.open('Registration is not available for this event. Status: ' + lecture.register_status, 'Close', { 
      duration: 5000, 
      panelClass: ['orange-snackbar'] 
    });
    return;
  }

  this.loadingStates[lecture.id] = true;
  
  const eventId = lecture.id;
  
  console.log('Registering for event:', {
    eventId: eventId,
    eventTitle: lecture.title,
    studentNumber: this.studentNumber
  });

  this.authService.registerForLecture(eventId, this.studentNumber).subscribe({
    next: (response) => {
      this.loadingStates[lecture.id] = false;
      this.snackBar.open('Successfully registered and marked as attended!', 'Close', { 
        duration: 3000, 
        panelClass: ['green-snackbar'] 
      });
      this.fetchLectures(); // Refresh the list
      
      // Just open the attendance register to show they're already marked
      this.openAttendanceRegister(eventId, this.studentNumber!);
    },
    error: (error) => {
      this.loadingStates[lecture.id] = false;
      
      let errorMessage = 'Failed to register for the lecture. Please check the register and try again.';
      
      if (error.error && error.error.message) {
        errorMessage = error.error.message;
        
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
        panelClass: ['red-snackbar']
      });
      
      console.error('Registration error:', error);
    }
  });
}

openAttendanceRegister(eventId: number, studentNumber: string): void {
  const dialogRef = this.dialog.open(AttendanceRegisterComponent, {
    width: '90vw',
    height: '90vh',
    disableClose: true,
    panelClass: 'custom-modal-container',
    data: {
      eventId: eventId,
      studentNumber: studentNumber
    }
  });
}
}