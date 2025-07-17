import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';

// Import AuthService
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-student-application',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    NgIf,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatIconModule,
    MatSnackBarModule,
    MatTooltipModule,
  ],
  templateUrl: './student-application.component.html',
  styleUrls: ['./student-application.component.scss'],
})
export class StudentApplicationComponent implements OnInit {
  studentApplicationForm!: FormGroup;

  provinces = [
    'Eastern Cape',
    'Free State',
    'Gauteng',
    'KwaZulu-Natal',
    'Limpopo',
    'Mpumalanga',
    'North West',
    'Northern Cape',
    'Western Cape',
    'Other',
  ];

  southAfricanMunicipalities: string[] = [
    'City of Johannesburg',
    'City of Tshwane',
    'eThekwini',
    'Nelson Mandela Bay',
    'Buffalo City',
    'Mangaung',
    'Ekurhuleni',
    'Cape Town',
    'Sol Plaatje',
    'Polokwane',
    'Mbombela',
    'Rustenburg',
    'Thulamela',
    'uMhlathuze',
    'Steve Tshwete',
  ];

  southAfricanTowns: string[] = [
    'Durban',
    'Johannesburg',
    'Pretoria',
    'Cape Town',
    'Port Elizabeth',
    'Bloemfontein',
    'East London',
    'Polokwane',
    'Kimberley',
    'Rustenburg',
    'Nelspruit',
    'Thohoyandou',
    'Witbank',
    'Welkom',
    'George',
    'Vereeniging',
  ];

  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.studentApplicationForm = this.fb.group({
      province: ['', Validators.required],
      title: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(Mr|Mrs|Ms|Mx|Rev|Hon|Sir|Madam)$/i),
        ],
      ],
      initials: [
        '',
        [
          Validators.required,
          Validators.maxLength(6),
          Validators.pattern(/^[A-Z]+$/),
        ],
      ],
      firstNames: [
        '',
        [Validators.required, Validators.pattern(/^[A-Za-z ]+$/)],
      ],
      surname: ['', [Validators.required, Validators.pattern(/^[A-Za-z]+$/)]],
      studentNumber: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      levelOfStudy: [
        '',
        [Validators.required, Validators.min(1), Validators.max(4)],
      ],
      race: ['', Validators.required],
      gender: ['', Validators.required],
      emailAddress: ['', [Validators.required, Validators.email]],
      physicalAddress: [
        '',
        [Validators.required, Validators.pattern(/^[A-Za-z0-9 ,.-]+$/)],
      ],
      cellPhoneNumber: [
        '',
        [Validators.required, Validators.pattern(/^\d{10,13}$/)],
      ],
      homeTown: ['', [Validators.required, Validators.pattern(/^[A-Za-z ]+$/)]],

      // Section B: Preferred Area of WIL Placement (updated field)
      municipalityName: ['', Validators.required],
      townSituated: ['', Validators.required],
      contactPerson: ['', Validators.required],
      contactEmail: ['', [Validators.required, Validators.email]],
      telephoneNumber: [
        '',
        [Validators.required, Validators.pattern(/^\d{10,13}$/)],
      ],
      contactCellPhone: [
        '',
        [Validators.required, Validators.pattern(/^\d{10,13}$/)],
      ],

      // Section C: Declaration
      declarationInfo1: [false, Validators.requiredTrue],
      declarationInfo2: [false, Validators.requiredTrue],
      declarationInfo3: [false, Validators.requiredTrue],

      // File Uploads
      signatureImage: [null, Validators.required],
      idDocument: [null, Validators.required],
      cvDocument: [null, Validators.required],
    });
  }

  onSubmit(): void {
    if (this.studentApplicationForm.invalid || this.isSubmitting) {
      this.handleFormErrors();
      return;
    }

    this.isSubmitting = true;
    const formData = this.prepareFormData();

    this.authService.submitStudentApplication(formData).subscribe({
      next: () => this.handleSubmissionSuccess(),
      error: (err) => this.handleSubmissionError(err),
    });
  }

  handleFormErrors() {
    this.studentApplicationForm.markAllAsTouched();
    this.snackBar.open(
      'Please fill out all required fields correctly.',
      'Close',
      {
        duration: 5000,
        panelClass: ['error-snackbar'],
        verticalPosition: 'top',
      }
    );
  }

  private prepareFormData(): FormData {
    const formData = new FormData();
    const formValue = this.studentApplicationForm.value;

    Object.keys(formValue).forEach((key) => {
      if (!['signatureImage', 'idDocument', 'cvDocument'].includes(key)) {
        formData.append(key, formValue[key]);
      }
    });

    ['signatureImage', 'idDocument', 'cvDocument'].forEach((field) => {
      const file = this.studentApplicationForm.get(field)?.value;
      if (file) formData.append(field, file, file.name);
    });

    return formData;
  }

  private handleSubmissionSuccess(): void {
    this.isSubmitting = false;
    this.snackBar.open('Application submitted successfully!', 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar'],
      verticalPosition: 'top',
    });
    this.router.navigate(['/student-dashboard']);
  }

  private handleSubmissionError(error: any): void {
    this.isSubmitting = false;
    this.snackBar.open(error.message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar'],
      verticalPosition: 'top',
    });
  }

  onFileChange(event: Event, fieldName: string): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      this.studentApplicationForm.get(fieldName)?.setValue(null);
      return;
    }
    const file = input.files[0];
    this.studentApplicationForm.get(fieldName)?.setValue(file);
  }

  getErrorMessage(controlName: string): string {
    const control = this.studentApplicationForm.get(controlName);
    if (!control?.errors) return '';

    if (control.hasError('required')) {
      return ['signatureImage', 'idDocument', 'cvDocument'].includes(
        controlName
      )
        ? 'This file is required'
        : 'This field is required';
    }

    if (control.hasError('email')) return 'Please enter a valid email address';
    if (control.hasError('pattern'))
      return this.getPatternErrorMessage(controlName);
    if (control.hasError('min') || control.hasError('max'))
      return 'Level must be between 1 and 4';
    if (control.hasError('requiredTrue'))
      return 'You must agree to this declaration';

    return 'Invalid input';
  }

  private getPatternErrorMessage(controlName: string): string {
    switch (controlName) {
      case 'title':
        return 'Must be a valid title (e.g., Mr, Mrs, Ms)';
      case 'initials':
        return 'Uppercase letters only (max 6)';
      case 'surname':
        return 'Letters only';
      case 'firstNames':
      case 'homeTown':
      case 'townSituated':
      case 'contactPerson':
        return 'Letters and spaces only';
      case 'studentNumber':
        return 'Must be 8 digits';
      case 'physicalAddress':
        return 'Invalid address format';
      case 'cellPhoneNumber':
      case 'telephoneNumber':
      case 'contactCellPhone':
        return 'Must be 10-13 digits';
      case 'emailAddress':
      case 'contactEmail':
        return 'Please enter a valid email address';
      default:
        return 'Invalid format';
    }
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }
}
