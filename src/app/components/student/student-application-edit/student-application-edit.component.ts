import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule, NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-student-application-edit',
  templateUrl: './student-application-edit.component.html',
  styleUrl: './student-application-edit.component.scss',
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
})
export class StudentApplicationEditComponent implements OnInit {
  studentApplicationForm!: FormGroup;
  isSubmitting = false;
  signaturePreview = '';
  cvPreview = '';
  idPreview = '';
  email: string | null = typeof window !== 'undefined' ? sessionStorage.getItem('userEmail') : null;
  originalData: any = {};

  provinces = ['Gauteng', 'KwaZulu-Natal', 'Western Cape', 'Eastern Cape', 'Free State', 'Limpopo', 'Mpumalanga', 'North West', 'Northern Cape'];
  southAfricanMunicipalities = ['City of Johannesburg', 'eThekwini', 'Cape Town', 'Tshwane'];
  southAfricanTowns = ['Sandton', 'Durban', 'Cape Town CBD', 'Pretoria'];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    if (this.email) this.fetchStudentData(this.email);
  }

initForm(): void {
  this.studentApplicationForm = this.fb.group({
    province: ['', Validators.required],
    title: ['', Validators.required],
    initials: ['', [Validators.required, Validators.maxLength(6), Validators.pattern('^[A-Z]+$')]],
    surname: ['', [Validators.required, Validators.pattern('^[A-Za-z]+$')]],
    firstNames: ['', [Validators.required, Validators.pattern('^[A-Za-z ]+$')]],
    studentNumber: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
    levelOfStudy: ['', [Validators.required, Validators.min(1), Validators.max(4)]],
    race: ['', Validators.required],
    gender: ['', Validators.required],
    emailAddress: ['', [Validators.required, Validators.email]],
    physicalAddress: ['', [Validators.required, Validators.pattern('^[A-Za-z0-9 ,.-]+$')]],
    cellPhoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10,13}$')]],
    homeTown: ['', [Validators.pattern('^[A-Za-z ]+$')]],
    municipalityName: ['', Validators.required],
    townSituated: ['', Validators.required],
    contactPerson: ['', Validators.required],
    contactEmail: ['', [Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')]],
    telephoneNumber: ['', [Validators.pattern('^[0-9]{10,13}$')]],
    contactCellPhone: ['', [Validators.pattern('^[0-9]{10,13}$')]],

    // Optional fields: keep original if untouched, no validation
    signatureImage: [this.signaturePreview],
    idDocument: [this.idPreview],
    cvDocument: [this.cvPreview],
    declarationInfo1: [true],
    declarationInfo2: [true],
    declarationInfo3: [true],
  });
}


  fetchStudentData(email: string): void {
    this.http.get<any>(`https://mut-environmental-health-wil-backend.onrender.com /api/application-by-email?email=${email}`).subscribe({
      next: (student) => {
        if (!student) {
          this.snackBar.open('No student data found', 'Close', { duration: 3000 });
          return;
        }

        // Store original data for comparison
        this.originalData = {
          signatureImage: student.signature_image,
          idDocument: student.id_document,
          cvDocument: student.cv_document,
          declarationInfo1: student.declaration_info1 === 1,
          declarationInfo2: student.declaration_info2 === 1,
          declarationInfo3: student.declaration_info3 === 1,
          ...student
        };

        this.studentApplicationForm.patchValue({
          province: student.province,
          title: student.title,
          initials: student.initials,
          surname: student.surname,
          firstNames: student.first_names,
          studentNumber: student.student_number,
          levelOfStudy: student.level_of_study,
          race: student.race,
          gender: student.gender,
          emailAddress: student.email,
          physicalAddress: student.physical_address,
          cellPhoneNumber: student.cell_phone_number,
          homeTown: student.home_town,
          municipalityName: student.municipality_name,
          townSituated: student.town_situated,
          contactPerson: student.contact_person,
          contactEmail: student.contact_email,
          telephoneNumber: student.telephone_number,
          contactCellPhone: student.contact_cell_phone,
          declarationInfo1: student.declaration_info1 === 1,
          declarationInfo2: student.declaration_info2 === 1,
          declarationInfo3: student.declaration_info3 === 1,
        });

        // Set previews
        this.signaturePreview = student.signature_image;
        this.cvPreview = student.cv_document;
        this.idPreview = student.id_document;
      },
      error: () => {
        this.snackBar.open('Failed to load student data', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar'],
        });
      },
    });
  }

