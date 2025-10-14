import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Location } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { lastValueFrom, firstValueFrom } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatChipsModule } from '@angular/material/chips';

export interface Declaration {
  id: number;
  student_name: string;
  student_number: string;
  supervisor_name: string;
  hi_number: string;
  employer: string;
  position: string;
  start_date: string;
  end_date: string;
  work_ethic: 'Good' | 'Bad';
  timeliness: 'Good' | 'Bad';
  attitude: 'Good' | 'Bad';
  dress: 'Good' | 'Bad';
  interaction: 'Good' | 'Bad';
  responsibility: 'Good' | 'Bad';
  report_writing: 'Good' | 'Bad';
  general_comments: string; // Make sure this matches your data
  supervisor_signature: string | null; // ✅ This is the correct field name
  signature_date: string;
  created_at?: string;
  submittedDate: string;
}

@Component({
  selector: 'app-mentor-declaration-letters',
  standalone: true,
  imports: [
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
    RouterModule,
    CommonModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatChipsModule,
    FormsModule,
  ],
  templateUrl: './mentor-declaration-letters.component.html',
  styleUrl: './mentor-declaration-letters.component.scss'
})
export class MentorDeclarationLettersComponent implements OnInit {
  declarations: Declaration[] = [];
  filteredDeclarations: Declaration[] = [];
  studentNameFilter: string = '';
  isLoading = true;
  currentDate = new Date();

  displayedColumns = [
    'student_number',
    'supervisor',
    'employer',
    'position',
    'dateRange',
    'evaluations',
    'comments',
    'supervisor_signature', // ✅ Changed from 'signature' to 'supervisor_signature'
    'submittedDate',
    'actions',
  ];

  // Filter controls
  studentNameControl = new FormControl('');
  startDateControl = new FormControl<Date | null>(null);
  endDateControl = new FormControl<Date | null>(null);
  supervisorControl = new FormControl('');
  hiNumberControl = new FormControl('');

  constructor(
    private http: HttpClient,
    private location: Location,
    private sanitizer: DomSanitizer,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.checkAuthentication();
    this.initScrollBehavior();
    this.fetchDeclarations();
    this.setupFilterListeners();
  }

