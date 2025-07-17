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
import { MatDialog } from '@angular/material/dialog';
import { AttendanceRegisterComponent } from '../../shared/attendance-register/attendance-register.component';

@Component({
  selector: 'app-upcoming-events',
  standalone: true,
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
  templateUrl: './upcoming-events.component.html',
  styleUrls: ['./upcoming-events.component.scss'],
})
export class UpcomingEventsComponent implements OnInit {
  titleControl = new FormControl('');
  guestNameControl = new FormControl('');
  eventTypeControl = new FormControl('all');
  eventDateControl = new FormControl<Date | null>(null);

  lectures: any[] = [];
  filteredLectures: any[] = [];

  displayedColumns: string[] = [
    'title',
    'guest_name',
    'event_type',
    'event_date',
    'register_status',
    'actions',
  ];

  loadingStates: { [key: number]: boolean } = {};
  isFromAdmin = false;
  isAdminUser = false;
  userEmail: string | null = null;

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/staff-login']);
      return;
    }

    this.userEmail = this.authService.getUserEmail();

    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });

      const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
      this.isAdminUser = user?.role === 'admin';

      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    }

    this.isFromAdmin = history.state?.from === 'admin-dashboard';

    this.fetchLectures();
    this.setupFilterListeners();
  }

  fetchLectures(): void {
    this.authService.getGuestLectures().subscribe({
      next: (response) => {
        this.lectures = (response.data || []).map((item: any) => ({
          ...item,
          register_status: item.register_status ?? item.RegisterStatus ?? item.status ?? 'N/A'
        }));
        this.filteredLectures = [...this.lectures];
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
    this.titleControl.valueChanges.pipe(debounceTime(300)).subscribe(() => this.applyFilters());
    this.guestNameControl.valueChanges.pipe(debounceTime(300)).subscribe(() => this.applyFilters());
    this.eventTypeControl.valueChanges.subscribe(() => this.applyFilters());
    this.eventDateControl.valueChanges.subscribe(() => this.applyFilters());
  }

  applyFilters(): void {
    this.filteredLectures = this.lectures.filter((lecture) =>
      this.checkTitleFilter(lecture.title) &&
      this.checkGuestNameFilter(lecture.guest_name) &&
      this.checkEventTypeFilter(lecture.event_type) &&
      this.checkEventDateFilter(lecture.event_date)
    );
  }

  private checkTitleFilter(title: string): boolean {
    const titleFilter = this.titleControl.value?.toLowerCase() || '';
    return !titleFilter || title.toLowerCase().includes(titleFilter);
  }

  private checkGuestNameFilter(guestName: string): boolean {
    const guestNameFilter = this.guestNameControl.value?.toLowerCase() || '';
    return !guestNameFilter || guestName.toLowerCase().includes(guestNameFilter);
  }

  private checkEventTypeFilter(eventType: string): boolean {
    const eventTypeFilter = this.eventTypeControl.value;
    return !eventTypeFilter || eventTypeFilter === 'all' || eventType.toLowerCase() === eventTypeFilter.toLowerCase();
  }

  private checkEventDateFilter(eventDate: string): boolean {
    if (!this.eventDateControl.value || !eventDate) return true;
    return new Date(eventDate).toDateString() === new Date(this.eventDateControl.value).toDateString();
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
      alert('No document path provided.');
      return;
    }

    this.loadingStates[id] = true;

    const fullUrl = `${this.authService.apiUrl.replace('/api', '')}/${documentPath}`;

    this.http.get(fullUrl, { responseType: 'blob' }).subscribe({
      next: (blob: Blob) => {
        const link = document.createElement('a');
        const url = window.URL.createObjectURL(blob);
        link.href = url;
        link.download = documentPath.split('/').pop() || 'document.pdf';
        link.click();
        window.URL.revokeObjectURL(url);
        this.loadingStates[id] = false;
      },
      error: (err) => {
        console.error('Error downloading document:', err);
        if (err.status !== 0 && !err.message.includes('CORS')) {
          alert('Failed to download the document. Please try again.');
        }
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
