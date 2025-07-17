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
  // id: number;
  student_number: string;
  student_name: string;
  supervisor: string;
  municipality: string;
  email: string;
  cell_number: string;
  hospital: string;
  abattoir: string;
  created_at: string; // <-- Add this line
}

@Component({
  selector: 'app-mentor-placements',
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
  templateUrl: './mentor-placements.component.html',
  styleUrl: './mentor-placements.component.scss'
})
export class MentorPlacementsComponent implements OnInit {
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
        this.placements = response;
        this.filteredPlacements = [...this.placements];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading Placements:', error);
        this.snackBar.open('Failed to load Placements.', 'Close', {
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
          item.student_number.toLowerCase().includes(studentNumber)) &&
        (!studentName ||
          item.student_name.toLowerCase().includes(studentName)) &&
        (!municipality ||
          item.municipality.toLowerCase().includes(municipality)) &&
        (!hospital || item.hospital.toLowerCase().includes(hospital))
    );
  }

  viewReflection(id: number): void {
    this.router.navigate(['/reflection', id]);
  }

  deleteReflection(id: number): void {
    if (!confirm('Are you sure you want to delete this reflection?')) return;

    this.authService.deleteReflection(id).subscribe({
      next: () => {
        this.snackBar.open('Reflection deleted successfully!', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar'],
        });
        this.loadPlacements(); // Reload after deletion
      },
      error: (err) => {
        console.error('Delete error:', err);
        this.snackBar.open('Failed to delete reflection.', 'Close', {
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
