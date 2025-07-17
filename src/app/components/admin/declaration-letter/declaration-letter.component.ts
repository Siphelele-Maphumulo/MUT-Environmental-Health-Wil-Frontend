import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  today: string = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
  selectedSupervisorSignature: File | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.declarationForm = this.fb.group({
      declarationDate: [this.today],
      supervisorName: ['', Validators.required],
      employerName: ['', Validators.required],
      position: ['', Validators.required],
      hiNumber: ['', Validators.required],
      studentNumber: ['', Validators.required],
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
      supervisorSignature: ['', Validators.required],
      signatureDate: [this.today],
    });

    // THEN subscribe
    this.declarationForm
      .get('studentNumber')
      ?.valueChanges.subscribe((studentNumber) => {
        if (studentNumber) {
          this.authService.getStudentNameByNumber(studentNumber).subscribe({
            next: (res) => {
              this.declarationForm.patchValue({ studentName: res.fullName });
            },
            error: (err) => {
              console.error('Could not fetch student name', err);
              this.declarationForm.patchValue({ studentName: '' });
            },
          });
        }
      });
  }

  fetchStudentName(studentNumber: string): void {
    this.authService.getStudentNameByNumber(studentNumber).subscribe({
      next: (response: any) => {
        this.declarationForm.patchValue({ studentName: response.fullName });
      },
      error: (err) => {
        this.snackBar.open('Student not found.', 'Close', {
          duration: 3000,
          panelClass: 'error-snackbar',
        });
        this.declarationForm.patchValue({ studentName: '' });
      },
    });
  }

  onSignatureSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedSupervisorSignature = input.files[0];
    }
  }

  onSubmit(): void {
    if (!this.validateForm()) {
      return; // Stop submission if validation fails
    }

    const formData = new FormData();
    const formValue = this.declarationForm.value;

    // Add form data
    formData.append('declarationDate', formValue.declarationDate);
    formData.append('supervisorName', formValue.supervisorName);
    formData.append('employerName', formValue.employerName);
    formData.append('position', formValue.position);
    formData.append('hiNumber', formValue.hiNumber);
    formData.append('studentNumber', formValue.studentNumber);
    formData.append('studentName', formValue.studentName);
    formData.append('startDate', formValue.startDate);
    formData.append('endDate', formValue.endDate);
    formData.append('workEthic', formValue.workEthic);
    formData.append('timeliness', formValue.timeliness);
    formData.append('attitude', formValue.attitude);
    formData.append('dress', formValue.dress);
    formData.append('interaction', formValue.interaction);
    formData.append('responsibility', formValue.responsibility);
    formData.append('reportWriting', formValue.reportWriting);
    formData.append('generalComments', formValue.generalComments);
    formData.append('signatureDate', formValue.signatureDate);

    // Add signature file
    if (this.selectedSupervisorSignature) {
      formData.append('supervisor_signature', this.selectedSupervisorSignature);
    }

    // Submit form data
    this.authService.submitDeclaration(formData).subscribe({
      next: (response) => {
        this.snackBar.open('Declaration submitted successfully!', 'Close', {
          duration: 3000,
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

    // Validate required fields
    if (!formValue.supervisorName) {
      errors.push('Supervisor name is required.');
    }
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
    if (!this.selectedSupervisorSignature) {
      errors.push('Supervisor signature is required.');
    }

    // Validate date range
    if (formValue.startDate && formValue.endDate) {
      const startDate = new Date(formValue.startDate);
      const endDate = new Date(formValue.endDate);

      if (startDate > endDate) {
        errors.push('End date must be after start date.');
      }
    }

    // Display errors in snackbar
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
    this.declarationForm.reset({
      declarationDate: this.today,
      signatureDate: this.today,
    });
    this.selectedSupervisorSignature = null;
  }

  goBack(): void {
    window.history.back();
  }
}
