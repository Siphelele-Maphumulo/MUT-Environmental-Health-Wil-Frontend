import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
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
    this.setupFormListeners();
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
      
      // Section B: Preferred Area of WIL Placement
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
    }, { validators: this.phoneNumberValidator });
  }

  private setupFormListeners(): void {
    // Listen for phone number changes to check for duplicates
    this.studentApplicationForm.get('cellPhoneNumber')?.valueChanges.subscribe(() => {
      this.checkPhoneNumberDuplicates();
    });

    this.studentApplicationForm.get('contactCellPhone')?.valueChanges.subscribe(() => {
      this.checkPhoneNumberDuplicates();
    });
  }

  // Custom validator to check for duplicate phone numbers
  private phoneNumberValidator: ValidatorFn = (formGroup: AbstractControl): ValidationErrors | null => {
    const cellPhoneNumber = formGroup.get('cellPhoneNumber')?.value;
    const contactCellPhone = formGroup.get('contactCellPhone')?.value;

    if (cellPhoneNumber && contactCellPhone && cellPhoneNumber === contactCellPhone) {
      return { duplicatePhoneNumbers: true };
    }
    return null;
  };

    // Check if email is from a student domain
  private isValidStudentEmail(email: string): boolean {
    const studentDomains = [
      'live.mut.ac.za',
      'mut.ac.za',
      'student.mut.ac.za',
      'my.mut.ac.za'
    ];
    
    return studentDomains.some(domain => email.toLowerCase().includes(`@${domain}`));
  }

  // Generate initials from first names and surname
  generateInitials(): void {
    const firstNames = this.studentApplicationForm.get('firstNames')?.value?.trim();
    const surname = this.studentApplicationForm.get('surname')?.value?.trim();

    if (firstNames && surname) {
      // Get first letter of each first name and the surname
      const firstNameInitials = firstNames
        .split(' ')
        .map((name: string) => name.charAt(0).toUpperCase())
        .join('');

      const surnameInitial = surname.charAt(0).toUpperCase();
      
      // Combine initials (max 6 characters)
      let initials = (firstNameInitials + surnameInitial).substring(0, 6);
      
      this.studentApplicationForm.patchValue({
        initials: initials
      });
    }
  }

  // Extract student number from email address
  extractStudentNumberFromEmail(): void {
    const email = this.studentApplicationForm.get('emailAddress')?.value?.trim();
    
    if (email && email.includes('@')) {
      const studentNumber = email.split('@')[0];
      
      // Validate if it's an 8-digit number
      if (/^\d{8}$/.test(studentNumber)) {
        this.studentApplicationForm.patchValue({
          studentNumber: studentNumber
        });
      } else {
        // If not a valid student number format, clear the field
        this.studentApplicationForm.patchValue({
          studentNumber: ''
        });
        
        // Show warning if email looks like a student email but number is invalid
        if (email.includes('@live.mut.ac.za') || email.includes('@mut.ac.za')) {
          this.snackBar.open('Please use a valid student email with 8-digit student number', 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar'],
            verticalPosition: 'top',
          });
        }
      }
    }
  }

  // Check for duplicate phone numbers and show warning
  private checkPhoneNumberDuplicates(): void {
    const cellPhoneNumber = this.studentApplicationForm.get('cellPhoneNumber')?.value;
    const contactCellPhone = this.studentApplicationForm.get('contactCellPhone')?.value;

    if (cellPhoneNumber && contactCellPhone && cellPhoneNumber === contactCellPhone) {
      this.snackBar.open('Cell Phone Number and Contact Cell Phone cannot be the same', 'Close', {
        duration: 5000,
        panelClass: ['error-snackbar'],
        verticalPosition: 'top',
      });
    }
  }

  onSubmit(): void {
    // Mark all fields as touched to trigger validation messages
    this.studentApplicationForm.markAllAsTouched();

    // Check for duplicate phone numbers before submission
    if (this.studentApplicationForm.hasError('duplicatePhoneNumbers')) {
      this.snackBar.open('Cell Phone Number and Contact Cell Phone cannot be the same', 'Close', {
        duration: 5000,
        panelClass: ['error-snackbar'],
        verticalPosition: 'top',
      });
      return;
    }

    // Additional validation for student number and email consistency
    const email = this.studentApplicationForm.get('emailAddress')?.value;
    const studentNumber = this.studentApplicationForm.get('studentNumber')?.value;
    
    if (email && studentNumber && this.isValidStudentEmail(email)) {
      const expectedStudentNumber = email.split('@')[0];
      if (expectedStudentNumber !== studentNumber) {
        this.snackBar.open('Student number does not match the number in your email address', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar'],
          verticalPosition: 'top',
        });
        return;
      }
    }

    if (this.studentApplicationForm.invalid) {
      this.handleFormErrors();
      return;
    }

    if (this.isSubmitting) {
      return; // Prevent multiple submissions
    }

    this.isSubmitting = true;
    
    try {
      const formData = this.prepareFormData();
      
      this.authService.submitStudentApplication(formData).subscribe({
        next: () => this.handleSubmissionSuccess(),
        error: (err) => this.handleSubmissionError(err)
      });
    } catch (error) {
      this.handleSubmissionError(error);
    }
  }

  handleFormErrors(): void {
    // Find the first invalid control and scroll to it
    const invalidControl = document.querySelector('.ng-invalid');
    if (invalidControl) {
      invalidControl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Show error message for the first invalid field
    const invalidFields = Object.keys(this.studentApplicationForm.controls).filter(
      key => this.studentApplicationForm.get(key)?.invalid
    );

    if (invalidFields.length > 0) {
      const firstInvalidField = invalidFields[0];
      const control = this.studentApplicationForm.get(firstInvalidField);
      const errorMessage = this.getErrorMessage(firstInvalidField);
      
      this.snackBar.open(
        `Please check the ${firstInvalidField.replace(/([A-Z])/g, ' $1').toLowerCase()} field: ${errorMessage}`,
        'Close',
        {
          duration: 5000,
          panelClass: ['error-snackbar'],
          verticalPosition: 'top',
        }
      );
    } else {
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
  }

  private prepareFormData(): FormData {
    const formData = new FormData();
    const formValue = this.studentApplicationForm.getRawValue();

    // Append all non-file fields
    Object.entries(formValue).forEach(([key, value]) => {
      if (value !== null && value !== undefined && !['signatureImage', 'idDocument', 'cvDocument'].includes(key)) {
        formData.append(key, value as string | Blob);
      }
    });

    // Append file fields
    ['signatureImage', 'idDocument', 'cvDocument'].forEach((field) => {
      const control = this.studentApplicationForm.get(field);
      if (control?.value instanceof File) {
        formData.append(field, control.value, control.value.name);
      }
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
    const control = this.studentApplicationForm.get(fieldName);
    
    if (!input.files || input.files.length === 0) {
      control?.setValue(null);
      control?.markAsTouched();
      control?.updateValueAndValidity();
      return;
    }
    
    const file = input.files[0];
    
    // Basic file type validation
    const validTypes = {
      'signatureImage': ['image/jpeg', 'image/png', 'image/gif'],
      'idDocument': ['application/pdf', 'image/jpeg', 'image/png'],
      'cvDocument': ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    };
    
    if (validTypes[fieldName as keyof typeof validTypes] && 
        !validTypes[fieldName as keyof typeof validTypes].includes(file.type)) {
      control?.setErrors({ invalidType: true });
      this.snackBar.open(`Invalid file type for ${fieldName}. Please upload a valid file.`, 'Close', {
        duration: 5000,
        panelClass: ['error-snackbar']
      });
      return;
    }
    
    // File size check (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      control?.setErrors({ maxSize: true });
      this.snackBar.open('File size should not exceed 5MB', 'Close', {
        duration: 5000,
        panelClass: ['error-snackbar']
      });
      return;
    }
    
    control?.setValue(file);
    control?.markAsTouched();
    control?.updateValueAndValidity();
  }

  getErrorMessage(controlName: string): string {
    const control = this.studentApplicationForm.get(controlName);
    if (!control?.errors) return '';

    if (control.hasError('required')) {
      if (['signatureImage', 'idDocument', 'cvDocument'].includes(controlName)) {
        return 'This file is required';
      }
      return 'This field is required';
    }

    if (control.hasError('email')) {
      return 'Please enter a valid email address';
    }
    
    if (control.hasError('pattern')) {
      return this.getPatternErrorMessage(controlName);
    }
    
    if (control.hasError('min') || control.hasError('max')) {
      return 'Level must be between 1 and 4';
    }
    
    if (control.hasError('requiredTrue')) {
      return 'You must agree to this declaration';
    }
    
    if (control.hasError('invalidType')) {
      const fileTypes = {
        'signatureImage': 'image (JPEG, PNG, GIF)',
        'idDocument': 'PDF or image (PDF, JPEG, PNG)',
        'cvDocument': 'PDF or Word document (PDF, DOC, DOCX)'
      };
      return `Invalid file type. Please upload a ${fileTypes[controlName as keyof typeof fileTypes] || 'valid file'}`;
    }
    
    if (control.hasError('maxSize')) {
      return 'File size exceeds maximum allowed size (5MB)';
    }

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
