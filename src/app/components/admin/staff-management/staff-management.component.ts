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
  id: string;
  staff_id: string;
  title: string;
  email: string;
  created_at: string;
  // Additional fields we'll fetch for detailed view
  first_names?: string;
  surname?: string;
  department?: string;
  position?: string;
  status?: string;
  last_login?: string;
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
  displayedColumns = ['title', 'email', 'position', 'status', 'created_at', 'actions'];
  dataSource = new MatTableDataSource<StaffResponse>();
  isLoading = false;

  // Position options
  positionOptions = [
    { value: 'admin', label: 'Admin' },
    { value: 'staff', label: 'Staff' },
    { value: 'secretary', label: 'Secretary' },
    { value: 'researcher', label: 'Researcher' }
  ];

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
  this.dataSource.filterPredicate = (data: StaffResponse, filter: string): boolean => {
    const term = filter.trim().toLowerCase();
    return !!(
      (data.first_names?.toLowerCase() || '').includes(term) ||
      (data.surname?.toLowerCase() || '').includes(term) ||
      (data.email?.toLowerCase() || '').includes(term) ||
      (data.department?.toLowerCase() || '').includes(term) ||
      (data.position?.toLowerCase() || '').includes(term)
    );
  };
}

  applyFilter(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.searchText = val;
    this.dataSource.filter = val.trim().toLowerCase();

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
      
      if (resp.success) {
        this.dataSource.data = resp.data;
        
        // Fetch additional details for each staff member
        await this.fetchStaffDetails();
      }
    } catch (err) {
      console.error('Error loading staff:', err);
      this.showErrorSnackbar('Could not load staff list.');
    } finally {
      this.isLoading = false;
    }
  }

  // Fetch detailed information for each staff member
  async fetchStaffDetails(): Promise<void> {
    try {
      const detailedStaff = await lastValueFrom(
        this.http.get<any[]>(
          'http://localhost:8080/api/staff-users'
        )
      );

      // Merge detailed information with basic staff data
      this.dataSource.data = this.dataSource.data.map(staff => {
        const detailedInfo = detailedStaff.find(ds => ds._id?.toString() === staff.id || ds.staff_id?.toString() === staff.staff_id);
        return {
          ...staff,
          first_names: detailedInfo?.first_names,
          surname: detailedInfo?.surname,
          department: detailedInfo?.department,
          position: detailedInfo?.position || 'staff', // Default to 'staff' if not set
          status: detailedInfo?.status,
          last_login: detailedInfo?.last_login
        };
      });
    } catch (error) {
      console.warn('Could not fetch detailed staff information, using basic data');
    }
  }

  // Update staff position
  async updateStaffPosition(staff: StaffResponse, newPosition: string): Promise<void> {
    if (staff.position === newPosition) {
      return; // No change needed
    }

    try {
      // Use staff_id for the update
      const staffId = staff.staff_id || staff.id;
      
      const response = await lastValueFrom(
        this.http.put<any>(
          `http://localhost:8080/api/staff/${staffId}/position`,
          { position: newPosition }
        )
      );

      if (response.success) {
        // Update local data
        const index = this.dataSource.data.findIndex(s => s.id === staff.id);
        if (index !== -1) {
          this.dataSource.data[index].position = newPosition;
          this.dataSource.data = [...this.dataSource.data]; // Trigger change detection
        }

        this.snackBar.open(`Position updated to ${this.getPositionLabel(newPosition)}`, 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });

        console.log(`✅ Position updated for ${staff.email}: ${staff.position} -> ${newPosition}`);
      }
    } catch (error: any) {
      console.error('Error updating staff position:', error);
      let errorMessage = 'Failed to update position';
      
      if (error.error?.message) {
        errorMessage = error.error.message;
      }

      this.showErrorSnackbar(errorMessage);
    }
  }

  // Get position label for display
  getPositionLabel(position: string): string {
    const option = this.positionOptions.find(opt => opt.value === position);
    return option ? option.label : position;
  }

  // Get full name for display
  getFullName(staff: StaffResponse): string {
    if (staff.first_names && staff.surname) {
      return `${staff.title} ${staff.first_names} ${staff.surname}`;
    }
    return staff.title; // Fallback to title if names not available
  }

  deleteStaff(staff: StaffResponse) {
    if (!confirm(`Delete staff: ${this.getFullName(staff)}?`)) return;

    const staffId = staff.staff_id || staff.id;
    
    this.http.delete(`http://localhost:8080/api/staff/${staffId}`).subscribe({
      next: () => {
        this.dataSource.data = this.dataSource.data.filter(
          (s) => s.id !== staff.id
        );
        this.snackBar.open('Staff deleted successfully.', 'Close', { 
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      },
      error: (e) => {
        console.error(e);
        this.showErrorSnackbar('System failed to delete staff. Please try again.');
      },
    });
  }

  showErrorSnackbar(msg: string) {
    this.snackBar.open(msg, 'Close', { 
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }
}