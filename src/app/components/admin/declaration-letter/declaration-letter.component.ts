import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar } from '@angular/material/snack-bar';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-declaration-letter',
  templateUrl: './declaration-letter.component.html',
  styleUrl: './declaration-letter.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatCheckboxModule,
  ],
})
export class DeclarationLetterComponent {
  evaluationList = [
    { label: 'A. Work ethic:', name: 'workEthic' },
    { label: 'B. Timeliness:', name: 'timeliness' },
    { label: 'C. Attitude:', name: 'attitude' },
    { label: 'D. Dress and appearance:', name: 'dress' },
    { label: 'E. Interaction with personnel:', name: 'interaction' },
    { label: 'F. Responsibility:', name: 'responsibility' },
    { label: 'G. Report Writing:', name: 'reportWriting' },
  ];

  declarationForm!: FormGroup;
  submissionMessage: string = '';
  today: string = new Date().toISOString().split('T')[0];
  supervisorSignatureExists: boolean = false;
  supervisorSignaturePath: string = '';
  currentSupervisor: any = null;
  isLoading: boolean = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.authService.debugAuthState(); 
    this.initializeForm();
    this.loadCurrentSupervisor();
  }

  initializeForm(): void {
    this.declarationForm = this.fb.group({
      declarationDate: [this.today],
      supervisorName: [{ value: '', disabled: true }, Validators.required], // Disabled since we auto-fill
      employerName: ['', Validators.required],
      position: ['', Validators.required],
      hiNumber: ['', Validators.required],
      studentNumber: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(8),
        Validators.pattern('^[0-9]*$')
      ]],
      studentName: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      workEthic: ['', Validators.required],
      timeliness: ['', Validators.required],
      attitude: ['', Validators.required],
      dress: ['', Validators.required],
      interaction: ['', Validators.required],
      responsibility: ['', Validators.required],
      reportWriting: ['', Validators.required],
      generalComments: [''],
      signatureDate: [this.today],
    });

    // Add auto-fetch for student name
    this.declarationForm
      .get('studentNumber')
      ?.valueChanges.pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe((studentNumber) => {
        if (studentNumber && studentNumber.length === 8) {
          this.fetchStudentName(studentNumber);
        } else if (studentNumber && studentNumber.length > 0) {
          this.declarationForm.patchValue({ studentName: '' });
        }
      });
  }

  // 🔥 NEW: Load current supervisor automatically
// In your component - update loadCurrentSupervisor method
loadCurrentSupervisor(): void {
  this.isLoading = true;

  // Debug current auth state
  console.log('🔐 Current auth state:');
  console.log('- User Email:', this.authService.getCurrentUserEmail());
  console.log('- User Role:', this.authService.getCurrentUserRole());
  console.log('- Token:', this.authService.getToken());

  const userEmail = this.authService.getCurrentUserEmail();
  
  if (!userEmail) {
    this.snackBar.open('No user email found. Please log in again.', 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar'],
    });
    this.isLoading = false;
    return;
  }

  console.log('🔍 Loading supervisor for email:', userEmail);

  // Use the email-based method instead of token-based
  this.authService.getCurrentSupervisorByEmail().subscribe({
    next: (response: any) => {
      this.isLoading = false;
      if (response.success && response.supervisor) {
        this.currentSupervisor = response.supervisor;
        
        // Auto-fill supervisor name and validate signature
        this.declarationForm.patchValue({
          supervisorName: this.currentSupervisor.name
        });

        this.supervisorSignatureExists = !!this.currentSupervisor.signature_image;
        this.supervisorSignaturePath = this.currentSupervisor.signature_image;

        if (this.supervisorSignatureExists) {
          console.log('✅ Supervisor signature found:', this.supervisorSignaturePath);
          this.snackBar.open(`Welcome ${this.currentSupervisor.name}! Your signature is ready.`, 'Close', {
            duration: 4000,
            panelClass: ['success-snackbar'],
          });
        } else {
          console.warn('⚠️ No signature found for supervisor');
          this.snackBar.open(`Welcome ${this.currentSupervisor.name}! Warning: No signature found.`, 'Close', {
            duration: 5000,
            panelClass: ['warning-snackbar'],
          });
        }
      } else {
        console.error('❌ No supervisor data in response:', response);
        this.snackBar.open('Failed to load supervisor information.', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar'],
        });
      }
    },
    error: (err) => {
      this.isLoading = false;
      console.error('❌ Error loading supervisor info:', err);
      
      let errorMessage = 'Error loading your information. Please refresh the page.';
      
      if (err.status === 404) {
        errorMessage = 'Supervisor not found. Please contact administrator.';
      } else if (err.status === 400) {
        errorMessage = 'Email parameter missing. Please log in again.';
      }
      
      this.snackBar.open(errorMessage, 'Close', {
        duration: 5000,
        panelClass: ['error-snackbar'],
      });
    }
  });
}

  fetchStudentName(studentNumber: string): void {
    if (!studentNumber || studentNumber.trim() === '') {
      return;
    }

    const cleanStudentNumber = studentNumber.trim();
    
    if (cleanStudentNumber.length !== 8) {
      this.snackBar.open('Student number must be exactly 8 digits', 'Close', {
        duration: 3000,
        panelClass: ['warning-snackbar'],
      });
      return;
    }

    this.authService.getStudentNameByNumber(cleanStudentNumber).subscribe({
      next: (response: any) => {
        if (response.fullName) {
          this.declarationForm.patchValue({ studentName: response.fullName });
          this.snackBar.open(`Student found: ${response.fullName}`, 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar'],
          });
        } else {
          this.snackBar.open('Student data incomplete', 'Close', {
            duration: 3000,
            panelClass: ['warning-snackbar'],
          });
          this.declarationForm.patchValue({ studentName: '' });
        }
      },
      error: (err) => {
        console.error('Could not fetch student name:', err);
        let errorMessage = 'Student not found';
        
        if (err.status === 404) {
          errorMessage = `Student with number ${cleanStudentNumber} not found`;
        } else if (err.status === 0) {
          errorMessage = 'Network error - cannot connect to server';
        } else if (err.status === 500) {
          errorMessage = 'Server error - please try again later';
        } else if (err.error?.message) {
          errorMessage = err.error.message;
        }

        this.snackBar.open(errorMessage, 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar'],
        });
        
        this.declarationForm.patchValue({ studentName: '' });
      },
    });
  }

  onLookupStudent(): void {
    const studentNumber = this.declarationForm.get('studentNumber')?.value;
    if (studentNumber) {
      this.fetchStudentName(studentNumber);
    }
  }

