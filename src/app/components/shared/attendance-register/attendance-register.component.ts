import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Inject
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
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon'; // ✅ Add this import


export interface AttendanceRecord {
  no: number;
  attendance_id: number; // Changed to number only (numeric ID)
  attended: boolean;
  signed_at: string | null;
  student_id: number;
  student_title: string;
  initials: string;
  student_number: string;
  first_names: string;
  surname: string;
  guest_name: string;
  isCurrentUser?: boolean; // Optional flag for highlighting
}

export interface EventRegister {
total_registrations: any;
attended_count: any;
  event_id: number;
  event_title: string;
  guest_name: string;
  event_type: string;
  event_date: string;
  register_status: string;
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
  
  // Auto-marking properties
  private eventIdToAutoSelect: number | null = null;
  private studentNumberToMark: string | null = null;
  private autoMarkAttended: boolean = false;

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
  currentStudentNumber: any;
  attendanceStats = {
  totalRegistered: 0,
  totalAttended: 0,
  attendanceRate: 0
};

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<AttendanceRegisterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data) {
      this.eventIdToAutoSelect = data.eventId || null;
      this.studentNumberToMark = data.studentNumber || null;
      this.autoMarkAttended = data.autoMarkAttended || false;
    }
  }

  ngOnInit(): void {
    this.loadEvents();
  }

  // Add this method to calculate attendance stats
private updateAttendanceStats(): void {
  const total = this.dataSource.data.length;
  const attended = this.dataSource.data.filter(r => r.attended).length;
  const rate = total > 0 ? Math.round((attended / total) * 100) : 0;

  this.attendanceStats = {
    totalRegistered: total,
    totalAttended: attended,
    attendanceRate: rate
  };
}

private autoMarkCurrentUserAsAttended(): void {
  if (!this.studentNumberToMark || !this.selectedEvent) return;

  const currentUserRecord = this.dataSource.data.find(
    record => record.student_number === this.studentNumberToMark
  );

  if (currentUserRecord && !currentUserRecord.attended) {
    console.log('✅ Auto-marking user as attended:', this.studentNumberToMark);
    this.markAttendance(currentUserRecord, true);
  } else if (currentUserRecord?.attended) {
    console.log('ℹ️ User already marked as attended');
    this.snackBar.open('You are already marked as attended for this event', 'Close', { 
      duration: 3000,
      panelClass: ['green-snackbar']
    });
  } else {
    console.log('⚠️ User record not found in attendance list');
    this.snackBar.open('Your registration is being processed. Please wait a moment and try again.', 'Close', { 
      duration: 5000,
      panelClass: ['orange-snackbar']
    });
  }
}

  // In your AttendanceRegisterComponent, add this method:

markAttendance(record: AttendanceRecord, attended: boolean): void {
  // Use the numeric id field (98)
  const attendanceId = record.attendance_id;
  
  if (!attendanceId || attendanceId === 0) {
    this.snackBar.open('Invalid attendance record ID', 'Close', { 
      duration: 3000,
      panelClass: ['red-snackbar']
    });
    return;
  }

  console.log('📝 Marking attendance with numeric ID:', {
    attendance_id: attendanceId,
    student_number: record.student_number,
    attended: attended
  });

  // Show loading state
  const originalAttendedState = record.attended;
  const originalSignedAt = record.signed_at;

  // Optimistically update the UI
  record.attended = attended;
  if (attended) {
    record.signed_at = new Date().toISOString();
  } else {
    record.signed_at = null;
  }

  // Refresh the data source to reflect changes
  this.dataSource.data = [...this.dataSource.data];

  this.authService.markAttendance(attendanceId, attended).subscribe({
    next: (response: any) => {
      if (response.success) {
        this.updateAttendanceStats(); // Add this line
        this.snackBar.open(
          attended ? 'Attendance marked successfully!' : 'Attendance removed successfully!', 
          'Close', { 
            duration: 3000,
            panelClass: ['green-snackbar']
          }
        );

      
        
        console.log('✅ Attendance updated successfully:', response);
        
        // Update the record with server response
        if (response.data) {
          record.attended = response.data.attended;
          record.signed_at = response.data.signed_at;
          this.dataSource.data = [...this.dataSource.data];
        }
      } else {
        // Revert on error
        this.revertAttendanceRecord(record, originalAttendedState, originalSignedAt);
        this.snackBar.open(response.message || 'Failed to update attendance', 'Close', { 
          duration: 3000,
          panelClass: ['red-snackbar']
        });
      }
    },
    error: (error) => {
      console.error('❌ Error marking attendance:', error);
      
      // Revert on error
      this.revertAttendanceRecord(record, originalAttendedState, originalSignedAt);
      
      const errorMsg = error.error?.message || error.message || 'Failed to update attendance';
      this.snackBar.open(errorMsg, 'Close', { 
        duration: 5000,
        panelClass: ['red-snackbar']
      });
    }
  });
}

