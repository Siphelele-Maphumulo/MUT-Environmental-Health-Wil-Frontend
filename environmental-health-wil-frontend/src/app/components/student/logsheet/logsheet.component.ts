import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-logsheet',
  templateUrl: './logsheet.component.html',
  styleUrls: ['./logsheet.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatCheckboxModule,
  ],
})
export class LogsheetComponent implements OnInit {
  logSheetForm!: FormGroup;
  submissionMessage: string = '';
  currentDate: string = '';
  today: string = DateTime.now().toFormat('yyyy-MM-dd');
  selectedStudentSignature: File | null = null;
  studentNumber: string | null = null;
  isFromStudentDashboard: boolean = false;

  activities = [
    { name: 'Food Control' },
    { name: 'Monitoring water quality and availability' },
    { name: 'Waste Management' },
    { name: 'General hygiene monitoring' },
    { name: 'Vector control monitoring' },
    { name: 'Chemical safety' },
    { name: 'Noise control Hour' },
    { name: 'Environmental pollution control (water & air)' },
    { name: 'Radiation monitoring and control ' },
    { name: 'Health surveillance of premises' },
    {
      name: 'Surveillance & prevention of communicable diseases and Malaria control ',
    },
    { name: 'Port health (air, land and seaports)' },
    { name: 'Control & monitoring of hazardous substances' },
    { name: 'Disposal of the dead' },
    // { name: 'Facility Audits' },
    // { name: 'Other' },
  ];
  selectedActivitiesCount: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  // logsheet.component.ts
  ngOnInit(): void {
    this.setCurrentDate();
    this.handleNavigationState();
    this.initializeForm();
    this.checkExistingLogsheet();
  }

  private setCurrentDate(): void {
    this.currentDate = DateTime.now().toFormat('yyyy-MM-dd HH:mm');
    this.today = DateTime.now().toFormat('yyyy-MM-dd');
  }

  private handleNavigationState(): void {
    const navigationState = history.state;
    this.isFromStudentDashboard = navigationState?.from === 'student-dashboard';
    this.studentNumber =
      navigationState?.studentNumber || this.authService.getStudentNumber();
  }

  private initializeForm(): void {
    this.logSheetForm = this.fb.group({
      logDate: [this.today],
      studentNumber: [this.studentNumber || '', Validators.required],
      description: ['', Validators.required],
      situationDescription: ['', Validators.required],
      situationEvaluation: ['', Validators.required],
      situationInterpretation: ['', Validators.required],
      studentSignature: ['', Validators.required],
      dateStamp: [this.today],
    });

    for (let i = 1; i <= 14; i++) {
      this.addActivityControls(i);
    }

    this.selectedActivitiesCount = 0;
  }

  private addActivityControls(index: number): void {
    const activityKey = `activity${index}`;
    const hoursKey = `hours${index}`;

    this.logSheetForm.addControl(activityKey, this.fb.control(false));
    this.logSheetForm.addControl(
      hoursKey,
      this.fb.control({ value: 0, disabled: true }, [
        Validators.min(0),
        Validators.max(6),
      ])
    );

    this.logSheetForm.get(activityKey)?.valueChanges.subscribe((checked) => {
      const hoursControl = this.logSheetForm.get(hoursKey);
      checked ? hoursControl?.enable() : hoursControl?.disable();
      if (!checked) hoursControl?.setValue(0);
    });
  }

