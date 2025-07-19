import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-placement',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatIconModule,
    MatDividerModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    CommonModule,
    MatSelectModule,
    MatFormFieldModule,
  ],
  templateUrl: './placement.component.html',
  styleUrls: ['./placement.component.scss'],
})
export class PlacementComponent {
  placementForm: FormGroup;
  hospitals: string[] = [];
  municipalities: string[] = [];

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.placementForm = this.fb.group({
      studentNumber: ['', Validators.required],
      studentName: new FormControl(
        { value: '', disabled: true },
        Validators.required
      ),
      supervisor: ['', Validators.required],
      municipality: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      cellNumber: ['', Validators.required],
      hospital: [''],
      abattoir: [''],
    });
  }

  ngOnInit(): void {
    this.fetchHospitals();
    this.fetchMunicipalities();

    // Auto-fetch student name when studentNumber length >= 8
    this.placementForm
      .get('studentNumber')
      ?.valueChanges.subscribe((value: string) => {
        if (value && value.length >= 8) {
          this.fetchStudentName(value);
        } else {
          this.placementForm.get('studentName')?.setValue('');
        }
      });
  }

  fetchHospitals(): void {
    this.http.get<string[]>('https://mut-environmental-health-wil-backend.onrender.com /api/hospitals').subscribe({
      next: (data) => (this.hospitals = data),
      error: (err) => console.error('Error fetching hospitals:', err),
    });
  }

  fetchMunicipalities(): void {
    this.http
      .get<string[]>('https://mut-environmental-health-wil-backend.onrender.com /api/municipalities')
      .subscribe({
        next: (data) => (this.municipalities = data),
        error: (err) => console.error('Error fetching municipalities:', err),
      });
  }

  fetchStudentName(studentNumber: string): void {
    this.http
      .get<{ fullName: string }>(
        `https://mut-environmental-health-wil-backend.onrender.com /api/student/${studentNumber}`
      )
      .subscribe({
        next: (res) => {
          this.placementForm.get('studentName')?.setValue(res.fullName);
        },
        error: (err) => {
          console.error('Student not found or error occurred:', err);
          this.placementForm.get('studentName')?.setValue(''); // Clear on error
        },
      });
  }

  onSubmit() {
    if (this.placementForm.valid) {
      const formData = this.placementForm.getRawValue(); // includes disabled fields
      this.http
        .post('https://mut-environmental-health-wil-backend.onrender.com /api/submit-placement', formData)
        .subscribe({
          next: (res: any) => {
            console.log('Success:', res.message);
            alert(res.message);
            this.placementForm.reset();
          },
          error: (err) => {
            console.error('Error submitting placement:', err);
            alert('Error: ' + (err.error?.message || 'Submission failed'));
          },
        });
    } else {
      console.log('Form is invalid');
      alert('Please fill all required fields.');
    }
  }
}
