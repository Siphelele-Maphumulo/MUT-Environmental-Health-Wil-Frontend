
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
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AttendanceRegisterComponent } from '../../shared/attendance-register/attendance-register.component';
import { MatDialog } from '@angular/material/dialog';

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

  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/staff-login']); // Redirect to login if not authenticated
    } else {
      this.userEmail = this.authService.getUserEmail();
    }

    // Scroll to top
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    this.router.events.subscribe((event) => {
      if (
        event instanceof NavigationEnd &&
        isPlatformBrowser(this.platformId)
      ) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });

    // ✅ This works after navigation AND page reload
    this.isFromAdmin = history.state?.from === 'admin-dashboard';
    console.log('isFromAdmin:', this.isFromAdmin);

    if (isPlatformBrowser(this.platformId)) {
      const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
      this.isAdminUser = user?.role === 'admin';
    }

    this.fetchLectures();
    this.setupFilterListeners();
  }

  fetchLectures(): void {
    this.authService.getGuestLectures().subscribe({
      next: (response) => {
        this.lectures = response.data;
        this.filteredLectures = [...this.lectures]; // Initialize filtered data
      },
      error: (error) => {
        console.error('Error fetching guest lectures:', error);
        alert('Failed to load guest lectures. Please try again.');
      },
    });
  }

    toggleRegisterStatus(lecture: any): void {
  this.loadingStates[lecture.id] = true;

  this.http.put<{ success: boolean; message: string; newStatus: string }>(
    `${this.authService.apiUrl}/guest-lecture/toggle-status/${lecture.id}`,
    {}
  ).subscribe({
    next: (res) => {
      if (res.success) {
        lecture.register_status = res.newStatus;
        alert(res.message);
      } else {
        alert('Failed to toggle status');
      }
      this.loadingStates[lecture.id] = false;
    },
    error: (err) => {
      console.error('Error toggling status:', err);
      alert('Error toggling status. Please try again.');
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
    this.applyFilters(); // Reapply filters after clearing
  }

  downloadDocument(id: number, documentPath: string): void {
    if (!documentPath) {
      alert('No document path provided.');
      return;
    }

    // Set loading state for the specific record
    this.loadingStates[id] = true;

    // Construct the full URL without appending /api
    const fullUrl = `${this.authService.apiUrl.replace(
      '/api',
      ''
    )}/${documentPath}`;

    console.log('Downloading document from:', fullUrl); // Debugging

    this.http.get(fullUrl, { responseType: 'blob' }).subscribe({
      next: (blob: Blob) => {
        try {
          const link = document.createElement('a');
          const url = window.URL.createObjectURL(blob);
          link.href = url;

          // Extract the filename from the documentPath
          const filename = documentPath.split('/').pop() || 'document.pdf';
          link.download = filename;

          // Programmatically click the link to trigger the download
          link.click();

          // Clean up the temporary URL after the download starts
          window.URL.revokeObjectURL(url);

          // Reset loading state for the specific record
          this.loadingStates[id] = false;
        } catch (error) {
          console.error('Error processing the downloaded file:', error);
          alert('An unexpected error occurred while processing the file.');
          this.loadingStates[id] = false;
        }
      },
      error: (err) => {
        console.error('Error downloading document:', err);

        // Only show the alert if the error is not related to CORS or network issues
        if (err.status === 0 || err.message.includes('CORS')) {
          console.warn('CORS or network issue detected. Skipping user alert.');
        } else {
          alert('Failed to download the document. Please try again.');
        }

        // Reset loading state for the specific record
        this.loadingStates[id] = false;
      },
    });
  }

  deleteLecture(id: number): void {
    if (confirm('Are you sure you want to delete this record?')) {
      this.authService.deleteGuestLecture(id).subscribe({
        next: () => {
          alert('Guest lecture deleted successfully.');
          this.fetchLectures();
        },
        error: (error) => {
          console.error('Error deleting guest lecture:', error);
          alert('Failed to delete guest lecture. Please try again.');
        },
      });
    }
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