  private checkExistingLogsheet(): void {
    if (!this.studentNumber) return;

    this.authService
      .checkLogsheetExists(this.studentNumber, this.today)
      .subscribe({
        next: ({ exists }) => {
          if (exists) {
            this.snackBar.open(
              'Logsheet for today has already been submitted. You can only update it.',
              'Close',
              { duration: 5000 }
            );
            this.router.navigate(['/update-logsheet'], {
              state: {
                studentNumber: this.studentNumber,
                logDate: this.today,
              },
            });
          }
        },
        error: (error) => {
          console.error('Error checking logsheet:', error);
          this.snackBar.open(
            'Could not check logsheet. You may proceed.',
            'Close',
            { duration: 3000 }
          );
        },
      });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedStudentSignature = input.files[0];
      console.log('Selected file:', this.selectedStudentSignature);
    }
  }

  // logsheet.component.ts
  onSubmit(): void {
    if (!this.validateForm()) return;

    const { studentNumber, logDate } = this.logSheetForm.value;

    this.authService.checkLogsheetExists(studentNumber, logDate).subscribe({
      next: ({ exists }) => {
        if (exists) {
          this.snackBar.open(
            'You have already submitted a logsheet for today.',
            'Close',
            { duration: 5000, panelClass: 'error-snackbar' }
          );
        } else {
          this.submitLogsheet();
        }
      },
      error: (err) => {
        console.error('Logsheet existence check failed:', err);
        this.snackBar.open(
          'Could not verify logsheet status. Try again.',
          'Close',
          { duration: 3000 }
        );
      },
    });
  }

  private submitLogsheet(): void {
    const formData = new FormData();
    const formValue = this.logSheetForm.value;

    formData.append('log_date', formValue.logDate);
    formData.append('student_number', formValue.studentNumber);
    formData.append('EHP_HI_Number', 'Not Signed');

    for (let i = 1; i <= 14; i++) {
      const activityKey = `activity${i}`;
      const hoursKey = `hours${i}`;
      const activity = formValue[activityKey]
        ? this.activities[i - 1].name
        : '';
      const hours = formValue[hoursKey]?.toString() || '';

      formData.append(activityKey, activity);
      formData.append(hoursKey, hours);
    }

    formData.append('description', formValue.description);
    formData.append('situation_description', formValue.situationDescription);
    formData.append('situation_evaluation', formValue.situationEvaluation);
    formData.append(
      'situation_interpretation',
      formValue.situationInterpretation
    );
    formData.append('date_stamp', formValue.dateStamp);

    if (this.selectedStudentSignature) {
      formData.append('student_signature', this.selectedStudentSignature);
    }

    this.authService.createLogSheet(formData).subscribe({
      next: () => {
        // Show success message
        this.snackBar.open('Log sheet submitted successfully!', 'Close', {
          duration: 3000,
          panelClass: 'success-snackbar',
        });

        // Update student status after successful submission
        this.updateStudentStatus(formValue.studentNumber);

        this.resetForm();
        this.router.navigate(['/logbook']);
      },
      error: (err) => {
        console.error('Submission failed:', err);
        this.snackBar.open(
          err.error?.message || 'Failed to submit log sheet.',
          'Close',
          { duration: 3000, panelClass: 'error-snackbar' }
        );
      },
    });
  }

  private updateStudentStatus(studentNumber: string): void {
    this.authService.updateStudentStatus(studentNumber).subscribe({
      next: (response) => {
        console.log('Status update successful:', response);
        this.snackBar.open('Status updated to Active', 'Close', {
          duration: 3000,
          panelClass: 'success-snackbar',
        });
      },
      error: (err) => {
        console.error('Status update error:', err);

        let userMessage = err.message;

        // More specific error messages for common cases
        if (err.message.includes('HTML instead of JSON')) {
          userMessage = 'Server configuration error - contact administrator';
        } else if (err.message.includes('Network error')) {
          userMessage =
            'Cannot connect to server - check your internet connection';
        }

        this.snackBar.open(userMessage, 'Close', {
          duration: 5000,
          panelClass: 'error-snackbar',
        });
      },
    });
  }

  limitSelection(event: any): void {
    const isChecked = event.target.checked;
    const index = event.target.name.replace('activity', '');
    const hoursControl = this.logSheetForm.get(`hours${index}`);

    if (isChecked) {
      this.selectedActivitiesCount++;
      if (this.selectedActivitiesCount > 6) {
        this.snackBar.open('You can only select up to 6 activities.', 'Close', {
          duration: 3000,
        });
        event.target.checked = false;
        this.selectedActivitiesCount--;
        hoursControl?.disable();
      } else {
        hoursControl?.enable();
      }
    } else {
      this.selectedActivitiesCount--;
      hoursControl?.disable();
      hoursControl?.setValue(0);
    }
  }

  validateForm(): boolean {
    const formValue = this.logSheetForm.value;
    const errors: string[] = [];

    if (!formValue.studentNumber) errors.push('Student number is required.');
    if (!formValue.description) errors.push('Description is required.');
    if (!formValue.situationDescription)
      errors.push('Situation description is required.');
    if (!formValue.situationEvaluation)
      errors.push('Situation evaluation is required.');
    if (!formValue.situationInterpretation)
      errors.push('Situation interpretation is required.');
    if (!this.selectedStudentSignature)
      errors.push('Student signature is required.');

    let selectedCount = 0;
    let totalHours = 0;

    for (let i = 1; i <= 14; i++) {
      const checked = formValue[`activity${i}`];
      const hours = formValue[`hours${i}`];

      if (checked) {
        selectedCount++;
        if (!hours || hours <= 0) {
          errors.push(
            `Hours must be specified for activity: ${
              this.activities[i - 1].name
            }`
          );
        }
        totalHours += hours || 0;
      }
    }

    if (selectedCount === 0) {
      errors.push('Select at least one activity.');
    } else if (selectedCount === 1 && totalHours !== 6) {
      errors.push('If one activity is selected, it must equal 6 hours.');
    } else if (totalHours > 6) {
      errors.push('Total hours across all activities must not exceed 6.');
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
    this.logSheetForm.reset({
      logDate: this.today,
      studentNumber: this.studentNumber || '',
      description: '',
      situationDescription: '',
      situationEvaluation: '',
      situationInterpretation: '',
      studentSignature: '',
      dateStamp: this.today,
    });

    for (let i = 1; i <= 14; i++) {
      this.logSheetForm.get(`activity${i}`)?.setValue(false);
      this.logSheetForm.get(`hours${i}`)?.setValue(0);
      this.logSheetForm.get(`hours${i}`)?.disable();
    }

    this.selectedActivitiesCount = 0;
    this.selectedStudentSignature = null;
  }

  goBack(): void {
    window.history.back();
  }
}