  private checkAuthentication(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/staff-login']);
    }
  }

  private initScrollBehavior(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });

      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    }
  }

  getEvaluations(
    declaration: Declaration
  ): { label: string; value: 'Good' | 'Bad' }[] {
    return [
      { label: 'Work', value: declaration.work_ethic },
      { label: 'Time', value: declaration.timeliness },
      { label: 'Attitude', value: declaration.attitude },
      { label: 'Dress', value: declaration.dress },
      { label: 'Interact', value: declaration.interaction },
      { label: 'Responsibility', value: declaration.responsibility },
      { label: 'Report', value: declaration.report_writing },
    ];
  }

  private setupFilterListeners(): void {
    this.studentNameControl.valueChanges
      .pipe(debounceTime(300))
      .subscribe(() => this.applyFilters());

    this.startDateControl.valueChanges.subscribe(() => this.applyFilters());

    this.endDateControl.valueChanges.subscribe(() => this.applyFilters());

    this.supervisorControl.valueChanges
      .pipe(debounceTime(300))
      .subscribe(() => this.applyFilters());

    this.hiNumberControl.valueChanges
      .pipe(debounceTime(300))
      .subscribe(() => this.applyFilters());
  }

  applyFilters(): void {
    this.filteredDeclarations = this.declarations.filter(
      (declaration) =>
        this.checkStudentName(declaration.student_name) &&
        this.checkDateRange(declaration.start_date, declaration.end_date) &&
        this.checkSupervisor(declaration.supervisor_name) &&
        this.checkHINumber(declaration.hi_number)
    );
  }

  private checkStudentName(studentName: string): boolean {
    const filterValue = this.studentNameControl.value?.toLowerCase() || '';
    return !filterValue || studentName.toLowerCase().includes(filterValue);
  }

  private checkDateRange(startDate: string, endDate: string): boolean {
    const filterStart = this.startDateControl.value;
    const filterEnd = this.endDateControl.value;

    if (!filterStart && !filterEnd) return true;

    const placementStart = new Date(startDate);
    const placementEnd = new Date(endDate);

    return !(
      (filterStart && placementEnd < new Date(filterStart)) ||
      (filterEnd && placementStart > new Date(filterEnd))
    );
  }

  private checkSupervisor(supervisorName: string): boolean {
    const filterValue = this.supervisorControl.value?.toLowerCase() || '';
    return !filterValue || supervisorName.toLowerCase().includes(filterValue);
  }

  private checkHINumber(hiNumber: string): boolean {
    const filterValue = this.hiNumberControl.value?.toLowerCase() || '';
    return !filterValue || hiNumber.toLowerCase().includes(filterValue);
  }

  clearFilters(): void {
    this.studentNameControl.reset('');
    this.startDateControl.reset(null);
    this.endDateControl.reset(null);
    this.supervisorControl.reset('');
    this.hiNumberControl.reset('');
  }

  async fetchDeclarations(): Promise<void> {
    this.isLoading = true;
    try {
      const declarations = await lastValueFrom(
        this.http.get<Declaration[]>(
          'http://localhost:8080/api/declaration-letters'
        )
      );
      console.log('✅ Declaration letters loaded:', declarations.length);
      this.declarations = declarations;
      this.filteredDeclarations = [...this.declarations];
    } catch (error: any) {
      console.error('❌ Error fetching declarations:', error);
      
      let errorMessage = 'Failed to load declarations.';
      
      if (error.status === 500) {
        errorMessage = 'Server error: The backend is experiencing issues. Please check the backend logs and database connection.';
        console.error('Backend 500 error details:', {
          url: error.url,
          message: error.error?.message,
          status: error.status
        });
      } else if (error.status === 404) {
        errorMessage = 'API endpoint not found. Please verify the backend route exists.';
      } else if (error.status === 0) {
        errorMessage = 'Network error: Cannot connect to backend server. Is it running on http://localhost:8080?';
      } else if (error?.error?.message) {
        errorMessage = error.error.message;
      }
      
      this.showError(errorMessage);
      this.declarations = [];
      this.filteredDeclarations = [];
    } finally {
      this.isLoading = false;
    }
  }

  getSafeUrl(filename: string | null): SafeResourceUrl {
    if (!filename) return this.sanitizer.bypassSecurityTrustResourceUrl('');

    let fullUrl: string;
    
    // Check if already a full URL
    if (filename.startsWith('http://') || filename.startsWith('https://')) {
      // Fix double uploads/uploads/ issue
      fullUrl = filename.replace('/uploads/uploads/', '/uploads/');
    } 
    // Check if path starts with 'uploads/' (backend format)
    else if (filename.startsWith('uploads/')) {
      fullUrl = `http://localhost:8080/${filename}`;
    } 
    // Check if path starts with '/uploads/'
    else if (filename.startsWith('/uploads/')) {
      fullUrl = `http://localhost:8080${filename}`;
    } 
    // Fallback - just a filename, add full path
    else {
      fullUrl = `http://localhost:8080/uploads/signatures/${filename}`;
    }

    console.log(`[ViewDeclaration] Signature URL: "${filename}" -> "${fullUrl}"`);
    return this.sanitizer.bypassSecurityTrustResourceUrl(fullUrl);
  }

  // Keep old method name for backward compatibility
  getSignatureUrl(signatureUrl: string | null): SafeResourceUrl {
    return this.getSafeUrl(signatureUrl);
  }

  onSignatureError(event: Event, signaturePath: string): void {
    console.error('Error loading signature:', signaturePath, event);
    
    // Try alternative URL patterns if the first attempt fails
    const imgElement = event.target as HTMLImageElement;
    
    // If it's just a filename, try with student directory
    if (signaturePath && !signaturePath.includes('/')) {
      // Extract student number from the declaration if available
      const studentNumber = (this.declarations || []).find(d => 
        d.supervisor_signature === signaturePath
      )?.student_number;
      
      if (studentNumber) {
        const alternativeUrl = `http://localhost:8080/uploads/${studentNumber}/${signaturePath}`;
        console.log(`Trying alternative URL: ${alternativeUrl}`);
        imgElement.src = alternativeUrl;
      }
    }
  }


  async deleteDeclaration(id: number): Promise<void> {
    const confirmed = await this.showConfirmationDialog(
      'Are you sure you want to delete this declaration? This action cannot be undone.'
    );
    if (!confirmed) return;

    try {
      // Updated endpoint to match backend
      await lastValueFrom(
        this.http.delete(
          `http://localhost:8080/api/del-declaration-letters/${id}`
        )
      );

      // Update local state
      this.declarations = this.declarations.filter((decl) => decl.id !== id);
      this.applyFilters();

      // Show success message
      this.showSuccess('Declaration deleted successfully');
    } catch (error) {
      console.error('Delete error:', error);

      // More specific error message based on status code
      let errorMessage = 'Failed to delete declaration. Please try again.';
      if ((error as { status: number }).status === 404) {
        errorMessage =
          'Declaration not found. It may have already been deleted.';
      } else if ((error as { status: number }).status === 403) {
        errorMessage = 'You are not authorized to delete this declaration.';
      }

      this.showError(errorMessage);
    }
  }

  viewDeclaration(id: number): void {
    this.router.navigate(['/declaration', id]);
  }

  private async showConfirmationDialog(message: string): Promise<boolean> {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: { message },
    });
    return (await firstValueFrom(dialogRef.afterClosed())) === true;
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar'],
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar'],
    });
  }

  goBack(): void {
    this.location.back();
  }
}
