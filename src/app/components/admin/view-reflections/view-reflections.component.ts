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
import { StudentReflection } from '../../../services/auth.service';
import { MatNativeDateModule, MatOption } from "@angular/material/core";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { StudentReflectionComponent } from '../student-reflection/student-reflection.component';

@Component({
  selector: 'app-view-reflections',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule
  ],
  templateUrl: './view-reflections.component.html',
  styleUrls: ['./view-reflections.component.scss'],
})
export class ViewReflectionsComponent implements OnInit {
  reflections: StudentReflection[] = [];
  filteredReflections: StudentReflection[] = [];
  isLoading = true;

  // Filters
  studentNumberFilter: string = '';
  studentNameFilter: string = '';
  levelOfStudyFilter: string = '';
  fromDateFilter: Date | null = null;
  toDateFilter: Date | null = null;

  // Table columns
  displayedColumns: string[] = [
    'student_number',
    'student_name',
    'level_of_study',
    'feeling',
    'success',
    'challenges',
    'perspective_change',
    'suggestions',
    'created_at',
    'actions',
  ];

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.fetchReflections();
  }

  /**
   * Fetch all student reflections from the backend
   */
  fetchReflections(): void {
    this.isLoading = true;

    this.authService.getAllReflections().subscribe({
      next: (data: StudentReflection[]) => {
        this.reflections = data;
        this.filteredReflections = [...data];
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

  /**
   * Apply filters to the reflections list
   */
  applyFilters(): void {
    const studentNumber = this.studentNumberFilter.toLowerCase().trim();
    const studentName = this.studentNameFilter.toLowerCase().trim();
    const level = this.levelOfStudyFilter.trim();
    const fromDate = this.fromDateFilter ? new Date(this.fromDateFilter).setHours(0, 0, 0, 0) : null;
    const toDate = this.toDateFilter ? new Date(this.toDateFilter).setHours(23, 59, 59, 999) : null;

    this.filteredReflections = this.reflections.filter((reflection) => {
      const matchesNumber = !studentNumber || reflection.student_number.toLowerCase().includes(studentNumber);
      const matchesName = !studentName || reflection.student_name.toLowerCase().includes(studentName);
      const matchesLevel = !level || reflection.level_of_study === level;

      const createdAt = new Date(reflection.created_at).getTime();
      const matchesFrom = !fromDate || createdAt >= fromDate;
      const matchesTo = !toDate || createdAt <= toDate;

      return matchesNumber && matchesName && matchesLevel && matchesFrom && matchesTo;
    });
  }

  /**
   * Reset all filters and show all reflections
   */
  clearFilters(): void {
    this.studentNumberFilter = '';
    this.studentNameFilter = '';
    this.levelOfStudyFilter = '';
    this.fromDateFilter = null;
    this.toDateFilter = null;
    this.filteredReflections = [...this.reflections];
  }

  /**
   * Navigate to view single reflection
   * @param id Reflection ID
   */
viewReflection(id: number): void {
  const dialogRef = this.dialog.open(StudentReflectionComponent, {
    width: '80vw',
    height: '95vh',
    maxWidth: '100vw',
    panelClass: 'fullscreen-dialog', // apply custom CSS
    data: { reflectionId: id },
    disableClose: false,
    autoFocus: false
  });

  dialogRef.afterClosed().subscribe(() => {
    // Optionally refresh data if needed
    this.fetchReflections();
  });
}


  /**
   * Delete a reflection after confirmation
   * @param id Reflection ID
   */
  deleteReflection(id: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirm Deletion',
        message: 'Are you sure you want to delete this reflection?',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.authService.deleteReflection(id).subscribe({
          next: () => {
            this.snackBar.open('Reflection deleted successfully!', 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar'],
            });
            this.fetchReflections(); // Refresh after delete
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
    });
  }
}
