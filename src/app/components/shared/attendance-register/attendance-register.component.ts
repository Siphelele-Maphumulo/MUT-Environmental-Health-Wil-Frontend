import {
  Component,
  OnInit,
  ViewChild,
  ElementRef
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon'; // ✅ Add this import


interface EventRegister {
  event_id: number;
  event_title: string;
  event_type: string;
  event_date: string;
  total_registrations: number;
  attended_count: number;
  guest_name: string;
}

interface AttendanceRecord {
  attendance_id: number;
  attended: boolean;
  signed_at: string;
  student_id: number;
  student_title: string;
  initials: string;
  student_number: string;
  first_names: string;
  surname: string;
  guest_name: string;
}

@Component({
  selector: 'app-attendance-register',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatCardModule,
    FormsModule,
    MatIconModule,
  ],
  templateUrl: './attendance-register.component.html',
  styleUrls: ['./attendance-register.component.scss']
})
export class AttendanceRegisterComponent implements OnInit {
  @ViewChild('bottomAnchor') bottomAnchor!: ElementRef;

  events: EventRegister[] = [];
  selectedEvent: EventRegister | null = null;
  attendanceRecords: AttendanceRecord[] = [];
  loading = false;

  displayedColumns = [
    'no',
    'initials',
    'student_number',
    'name',
    'surname',
    'signature',
    'attended',
  ];
  dataSource = new MatTableDataSource<AttendanceRecord>([]);

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<AttendanceRegisterComponent> // ✅ Fixed here
  ) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.loading = true;
    this.authService.getAttendanceRegisters().subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) {
          this.events = res.data;
        } else {
          this.snackBar.open('Failed to load events', 'Close', { duration: 3000 });
        }
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Error loading events', 'Close', { duration: 3000 });
      }
    });
  }

  loadEventDetails(eventId: number): void {
    // Toggle off if same event clicked
    if (this.selectedEvent?.event_id === eventId) {
      this.selectedEvent = null;
      this.dataSource.data = [];
      return;
    }

    // Select new event
    this.selectedEvent = this.events.find(e => e.event_id === eventId) || null;
    this.loading = true;

    this.authService.getEventAttendanceDetails(eventId).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) {
          this.dataSource.data = res.attendance;

          // Scroll to bottom anchor
          setTimeout(() => {
            this.bottomAnchor.nativeElement.scrollIntoView({
              behavior: 'smooth',
              block: 'end'
            });
          }, 50);
        } else {
          this.snackBar.open('Failed to load attendance', 'Close', { duration: 3000 });
        }
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Error loading attendance', 'Close', { duration: 3000 });
      }
    });
  }

  getFullName(r: AttendanceRecord): string {
    return `${r.student_title} ${r.first_names} ${r.surname}`;
  }

closeModal(): void {
  this.dialogRef.close();
}
}
