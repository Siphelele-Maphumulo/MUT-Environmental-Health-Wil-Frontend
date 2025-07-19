import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';

interface StudentApiResponse {
  id: number;
  student_name: string;
  email: string;
  status: 'Active' | 'Inactive' | 'Suspended' | 'Unenrolled';
}

interface TableStudent {
  student_number: string;
  name: string;
  email: string;
  status: 'Active' | 'Inactive' | 'Suspended' | 'Unenrolled';
}


interface StudentInfo {
  fullName: string;
  student_number: string;
}

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
  standalone: true,
  imports: [
    MatProgressSpinnerModule,
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatDividerModule,
    FormsModule,
  ],
})
export class UserManagementComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'student_number',
    'learner',
    'email',
    'status',
    'actions',
  ];
  dataSource = new MatTableDataSource<TableStudent>();
  isLoading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  searchText: string = '';
  selectedView: string = 'all';

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    // Setup custom filter predicate BEFORE fetching students
    this.dataSource.filterPredicate = (data: TableStudent, filter: string) => {
      let parsedFilter: { searchText: string; selectedView: string };

      try {
        parsedFilter = JSON.parse(filter);
      } catch {
        parsedFilter = { searchText: '', selectedView: 'all' };
      }

      const searchText = parsedFilter.searchText.toLowerCase();
      const selectedView = parsedFilter.selectedView.toLowerCase();

      const matchesSearch =
        data.name.toLowerCase().includes(searchText) ||
        data.student_number.includes(searchText) ||
        data.email.toLowerCase().includes(searchText);

      const matchesStatus =
        selectedView === 'all' ||
        data.status.toLowerCase() === selectedView;

      return matchesSearch && matchesStatus;
    };

    this.fetchStudents();
  }

ngAfterViewInit(): void {
  this.dataSource.paginator = this.paginator;
}

  private applyCombinedFilter() {
    const filterValue = {
      searchText: this.searchText.trim().toLowerCase(),
      selectedView: this.selectedView,
    };
    this.dataSource.filter = JSON.stringify(filterValue);
  }

  applyViewFilter(view: string) {
    this.selectedView = view;
    this.applyCombinedFilter();
  }

  applyFilter(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;
    this.searchText = inputValue;
    this.applyCombinedFilter();
  }

async fetchStudents(): Promise<void> {
  this.isLoading = true;

  try {
    // Step 1: Auto-update inactive students
    await lastValueFrom(
      this.http.post('https://mut-environmental-health-wil-backend.onrender.com /api/update-status-for-inactive-students', {})
    );
    console.log('Checked and updated inactive students if needed.');

    // Step 2: Fetch student data
    const response = await lastValueFrom(
      this.http.get<{ success: boolean; data: StudentApiResponse[] }>(
        'https://mut-environmental-health-wil-backend.onrender.com /api/students'
      )
    );

    if (!response.success || !response.data) {
      this.dataSource.data = [];
      this.isLoading = false;
      return;
    }

    const mappedData: TableStudent[] = await Promise.all(
      response.data.map(async (student) => {
        const studentNumber = student.email.split('@')[0];

        try {
          const res = await lastValueFrom(
            this.http.get<{ fullName: string }>(
              `https://mut-environmental-health-wil-backend.onrender.com /api/student/${studentNumber}`
            )
          );

          return {
            student_number: studentNumber,
            name: res.fullName,
            email: student.email,
            status: student.status,
          };
        } catch {
          return {
            student_number: studentNumber,
            name: 'Unknown',
            email: student.email,
            status: student.status,
          };
        }
      })
    );

    this.dataSource.data = mappedData;

    // Assign paginator after data is set
    setTimeout(() => {
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }
    });

    this.applyCombinedFilter();

  } catch (error) {
    console.error('Error fetching or updating students:', error);
    this.showErrorSnackbar('Something went wrong while loading student data.');
  } finally {
    this.isLoading = false;
  }
}


  suspendStudent(student: TableStudent) {
    if (!confirm(`Are you sure you want to suspend ${student.name}?`)) return;

    this.http
      .post(
        `https://mut-environmental-health-wil-backend.onrender.com /api/suspend-student/${student.student_number}`,
        {}
      )
      .subscribe({
        next: () => {
          this.showSuccessSnackbar('Student suspended successfully');
          this.fetchStudents();
        },
        error: (err) => {
          this.showErrorSnackbar('Failed to suspend student');
          console.error(err);
        },
      });
  }

  unenrollStudent(student: TableStudent) {
    if (!confirm(`Are you sure you want to unenroll ${student.name}?`)) return;

    this.http
      .post(
        `https://mut-environmental-health-wil-backend.onrender.com /api/unenroll-student/${student.student_number}`,
        {}
      )
      .subscribe({
        next: () => {
          this.showSuccessSnackbar('Student unenrolled successfully');
          this.fetchStudents();
        },
        error: (err) => {
          this.showErrorSnackbar('Failed to unenroll student');
          console.error(err);
        },
      });
  }

  enrollStudent(student: TableStudent) {
    if (!confirm(`Are you sure you want to enroll ${student.name}?`)) return;

    this.http
      .post(
        `https://mut-environmental-health-wil-backend.onrender.com /api/enroll-student/${student.student_number}`,
        {}
      )
      .subscribe({
        next: () => {
          this.showSuccessSnackbar('Student enrolled successfully');
          this.fetchStudents();
        },
        error: (err) => {
          this.showErrorSnackbar('Failed to enroll student');
          console.error(err);
        },
      });
  }

  private showSuccessSnackbar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar'],
    });
  }

  private showErrorSnackbar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar'],
    });
  }
}