onSubmit(): void {
  const emailControl = this.studentApplicationForm.get('emailAddress');

  // Validate form and email domain
  if (
    this.studentApplicationForm.invalid ||
    !emailControl?.value?.toLowerCase().endsWith('@live.mut.ac.za')
  ) {
    this.studentApplicationForm.markAllAsTouched();

    // Show specific message if email domain is wrong
    if (emailControl && !emailControl.value?.toLowerCase().endsWith('@live.mut.ac.za')) {
      this.snackBar.open('Email must end with @live.mut.ac.za', 'Close', {
        duration: 5000,
        panelClass: ['error-snackbar']
      });
    } else {
      this.snackBar.open('Please fill all required fields correctly', 'Close', {
        duration: 5000,
        panelClass: ['error-snackbar']
      });
    }
    return;
  }

  this.isSubmitting = true;
  const formData = new FormData();
  const currentValues = this.studentApplicationForm.value;

  // Add email first
  if (this.email) {
    formData.append('email', this.email);
  }

  // Compare and append only changed fields
  Object.keys(currentValues).forEach(key => {
    if (key === 'email') return;

    const currentValue = currentValues[key];
    const originalValue = this.originalData[key];

    // Handle files
    if (['signatureImage', 'idDocument', 'cvDocument'].includes(key)) {
      if (currentValue instanceof File) {
        formData.append(key, currentValue, currentValue.name);
      } else if (currentValue !== originalValue) {
        formData.append(key, currentValue);
      }
    }
    // Handle declarations (checkboxes)
    else if (key.startsWith('declarationInfo')) {
      if (currentValue !== originalValue) {
        formData.append(key, currentValue);
      }
    }
    // All other changed fields
    else if (JSON.stringify(currentValue) !== JSON.stringify(originalValue)) {
      formData.append(key, currentValue);
    }
  });

  // Send HTTP PUT request
  this.http.put('https://mut-environmental-health-wil-backend.onrender.com /api/applications/update', formData).subscribe({
    next: (response: any) => {
      this.isSubmitting = false;
      this.snackBar.open(response.message || 'Application updated successfully!', 'Close', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });
      this.router.navigate(['/student-dashboard']);
    },
    error: (error) => {
      this.isSubmitting = false;
      console.error('Update error:', error);
      let errorMessage = 'Update failed - please try again';
      if (error.error?.message) {
        errorMessage = error.error.message;
      }
      this.snackBar.open(errorMessage, 'Close', {
        duration: 5000,
        panelClass: ['error-snackbar']
      });
    }
  });
}


  onFileChange(event: Event, controlName: string): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    
    const file = input.files[0];
    
    // Validate file types
    if (controlName === 'signatureImage' && !file.type.startsWith('image/')) {
      this.snackBar.open('Please upload an image file for signature', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    if (controlName === 'cvDocument' && !file.name.toLowerCase().endsWith('.pdf')) {
      this.snackBar.open('Please upload a PDF file for CV', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    this.studentApplicationForm.get(controlName)?.setValue(file);
    
    // Update preview
    const reader = new FileReader();
    reader.onload = () => {
      if (controlName === 'signatureImage') {
        this.signaturePreview = reader.result as string;
      } else if (controlName === 'idDocument') {
        this.idPreview = reader.result as string;
      } else if (controlName === 'cvDocument') {
        this.cvPreview = reader.result as string;
      }
    };
    reader.readAsDataURL(file);
  }

  goBack(): void {
    if (this.studentApplicationForm.dirty) {
      const confirm = window.confirm('You have unsaved changes. Are you sure you want to leave?');
      if (!confirm) return;
    }
    this.router.navigate(['/student-dashboard']);
  }

  getErrorMessage(field: string): string {
    const control = this.studentApplicationForm.get(field);
    if (!control) return '';

    if (control.hasError('required')) return 'This field is required';
    if (control.hasError('requiredTrue')) return 'You must accept this';
    if (control.hasError('email')) return 'Invalid email format';
    if (control.hasError('pattern')) return 'Invalid format';
    if (control.hasError('min')) return 'Value too low';
    if (control.hasError('max')) return 'Value too high';

    return '';
  }
}