// Helper method to revert attendance record
private revertAttendanceRecord(record: AttendanceRecord, attended: boolean, signedAt: string | null): void {
  record.attended = attended;
  record.signed_at = signedAt;
  this.dataSource.data = [...this.dataSource.data];
}

loadEvents(): void {
  this.loading = true;
  this.authService.getAttendanceRegisters().subscribe({
    next: (res) => {
      this.loading = false;
      if (res.success) {
        this.events = res.data;
        
        if (this.eventIdToAutoSelect && this.autoMarkAttended) {
          setTimeout(() => {
            this.loadEventDetails(this.eventIdToAutoSelect!);
          }, 100);
        }
      }
    },
    error: () => {
      this.loading = false;
      this.snackBar.open('Error loading events', 'Close', { duration: 3000 });
    }
  });
}

  // Helper method to generate initials from name
  private getInitials(student: any): string {
    if (!student) return '';

    const firstName = student.first_names || student.firstName || student.name?.split(' ')[0] || '';
    const lastName = student.surname || student.lastName || student.name?.split(' ').slice(-1)[0] || '';

    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }

  // Get total registered count
  getTotalRegistered(): number {
    return this.dataSource.data.length;
  }

  // Get attended count
  getAttendedCount(): number {
    return this.dataSource.data.filter(record => record.attended).length;
  }

  // Get attendance percentage
  getAttendancePercentage(): string {
    const total = this.getTotalRegistered();
    const attended = this.getAttendedCount();
    if (total === 0) return '0%';
    return ((attended / total) * 100).toFixed(1) + '%';
  }