// In your component - temporary fix
onSubmit(): void {
  if (!this.validateForm()) {
    return;
  }

  const formData = this.declarationForm.value;

  // Use the development endpoint temporarily
  this.authService.submitDeclarationDev(formData).subscribe({
    next: (response) => {
      this.snackBar.open('Declaration submitted successfully!', 'Close', {
        duration: 6000,
      });
      this.resetForm();
    },
    error: (error) => {
      console.error('Submission error:', error);
      this.snackBar.open(
        error.error?.message || 'Failed to submit declaration',
        'Close',
        { duration: 3000 }
      );
    },
  });
}

  validateForm(): boolean {
    const formValue = this.declarationForm.value;
    const errors: string[] = [];

    // Validate student number is exactly 8 digits
    if (formValue.studentNumber && formValue.studentNumber.length !== 8) {
      errors.push('Student number must be exactly 8 digits.');
    }

    // Remove supervisor name validation since it's auto-filled
    if (!formValue.employerName) {
      errors.push('Employer name is required.');
    }
    if (!formValue.position) {
      errors.push('Position is required.');
    }
    if (!formValue.hiNumber) {
      errors.push('HI Number is required.');
    }
    if (!formValue.studentName) {
      errors.push('Student name is required.');
    }
    if (!formValue.startDate) {
      errors.push('Start date is required.');
    }
    if (!formValue.endDate) {
      errors.push('End date is required.');
    }
    if (!formValue.workEthic) {
      errors.push('Work ethic evaluation is required.');
    }
    if (!formValue.timeliness) {
      errors.push('Timeliness evaluation is required.');
    }
    if (!formValue.attitude) {
      errors.push('Attitude evaluation is required.');
    }
    if (!formValue.dress) {
      errors.push('Dress and appearance evaluation is required.');
    }
    if (!formValue.interaction) {
      errors.push('Interaction evaluation is required.');
    }
    if (!formValue.responsibility) {
      errors.push('Responsibility evaluation is required.');
    }
    if (!formValue.reportWriting) {
      errors.push('Report writing evaluation is required.');
    }

    // Validate supervisor signature exists
    if (!this.supervisorSignatureExists) {
      errors.push('Your supervisor signature was not found. Please contact administrator.');
    }

    // Validate date range
    if (formValue.startDate && formValue.endDate) {
      const startDate = new Date(formValue.startDate);
      const endDate = new Date(formValue.endDate);

      if (startDate > endDate) {
        errors.push('End date must be after start date.');
      }
    }

    if (errors.length > 0) {
      this.snackBar.open(errors.join('\n'), 'Close', {
        duration: 5000,
        panelClass: 'error-snackbar',
      });
      return false;
    }
    return true;
  }

  resetForm(): void {
    // Reset all fields except supervisor name
    this.declarationForm.patchValue({
      declarationDate: this.today,
      employerName: '',
      position: '',
      hiNumber: '',
      studentNumber: '',
      studentName: '',
      startDate: '',
      endDate: '',
      workEthic: '',
      timeliness: '',
      attitude: '',
      dress: '',
      interaction: '',
      responsibility: '',
      reportWriting: '',
      generalComments: '',
      signatureDate: this.today,
    });
    
    this.snackBar.open('Form has been reset', 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }
}