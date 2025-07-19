import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sign-logsheets',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './sign-logsheets.component.html',
  styleUrls: ['./sign-logsheets.component.scss'],
})
export class SignLogsheetsComponent implements OnInit {
  logsheetForm!: FormGroup;
  logsheetId!: number;
  isLoading = true;

  private apiUrl = 'https://mut-environmental-health-wil-backend.onrender.com /api/daily-logsheets'; // Backend API URL
  logsheetsForm!: FormGroup<any>;
  logsheetsArray: any;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Retrieve the logsheet ID from the route parameters
    this.logsheetId = Number(this.route.snapshot.paramMap.get('id'));
    console.log('Loaded logsheet with ID:', this.logsheetId);

    if (this.logsheetId) {
      this.fetchLogsheet();
    } else {
      this.snackBar.open('Invalid logsheet ID.', 'Close', { duration: 3000 });
    }
  }

  // Fetch the logsheet data for the selected ID
  fetchLogsheet(): void {
    this.http.get<any>(`${this.apiUrl}/${this.logsheetId}`).subscribe({
      next: (data) => {
        this.initForm(data);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching logsheet:', err);
        this.snackBar.open(
          'Failed to fetch logsheet. Please try again later.',
          'Close',
          { duration: 3000 }
        );
        this.isLoading = false;
      },
    });
  }

  // Initialize the form with logsheet data
  private initForm(logsheet: any): void {
    this.logsheetForm = this.fb.group({
      logDate: [logsheet.log_date || '', Validators.required],
      studentNumber: [logsheet.student_number || '', Validators.required],
      description: [logsheet.description || '', Validators.required],
      situationDescription: [logsheet.situation_description || ''],
      situationEvaluation: [logsheet.situation_evaluation || ''],
      situationInterpretation: [logsheet.situation_interpretation || ''],
      dateStamp: [logsheet.date_stamp || ''],
      ehp_hi_number: [logsheet.ehp_hi_number || '', Validators.required],
      supervisor_signature: [logsheet.supervisor_signature || ''],
    });
  }

  // Submit the updated logsheet
  onSubmit(): void {
    if (this.logsheetForm.invalid) {
      this.snackBar.open('Please fill out all required fields.', 'Close', {
        duration: 3000,
      });
      return;
    }

    const updatedData = this.logsheetForm.value;
    this.http.put(`${this.apiUrl}/${this.logsheetId}`, updatedData).subscribe({
      next: () => {
        this.snackBar.open('Logsheet updated successfully!', 'Close', {
          duration: 3000,
        });
      },
      error: (err) => {
        console.error('Error updating logsheet:', err);
        this.snackBar.open(
          'Failed to update logsheet. Please try again later.',
          'Close',
          { duration: 3000 }
        );
      },
    });
  }
}