loadEventDetails(eventId: number): void {
  if (this.selectedEvent?.event_id === eventId) {
    this.selectedEvent = null;
    this.dataSource.data = [];
    return;
  }

  this.selectedEvent = this.events.find(e => e.event_id === eventId) || null;
  if (!this.selectedEvent) {
    this.snackBar.open('Event not found', 'Close', { duration: 3000 });
    return;
  }

  this.loading = true;

  this.authService.getEventAttendanceDetails(eventId).subscribe({
    next: (res: any) => {
      this.loading = false;
      console.log('Attendance API Response:', res);

      if (res.success && res.data && Array.isArray(res.data)) {
        const attendanceData = res.data.map((record: any, index: number) => {
          const studentData = record.student_details || record.student || {};
          
          return {
            no: index + 1,
            attendance_id: record.id, // Use numeric id (98) instead of _id
            attended: record.attended || false,
            signed_at: record.signed_at || record.signedAt || null,
            student_id: record.student_id || studentData.id || 0,
            student_title: studentData.title || '',
            initials: studentData.initials || this.getInitials(studentData),
            student_number: studentData.student_number || '',
            first_names: studentData.first_names || '',
            surname: studentData.surname || '',
            guest_name: this.selectedEvent?.guest_name || '',
            isCurrentUser: studentData.student_number === this.currentStudentNumber
          };
        });

        console.log('Processed attendance data with numeric IDs:', attendanceData);
        this.dataSource.data = attendanceData;
        this.updateAttendanceStats();

        if (this.autoMarkAttended && this.studentNumberToMark) {
          setTimeout(() => {
            this.autoMarkCurrentUserAsAttended();
          }, 500);
        }
      }
    },
    error: (error) => {
      this.loading = false;
      this.snackBar.open('Error loading attendance', 'Close', { 
        duration: 3000
      });
    }
  });
}

  getFullName(record: AttendanceRecord): string {
    return [record.student_title, record.first_names, record.surname]
      .filter(Boolean)
      .join(' ')
      .trim();
  }

  // Format date for display (e.g., 'Monday, January 1, 2023')
  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      console.error('Error formatting date:', e);
      return dateString;
    }
  }

  // Format date and time for signature timestamp
  formatDateTime(dateTimeString: string): string {
    if (!dateTimeString) return 'Not signed';
    
    try {
      const date = new Date(dateTimeString);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (e) {
      console.error('Error formatting date/time:', e);
      return dateTimeString;
    }
  }

  // Export to CSV
  exportToCsv(): void {
    if (this.dataSource.data.length === 0) {
      this.snackBar.open('No data to export', 'Close', { duration: 3000 });
      return;
    }

    const headers = [
      'No', 
      'Student Number', 
      'Title', 
      'First Names', 
      'Surname', 
      'Initials', 
      'Attended', 
      'Signed At',
      'Event Title',
      'Event Date',
      'Guest Name'
    ];

    const csvData = this.dataSource.data.map(record => [
      record.no,
      record.student_number,
      record.student_title,
      record.first_names,
      record.surname,
      record.initials,
      record.attended ? 'Yes' : 'No',
      this.formatDateTime(record.signed_at || ''),
      this.selectedEvent?.event_title || '',
      this.formatDate(this.selectedEvent?.event_date || ''),
      this.selectedEvent?.guest_name || ''
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    this.downloadFile(csvContent, 'csv', 'text/csv');
  }

  // Export to Excel
  exportToExcel(): void {
    if (this.dataSource.data.length === 0) {
      this.snackBar.open('No data to export', 'Close', { duration: 3000 });
      return;
    }

    // Create HTML table for Excel
    const tableHtml = this.generateExcelHtml();
    
    // Create Excel file with HTML table
    const excelContent = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
        <head>
          <meta charset="UTF-8">
          <title>Attendance Register</title>
          <!--[if gte mso 9]>
          <xml>
            <x:ExcelWorkbook>
              <x:ExcelWorksheets>
                <x:ExcelWorksheet>
                  <x:Name>${this.selectedEvent?.event_title || 'Attendance'}</x:Name>
                  <x:WorksheetOptions>
                    <x:DisplayGridlines/>
                  </x:WorksheetOptions>
                </x:ExcelWorksheet>
              </x:ExcelWorksheets>
            </x:ExcelWorkbook>
          </xml>
          <![endif]-->
        </head>
        <body>
          ${tableHtml}
        </body>
      </html>
    `;

    this.downloadFile(excelContent, 'xls', 'application/vnd.ms-excel');
  }

  // Generate HTML table for Excel export
  private generateExcelHtml(): string {
    const eventInfo = this.selectedEvent ? `
      <h2>${this.selectedEvent.event_title} - Attendance Register</h2>
      <p><strong>Event Type:</strong> ${this.selectedEvent.event_type}</p>
      <p><strong>Event Date:</strong> ${this.formatDate(this.selectedEvent.event_date)}</p>
      <p><strong>Guest:</strong> ${this.selectedEvent.guest_name || 'N/A'}</p>
      <p><strong>Export Date:</strong> ${new Date().toLocaleDateString()}</p>
      <br>
    ` : '';

    let tableHtml = `
      ${eventInfo}
      <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse;">
        <thead>
          <tr style="background-color: #f5f5f5; font-weight: bold;">
            <th>No</th>
            <th>Student Number</th>
            <th>Title</th>
            <th>First Names</th>
            <th>Surname</th>
            <th>Initials</th>
            <th>Attended</th>
            <th>Signed At</th>
          </tr>
        </thead>
        <tbody>
    `;

    this.dataSource.data.forEach(record => {
      tableHtml += `
        <tr>
          <td>${record.no}</td>
          <td>${record.student_number}</td>
          <td>${record.student_title}</td>
          <td>${record.first_names}</td>
          <td>${record.surname}</td>
          <td>${record.initials}</td>
          <td>${record.attended ? 'Yes' : 'No'}</td>
          <td>${this.formatDateTime(record.signed_at || '')}</td>
        </tr>
      `;
    });

    tableHtml += `
        </tbody>
      </table>
      <br>
      <p><strong>Total Records:</strong> ${this.getTotalRegistered()}</p>
      <p><strong>Attended Count:</strong> ${this.getAttendedCount()}</p>
      <p><strong>Attendance Rate:</strong> ${this.getAttendancePercentage()}</p>
    `;

    return tableHtml;
  }

  // Download file utility
  private downloadFile(content: string, extension: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    const eventTitle = this.selectedEvent?.event_title?.replace(/[^a-zA-Z0-9]/g, '_') || 'attendance';
    const timestamp = new Date().toISOString().split('T')[0];
    link.download = `${eventTitle}_attendance_${timestamp}.${extension}`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    this.snackBar.open(`Exported successfully as ${extension.toUpperCase()}`, 'Close', { 
      duration: 3000,
      panelClass: ['green-snackbar']
    });
  }

  // Print attendance register
  printAttendance(): void {
    if (this.dataSource.data.length === 0) {
      this.snackBar.open('No data to print', 'Close', { duration: 3000 });
      return;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      this.snackBar.open('Popup blocked. Please allow popups to print.', 'Close', { duration: 5000 });
      return;
    }

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Attendance Register - ${this.selectedEvent?.event_title}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; border-bottom: 2px solid #333; padding-bottom: 10px; }
            .event-info { margin-bottom: 20px; padding: 15px; background: #f9f9f9; border-radius: 5px; }
            .event-info p { margin: 5px 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; font-weight: bold; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            .summary { margin-top: 20px; padding: 15px; background: #f0f8ff; border-radius: 5px; }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <h1>Attendance Register</h1>
          
          <div class="event-info">
            <p><strong>Event:</strong> ${this.selectedEvent?.event_title}</p>
            <p><strong>Type:</strong> ${this.selectedEvent?.event_type}</p>
            <p><strong>Date:</strong> ${this.formatDate(this.selectedEvent?.event_date || '')}</p>
            <p><strong>Guest:</strong> ${this.selectedEvent?.guest_name || 'N/A'}</p>
            <p><strong>Printed:</strong> ${new Date().toLocaleString()}</p>
          </div>

          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Student No.</th>
                <th>Title</th>
                <th>First Names</th>
                <th>Surname</th>
                <th>Initials</th>
                <th>Attended</th>
                <th>Signed At</th>
              </tr>
            </thead>
            <tbody>
              ${this.dataSource.data.map(record => `
                <tr>
                  <td>${record.no}</td>
                  <td>${record.student_number}</td>
                  <td>${record.student_title}</td>
                  <td>${record.first_names}</td>
                  <td>${record.surname}</td>
                  <td>${record.initials}</td>
                  <td>${record.attended ? '✓' : '✗'}</td>
                  <td>${this.formatDateTime(record.signed_at || '')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="summary">
            <p><strong>Total Registered:</strong> ${this.getTotalRegistered()}</p>
            <p><strong>Total Attended:</strong> ${this.getAttendedCount()}</p>
            <p><strong>Attendance Rate:</strong> ${this.getAttendancePercentage()}</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  }

  closeModal(): void {
    this.dialogRef.close();
  }
}