import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { HttpClient } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-student-reflection',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatInputModule,
    MatCardModule
  ],
  templateUrl: './student-reflection.component.html',
  styleUrl: './student-reflection.component.scss'
})
export class StudentReflectionComponent implements OnInit {
  reflectionForm: FormGroup;
  reflectionId: number;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private router: Router,
    private dialogRef: MatDialogRef<StudentReflectionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { reflectionId: number }
  ) {
    this.reflectionId = data.reflectionId;

    this.reflectionForm = this.fb.group({
      studentName: ['', Validators.required],
      studentNumber: ['', Validators.required],
      levelOfStudy: ['', Validators.required],
      feeling: [''],
      success: [''],
      challenges: [''],
      perspectiveChange: [''],
      suggestions: ['']
    });
  }

  ngOnInit(): void {
    if (this.reflectionId) {
      this.loadReflection(this.reflectionId);
    } else {
      this.snackBar.open('Reflection ID not provided.', 'Close', { duration: 3000 });
      this.dialogRef.close();
    }
  }

  loadReflection(id: number): void {
    this.authService.getReflectionById(id).subscribe({
      next: (reflection) => {
        this.reflectionForm.patchValue({
          studentName: reflection.student_name,
          studentNumber: reflection.student_number,
          levelOfStudy: reflection.level_of_study,
          feeling: reflection.feeling,
          success: reflection.success,
          challenges: reflection.challenges,
          perspectiveChange: reflection.perspective_change,
          suggestions: reflection.suggestions
        });
        this.reflectionForm.disable(); // make read-only
      },
      error: () => {
        this.snackBar.open('Reflection not found.', 'Close', { duration: 3000 });
        this.dialogRef.close();
      }
    });
  }

  hasError(controlName: string): boolean {
    const control = this.reflectionForm.get(controlName);
    return !!(control && control.invalid && control.touched);
  }

  closeModal(): void {
  this.dialogRef.close();
}
}
