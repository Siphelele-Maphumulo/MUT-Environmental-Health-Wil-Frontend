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

interface StaffResponse {
  id: number;
  email: string;
  title: string;
  created_at: string;
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
  selector: 'app-staff-management',
  templateUrl: './staff-management.component.html',
  styleUrls: ['./staff-management.component.scss'],
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
export class StaffManagementComponent implements OnInit, AfterViewInit {
  displayedColumns = ['title', 'email', 'created_at', 'actions'];
  dataSource = new MatTableDataSource<StaffResponse>();
  isLoading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  searchText = '';

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.setupFilter();
    this.fetchStaff();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  private setupFilter() {
    this.dataSource.filterPredicate = (data, filter) => {
      const term = filter.trim().toLowerCase();
      return (
        data.title.toLowerCase().includes(term) ||
        data.email.toLowerCase().includes(term)
      );
    };
  }

  applyFilter(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.searchText = val;
    this.dataSource.filter = val.trim().toLowerCase();

    // Reset to first page whenever filter changes
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  async fetchStaff() {
    this.isLoading = true;
    try {
      const resp = await lastValueFrom(
        this.http.get<{ success: boolean; data: StaffResponse[] }>(
          'http://localhost:8080/api/staff'
        )
      );
      this.dataSource.data = resp.success ? resp.data : [];
    } catch (err) {
      console.error(err);
      this.showErrorSnackbar('Could not load staff list.');
    } finally {
      this.isLoading = false;
    }
  }

  deleteStaff(task: StaffResponse) {
    if (!confirm(`Delete staff: ${task.title}?`)) return;

    this.http.delete(`http://localhost:8080/api/staff/${task.id}`).subscribe({
      next: () => {
        this.dataSource.data = this.dataSource.data.filter(
          (s) => s.id !== task.id
        );
        this.snackBar.open('Staff deleted.', 'Close', { duration: 3000 });
      },
      error: (e) => {
        console.error(e);
        this.showErrorSnackbar('Delete failed.');
      },
    });
  }

  showErrorSnackbar(msg: string) {
    this.snackBar.open(msg, 'Close', { duration: 3000 });
  }
}
