import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';

export interface StudentPlacement {
  _id?: string;
  id?: number;
  student_number: number | string;
  student_name: string;
  supervisor: string;
  municipality: string;
  email: string;
  cell_number: number | string;
  hospital: string;
  abattoir: string;
  created_at: string;
}

@Component({
  selector: 'app-view-Placements',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    FormsModule, // ✅ Add this line
    MatDialogModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './view-placements.component.html',
  styleUrls: ['./view-placements.component.scss'],
})
export class ViewPlacementsComponent implements OnInit {
  placements: StudentPlacement[] = [];
  filteredPlacements: StudentPlacement[] = [];

  displayedColumns: string[] = [
    'student_number',
    'student_name',
    'supervisor',
    'municipality',
    'email',
    'cell_number',
    'hospital',
    'abattoir', // Correct spelling
    'created_at',
    'actions',
  ];

  isLoading = true;

  studentNumberFilter: string = '';
  studentNameFilter: string = '';
  municipalityFilter: string = '';
  hospitalFilter: string = '';

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPlacements();
  }

loadPlacements(): void {
  this.isLoading = true;
  this.authService.getAllPlacements().subscribe({
    next: (response: any[]) => {
      console.log('✅ Raw placements data from API:', response);
      
      // Check if placements have IDs
      response.forEach((placement, index) => {
        console.log(`Placement ${index}: ID = ${placement.id}, _id = ${placement._id}`);
      });
      
      this.placements = response;
      this.filteredPlacements = [...this.placements];
      
      console.log('✅ Loaded placements:', this.placements.length);
      this.isLoading = false;
    },
    error: (error) => {
      console.error('❌ Error loading Placements:', error);
      this.snackBar.open('Failed to load Placements. Please try again later.', 'Close', {
        duration: 5000,
        panelClass: ['error-snackbar'],
      });
      this.isLoading = false;
    },
  });
}

  applyFilters(): void {
    const studentNumber = this.studentNumberFilter?.toLowerCase().trim() || '';
    const studentName = this.studentNameFilter?.toLowerCase().trim() || '';
    const municipality = this.municipalityFilter?.toLowerCase().trim() || '';
    const hospital = this.hospitalFilter?.toLowerCase().trim() || '';

    this.filteredPlacements = this.placements.filter(
      (item) =>
        (!studentNumber ||
          String(item.student_number).toLowerCase().includes(studentNumber)) &&
        (!studentName ||
          item.student_name.toLowerCase().includes(studentName)) &&
        (!municipality ||
          item.municipality.toLowerCase().includes(municipality)) &&
        (!hospital || item.hospital.toLowerCase().includes(hospital))
    );
  }

// Update the method signatures to accept string or number
viewPlacement(id: number | string | undefined): void {
  if (!id) {
    console.error('Cannot view placement: ID is undefined');
    this.snackBar.open('Cannot view placement: ID is missing', 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar'],
    });
    return;
  }

  console.log(`Navigating to placement with ID: ${id} (type: ${typeof id})`);
  this.router.navigate(['/placements', id.toString()]);
}

deletePlacement(id: number | string | undefined): void {
  if (!id) {
    console.error('Cannot delete placement: ID is undefined');
    this.snackBar.open('Cannot delete placement: ID is missing', 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar'],
    });
    return;
  }

  if (!confirm('Are you sure you want to delete this placement? This action cannot be undone.')) return;

  this.authService.deletePlacement(id).subscribe({
    next: () => {
      this.snackBar.open('Placement deleted successfully!', 'Close', {
        duration: 3000,
        panelClass: ['success-snackbar'],
      });
      this.loadPlacements(); // Reload the placements list
    },
    error: (err) => {
      console.error('Delete placement error:', err);
      let errorMessage = 'Failed to delete placement.';
      
      if (err.error?.message) {
        errorMessage = err.error.message;
      } else if (err.status === 404) {
        errorMessage = 'Placement not found. It may have already been deleted.';
      } else if (err.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      }
      
      this.snackBar.open(errorMessage, 'Close', {
        duration: 5000,
        panelClass: ['error-snackbar'],
      });
    },
  });
}


  clearFilters(): void {
    this.studentNumberFilter = '';
    this.studentNameFilter = '';
    this.municipalityFilter = '';
    this.hospitalFilter = '';
    this.applyFilters();
  }
}
