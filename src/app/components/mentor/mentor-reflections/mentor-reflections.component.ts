
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

export interface StudentReflection {
  // id: number;
  student_number: string;
  student_name: string;
  feeling: string;
  success: string;
  challenges: string;
  perspective_change: string;
  suggestions: string;
  created_at: string; // <-- Add this line
}

@Component({
  selector: 'app-mentor-reflections',
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
  templateUrl: './mentor-reflections.component.html',
  styleUrl: './mentor-reflections.component.scss'
})
export class MentorReflectionsComponent implements OnInit {
  reflections: StudentReflection[] = [];
  filteredReflections: StudentReflection[] = [];

  displayedColumns: string[] = [
    'student_number',
    'student_name',
    'feeling',
    'success',
    'challenges',
    'perspective_change',
    'suggestions',
    'created_at',
    'actions',
  ];

  isLoading = true;

  studentNumberFilter: string = '';
  studentNameFilter: string = '';

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadReflections();
  }

  loadReflections(): void {
    this.isLoading = true;

    this.authService.getAllReflections().subscribe({
      next: (response: any) => {
        this.reflections = response;
        this.filteredReflections = [...this.reflections];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading reflections:', error);
        this.snackBar.open('Failed to load reflections.', 'Close', {
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

    this.filteredReflections = this.reflections.filter(
      (item) =>
        (!studentNumber ||
          item.student_number.toLowerCase().includes(studentNumber)) &&
        (!studentName || item.student_name.toLowerCase().includes(studentName))
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
        this.loadReflections(); // Reload after deletion
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
    this.applyFilters();
  }
}
