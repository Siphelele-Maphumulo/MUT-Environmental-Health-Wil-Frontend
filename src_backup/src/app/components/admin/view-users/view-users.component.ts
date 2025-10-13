import { Component, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';

interface StudentApiResponse {
  id: number;
  student_name: string;
  email: string;
  created_at: string;
  status: 'Active' | 'Inactive';
}

interface TableStudent {
  student_number: string;
  name: string;
  email: string;
  status: 'Active' | 'Inactive';
}

@Component({
  selector: 'app-view-users',
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
  templateUrl: './view-users.component.html',
  styleUrls: ['./view-users.component.scss'],
})
export class ViewUsersComponent implements AfterViewInit {
  displayedColumns: string[] = [
    'student_number',
    'name',
    'email',
    'status',
    'actions',
  ];
  dataSource = new MatTableDataSource<TableStudent>();
  isLoading = true;

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  ngAfterViewInit() {
    this.fetchStudents();
  }

  fetchStudents(): void {
    this.isLoading = true;
    this.http
      .get<{ success: boolean; data: StudentApiResponse[] }>(
        'http://localhost:8080/api/students'
      )
      .subscribe({
        next: (res) => {
          if (res.success && res.data) {
            this.dataSource.data = res.data.map((student) => ({
              student_number: student.id.toString(),
              name: student.student_name,
              email: student.email,
              status: student.status,
            }));
          } else {
            this.dataSource.data = [];
          }
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Failed to load students:', err);
          this.showSnackbar('Error loading students');
          this.isLoading = false;
        },
      });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.dataSource.filter = filterValue;
  }

  suspendStudent(student: TableStudent): void {
    if (!confirm(`Are you sure you want to suspend ${student.name}?`)) return;

    // Replace with actual suspend API
    this.http
      .post(
        `http://localhost:8080/api/suspend-student/${student.student_number}`,
        {}
      )
      .subscribe({
        next: () => {
          this.showSnackbar('Student suspended successfully');
          this.fetchStudents(); // Refresh list
        },
        error: (err) => {
          console.error('Failed to suspend student:', err);
          this.showSnackbar('Failed to suspend student');
        },
      });
  }

  private showSnackbar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['info-snackbar'],
    });
  }
}
