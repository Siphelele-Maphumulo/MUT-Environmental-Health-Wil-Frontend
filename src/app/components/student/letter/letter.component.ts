import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
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
import { firstValueFrom, lastValueFrom } from 'rxjs';

import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { NavigationEnd, Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';

export interface Declaration {
  id?: number;
  student_number: string;
  student_name?: string;
  supervisor_name: string;
  employer: string;
  position: string;
  hi_number: string;
  start_date: string;
  end_date: string;
  work_ethic: 'Good' | 'Bad';
  timeliness: 'Good' | 'Bad';
  attitude: 'Good' | 'Bad';
  dress: 'Good' | 'Bad';
  interaction: 'Good' | 'Bad';
  responsibility: 'Good' | 'Bad';
  report_writing: 'Good' | 'Bad';
  general_comments: string;
  supervisor_signature: string | null;
  signature_date: string;
  created_at?: string;
  submittedDate: string;
}

@Component({
  selector: 'app-letter',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './letter.component.html',
  styleUrls: ['./letter.component.scss'],
})
export class LetterComponent implements OnInit {
  onSubmit() {
    throw new Error('Method not implemented.');
  }
  onSignatureSelected($event: Event) {
    throw new Error('Method not implemented.');
  }
  declaration: Declaration | null = null;
  declarationForm!: FormGroup;
  isLoading = true;
  signatureLoading = false;
  signatureError = false;

  displayedColumns = [
    'student_number',
    'supervisor',
    'employer',
    'position',
    'dateRange',
    'evaluations',
    'comments',
    'signature',
    'submittedDate',
    'actions',
  ];
  today: any;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private location: Location,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.checkAuthentication();
    this.initScrollBehavior();

    // Initialize form
    this.declarationForm = this.fb.group({});

    const studentNumber = this.authService.getStudentNumber();

    if (!studentNumber) {
      this.isLoading = false;
      return;
    }

    this.fetchDeclaration(studentNumber);
  }

  private checkAuthentication(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/staff-login']);
    }
  }

   // Add these methods for signature image handling
  onSignatureLoad(): void {
    this.signatureLoading = false;
    this.signatureError = false;
    console.log('Signature loaded successfully');
  }

  onSignatureError(event: Event): void {
    this.signatureLoading = false;
    this.signatureError = true;
    console.error('Error loading signature image', event);
    
    // Try alternative URL patterns if first attempt fails
    this.tryAlternativeSignatureUrl();
  }

    private tryAlternativeSignatureUrl(): void {
    if (!this.declaration?.supervisor_signature) return;
    
    const signature = this.declaration.supervisor_signature;
    console.log('Trying alternative URL patterns for signature:', signature);
    
    // You could implement logic to try different URL patterns here
    // For now, we'll just log the issue
    this.showError(`Could not load signature: ${signature}`);
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

  async fetchDeclaration(studentNumber: string): Promise<void> {
    this.isLoading = true;
    try {
      const response = await lastValueFrom(
        this.http.get<any>( // using any to avoid type errors with created_at
          // `http://localhost:8080/api/letters/${studentNumber}`
          `http://localhost:8080/api/letters/${studentNumber}`
        )
      );

      // Map `created_at` to `submittedDate`
      this.declaration = {
        ...response,
        submittedDate: response.created_at,
      };
    } catch (error: any) {
      console.error('Error fetching declaration:', error);
      
      let errorMessage = 'Failed to load declaration letter.';
      
      if (error.status === 500) {
        errorMessage = 'Server error: Unable to retrieve your declaration letter. Please contact support or try again later.';
      } else if (error.status === 404) {
        errorMessage = 'No declaration letter found for your student number. Please submit one first.';
      } else if (error.status === 0) {
        errorMessage = 'Network error: Unable to connect to the server. Please check your connection.';
      } else if (error?.error?.message) {
        errorMessage = error.error.message;
      }
      
      this.showError(errorMessage);
      this.declaration = null;
    } finally {
      this.isLoading = false;
    }
  }

getSignatureUrl(signatureFilename: string | null): string {
  if (!signatureFilename) {
    return '';
  }

  const baseUrl = 'http://localhost:8080';
  const timestamp = `?t=${new Date().getTime()}`;

  // If it's already a full URL, clean it up and add cache busting
  if (signatureFilename.startsWith('http')) {
    // Remove any existing query parameters and add cache busting
    const cleanUrl = signatureFilename.split('?')[0];
    return `${cleanUrl}${timestamp}`;
  }

  // Handle different filename patterns
  let finalUrl = '';

  // Pattern 1: Student signature like "21904759_Signature.png"
  if (this.declaration?.student_number && signatureFilename.startsWith(this.declaration.student_number)) {
    finalUrl = `${baseUrl}/uploads/${this.declaration.student_number}/${signatureFilename}`;
  }
  // Pattern 2: Generic signature like "sig15.png"
  else if (signatureFilename.startsWith('sig')) {
    finalUrl = `${baseUrl}/uploads/signatures/${signatureFilename}`;
  }
  // Pattern 3: Supervisor signature with student number pattern
  else if (signatureFilename.includes('_Signature')) {
    const studentNumFromFilename = signatureFilename.split('_')[0];
    finalUrl = `${baseUrl}/uploads/${studentNumFromFilename}/${signatureFilename}`;
  }
  // Pattern 4: Any other filename - try multiple locations
  else {
    // First try student directory
    if (this.declaration?.student_number) {
      finalUrl = `${baseUrl}/uploads/${this.declaration.student_number}/${signatureFilename}`;
    } else {
      // Fallback to signatures directory
      finalUrl = `${baseUrl}/uploads/signatures/${signatureFilename}`;
    }
  }

  return `${finalUrl}${timestamp}`;
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

  printDeclaration() {
    window.print();
    this.showSuccess('Declaration letter printed successfully');
    this.location.back();
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
