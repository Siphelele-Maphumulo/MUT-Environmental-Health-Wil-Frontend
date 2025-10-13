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
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AttendanceRegisterComponent } from '../../shared/attendance-register/attendance-register.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-mentor-events',
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
  ],
  templateUrl: './mentor-events.component.html',
  styleUrl: './mentor-events.component.scss'
})
export class MentorEventsComponent implements OnInit {
  // Filter Controls
  titleControl = new FormControl('');
  guestNameControl = new FormControl('');
  eventTypeControl = new FormControl('all');
  eventDateControl = new FormControl<Date | null>(null);

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
  private baseUrl = 'http://localhost:8080'; // Hardcoded base URL

  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/staff-login']);
    } else {
      this.userEmail = this.authService.getCurrentUserEmail ? this.authService.getCurrentUserEmail() : localStorage.getItem('userEmail');
    }

    // Scroll to top
    if (this.isBrowser) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd && this.isBrowser) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });

    // ✅ This works after navigation AND page reload
    this.isFromAdmin = history.state?.from === 'admin-dashboard';
    console.log('isFromAdmin:', this.isFromAdmin);

    if (this.isBrowser) {
      const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
      this.isAdminUser = user?.role === 'admin';
    }

    this.fetchLectures();
    this.setupFilterListeners();
  }

  fetchLectures(): void {
    this.authService.getGuestLectures().subscribe({
      next: (response: any) => {
        this.lectures = response.data || [];
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

toggleRegisterStatus(lecture: any): void {
  this.loadingStates[lecture.id] = true;

  const headers = this.getAuthHeaders();
  
  // FIXED: Using getApiUrl() method
  this.http.put<{ success: boolean; message: string; newStatus: string }>(
    `${this.authService.getApiUrl()}/guest-lecture/toggle-status/${lecture.id}`,
    {},
    { headers }
  ).subscribe({
    next: (res) => {
      if (res.success) {
        lecture.register_status = res.newStatus;
        this.snackBar.open(res.message, 'Close', { 
          duration: 3000, 
          panelClass: ['green-snackbar'] 
        });
      } else {
        this.snackBar.open('Failed to toggle status', 'Close', { 
          duration: 3000, 
          panelClass: ['red-snackbar'] 
        });
      }
      this.loadingStates[lecture.id] = false;
    },
    error: (err) => {
      console.error('Error toggling status:', err);
      this.snackBar.open('Error toggling status. Please try again.', 'Close', { 
        duration: 5000, 
        panelClass: ['red-snackbar'] 
      });
      this.loadingStates[lecture.id] = false;
    }
  });
}

  setupFilterListeners(): void {
    // Title Filter
    this.titleControl.valueChanges
      .pipe(debounceTime(300))
      .subscribe(() => this.applyFilters());

    // Guest Name Filter
    this.guestNameControl.valueChanges
      .pipe(debounceTime(300))
      .subscribe(() => this.applyFilters());

    // Event Type Filter
    this.eventTypeControl.valueChanges.subscribe(() => this.applyFilters());

    // Event Date Filter
    this.eventDateControl.valueChanges.subscribe(() => this.applyFilters());
  }

  applyFilters(): void {
    this.filteredLectures = this.lectures.filter((lecture) => {
      const matchesTitle = this.checkTitleFilter(lecture.title);
      const matchesGuestName = this.checkGuestNameFilter(lecture.guest_name);
      const matchesEventType = this.checkEventTypeFilter(lecture.event_type);
      const matchesEventDate = this.checkEventDateFilter(lecture.event_date);

      return (
        matchesTitle && matchesGuestName && matchesEventType && matchesEventDate
      );
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
      new Date(eventDate).toDateString() ===
      new Date(this.eventDateControl.value).toDateString()
    );
  }

  clearFilters(): void {
    this.titleControl.reset('');
    this.guestNameControl.reset('');
    this.eventTypeControl.setValue('all');
    this.eventDateControl.reset(null);
    this.applyFilters();
  }

  // Fixed downloadDocument method with proper error handling
  downloadDocument(id: number, documentPath: string): void {
    if (!documentPath) {
      this.snackBar.open('No document path provided.', 'Close', { 
        duration: 5000, 
        panelClass: ['orange-snackbar'] 
      });
      return;
    }

    this.loadingStates[id] = true;
    
    // Clean the document path and construct full URL
    const cleanPath = documentPath.replace(/^\/+/, '');
    const fullUrl = `${this.baseUrl}/${cleanPath}`;
    
    console.log(`📥 Downloading document from: ${fullUrl}`);
    
    // Get authentication headers
    const headers = this.getAuthHeaders();
    
    const options = {
      responseType: 'blob' as 'blob',
      headers: headers
    };

    this.http.get(fullUrl, options).subscribe({
      next: (blob: Blob) => {
        try {
          // Validate the blob
          if (blob.size === 0) {
            throw new Error('Downloaded file is empty');
          }

          // Extract filename from path
          const filename = this.extractFilename(documentPath);
          
          // Create download link
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = filename;
          
          // Trigger download
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          // Clean up
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

  // Helper method to extract filename from path
  private extractFilename(path: string): string {
    if (!path) return 'document.pdf';
    
    // Remove query parameters if any
    const cleanPath = path.split('?')[0];
    
    // Extract the last part of the path
    const filename = cleanPath.split('/').pop() || 'document';
    
    // Ensure it has a proper extension
    if (!filename.includes('.')) {
      return `${filename}.pdf`;
    }
    
    return filename;
  }

  // Local method to get auth headers
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

  // Alternative download method using window.open
  downloadDocumentAlternative(id: number, documentPath: string): void {
    if (!documentPath) {
      this.snackBar.open('No document path provided.', 'Close', { 
        duration: 5000, 
        panelClass: ['orange-snackbar'] 
      });
      return;
    }

    const cleanPath = documentPath.replace(/^\/+/, '');
    const fullUrl = `${this.baseUrl}/${cleanPath}`;
    
    console.log(`📥 Opening document: ${fullUrl}`);
    
    const newWindow = window.open(fullUrl, '_blank');
    
    if (!newWindow) {
      this.snackBar.open('Popup blocked. Please allow popups for this site.', 'Close', { 
        duration: 5000, 
        panelClass: ['orange-snackbar'] 
      });
    }
    
    this.loadingStates[id] = false;
  }

  deleteLecture(id: number): void {
    if (confirm('Are you sure you want to delete this record?')) {
      this.authService.deleteGuestLecture(id).subscribe({
        next: () => {
          this.snackBar.open('Guest lecture deleted successfully.', 'Close', { 
            duration: 5000, 
            panelClass: ['green-snackbar'] 
          });
          this.fetchLectures();
        },
        error: (error) => {
          console.error('Error deleting guest lecture:', error);
          this.snackBar.open('Failed to delete guest lecture. Please try again.', 'Close', { 
            duration: 5000, 
            panelClass: ['red-snackbar'] 
          });
        },
      });
    }
  }

  openAttendanceRegister(): void {
    this.dialog.open(AttendanceRegisterComponent, {
      width: '90vw',
      height: '90vh',
      disableClose: true,
      panelClass: 'custom-modal-container'
    });
  }
}