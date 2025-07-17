import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-reflections',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    ReactiveFormsModule,
  ],
  templateUrl: './reflections.component.html',
  styleUrls: ['./reflections.component.scss'],
})
export class ReflectionsComponent implements OnInit {
  reflectionForm: FormGroup;
  studentNumber: any;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    // Initialize form with empty values
  this.reflectionForm = this.fb.group({
    studentNumber: [{ value: '', disabled: true }, Validators.required],
    studentName: [{ value: '', disabled: true }, Validators.required],
    levelOfStudy: ['', Validators.required],
    feeling: ['', Validators.required],
    success: ['', Validators.required],
    challenges: ['', Validators.required],
    perspectiveChange: ['', Validators.required],
    suggestions: ['', Validators.required]
  });

  }

  ngOnInit(): void {
    let studentNumber;

    // ✅ Safe access to window
    if (typeof window !== 'undefined') {
      const navigation = window.history.state;
      studentNumber = navigation?.studentNumber;
    }

    this.loadStudentDetails(studentNumber);
    this.loadExistingReflection(studentNumber);
  }

  loadStudentDetails(studentNumber: string): void {
    const url = `http://localhost:8080/api/student/${studentNumber}`;

    this.http.get<any>(url).subscribe({
      next: (res) => {
        console.log('Student details loaded:', res);
        this.reflectionForm.patchValue({
          studentNumber,
          studentName: res.fullName,
          levelOfStudy: res.levelOfStudy?.toString()
        });
      },
      error: (err) => {
        console.error('Error loading student details:', err);
        this.showError('Failed to load student details');
      },
    });
  }

  loadExistingReflection(studentNumber: string): void {
    const url = `http://localhost:8080/api/reflection/${studentNumber}`;

    this.http.get<any>(url).subscribe({
      next: (res) => {
        const formatted = {
          studentNumber: res.student_number,
          studentName: res.student_name,
          levelOfStudy: res.level_of_study?.toString(),
          feeling: res.feeling,
          success: res.success,
          challenges: res.challenges,
          perspectiveChange: res.perspective_change,
          suggestions: res.suggestions,
        };
        this.reflectionForm.patchValue(formatted);
      },
      error: (err) => {
        console.log('No existing reflection found, proceeding with empty form.');
      },
    });
  }

 submitReflection(): void {
  if (this.reflectionForm.invalid) {
    this.showError('Please fill in all required fields before submitting.');
    return;
  }

  const formValue = this.reflectionForm.getRawValue(); // ✅ Includes disabled fields

  this.http.post('http://localhost:8080/api/submit-reflection', formValue)
    .subscribe({
      next: (response: any) => {
        this.showSuccess(response.message || 'Reflection submitted successfully!');
        this.router.navigate(['/student-dashboard']);
      },
      error: (err) => {
        console.error('Submission error:', err);
        const errorMessage = err.error?.message || 'Failed to submit reflection. Please try again.';
        this.showError(errorMessage);
      },
    });
}


  clear(): void {
    const studentNumber = this.reflectionForm.get('studentNumber')?.value;
    const studentName = this.reflectionForm.get('studentName')?.value;
    const levelOfStudy = this.reflectionForm.get('levelOfStudy')?.value;

    this.reflectionForm.reset({
      studentNumber,
      studentName,
      levelOfStudy,
      feeling: '',
      success: '',
      challenges: '',
      perspectiveChange: '',
      suggestions: ''
    });

    console.info('Form cleared except student details');
  }

  hasError(controlName: string): boolean {
    const control = this.reflectionForm.get(controlName);
    return !!(control && control.invalid && control.touched);
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
}
