import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../../services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { DateTime } from 'luxon';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-update-logsheet',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatCheckboxModule,
  ],
  templateUrl: './update-logsheet.component.html',
  styleUrls: ['./update-logsheet.component.scss'],
})
export class UpdateLogsheetComponent implements OnInit {
  logSheetForm!: FormGroup;
  submissionMessage: string = '';
  today: string = DateTime.now().toFormat('yyyy-MM-dd');
  selectedStudentSignature: File | null = null;
  studentNumber: string | null = null;
  isFromStudentDashboard: boolean = false;
  existingLogsheetData: any = null;
  isUpdating: boolean = false;
  existingSignatureUrl: string | null = null;
  isLoading: boolean = true;

  activities = [
    { name: 'Food Control' },
    { name: 'Monitoring water quality and availability' },
    { name: 'Waste Management' },
    { name: 'General hygiene monitoring' },
    { name: 'Vector control monitoring' },
    { name: 'Chemical safety' },
    { name: 'Noise control Hour' },
    { name: 'Environmental pollution control (water & air)' },
    { name: 'Radiation monitoring and control' },
    { name: 'Health surveillance of premises' },
    {
      name: 'Surveillance & prevention of communicable diseases and Malaria control',
    },
    { name: 'Port health (air, land and seaports)' },
    { name: 'Control & monitoring of hazardous substances' },
    { name: 'Disposal of the dead' },
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    let navigationState: any = {};
    if (isPlatformBrowser(this.platformId)) {
      navigationState = history.state;
    }

    this.isFromStudentDashboard = navigationState?.from === 'student-dashboard';
    this.studentNumber =
      navigationState?.studentNumber || this.authService.getStudentNumber();

    this.initializeForm();
    this.loadExistingLogsheet();
  }

  private initializeForm(): void {
    this.logSheetForm = this.fb.group({
      logDate: [this.today],
      studentNumber: ['', Validators.required],
      description: ['', Validators.required],
      situationDescription: ['', Validators.required],
      situationEvaluation: ['', Validators.required],
      situationInterpretation: ['', Validators.required],
      studentSignature: [''],
      dateStamp: [this.today],
    });

    // Set student number if available
    if (this.studentNumber) {
      this.logSheetForm.get('studentNumber')?.setValue(this.studentNumber);
    }

    // Add dynamic controls for activities
    for (let i = 1; i <= 14; i++) {
      this.addActivityControls(i);
    }

    this.isLoading = false;
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

  getSelectedActivitiesWithHours(): { name: string; hours: number }[] {
    const formValue = this.logSheetForm.value;
    const selected: { name: string; hours: number }[] = [];

    for (let i = 1; i <= 14; i++) {
      const activityKey = `activity${i}`;
      const hoursKey = `hours${i}`;
      const isChecked = formValue[activityKey];
      const hours = parseInt(formValue[hoursKey], 10) || 0;

      if (isChecked && hours > 0) {
        const activityName = this.activities[i - 1]?.name || `Activity ${i}`;
        selected.push({ name: activityName, hours });
      }
    }

    return selected;
  }

  private loadExistingLogsheet(): void {
    if (!this.studentNumber) return;

    const formattedDate = this.today;

    this.authService
      .getLogsheetByDate(this.studentNumber, formattedDate)
      .subscribe({
        next: (response) => {
          if (response) {
            this.existingLogsheetData = response;
            this.populateFormWithExistingData();
            this.isUpdating = true;
            this.snackBar.open(
              'Loaded existing logsheet for editing.',
              'Close',
              {
                duration: 3000,
                panelClass: 'success-snackbar',
              }
            );
          } else {
            this.snackBar.open(
              'No existing logsheet found for today.',
              'Close',
              {
                duration: 3000,
              }
            );
            this.router.navigate(['/logsheet']);
          }
        },
        error: (error) => {
          console.error('Error loading logsheet:', error);
          this.snackBar.open('No log sheet was submitted today.', 'Close', {
            duration: 3000,
          });
          this.router.navigate(['/logsheet']);
        },
      });
  }

  private populateFormWithExistingData(): void {
    const data = this.existingLogsheetData;
    if (!data) return;

    this.logSheetForm.patchValue({
      description: data.description,
      situationDescription: data.situation_description,
      situationEvaluation: data.situation_evaluation,
      situationInterpretation: data.situation_interpretation,
    });

    for (let i = 1; i <= 14; i++) {
      const activityKey = `activity${i}`;
      const hoursKey = `hours${i}`;

      if (data[activityKey]) {
        this.logSheetForm.get(activityKey)?.setValue(true);
        this.logSheetForm.get(hoursKey)?.setValue(data[hoursKey]);
      }
    }

    if (data.student_signature) {
      this.loadExistingSignature(data.student_signature);
    }
  }

  private loadExistingSignature(signatureFilename: string): void {
    this.authService.getSignatureFile(signatureFilename).subscribe({
      next: (response) => {
        const blob = new Blob([response], { type: 'image/png' });
        const url = URL.createObjectURL(blob);
        this.existingSignatureUrl = this.sanitizer.bypassSecurityTrustUrl(
          url
        ) as string;
      },
      error: (error) => {
        console.error('Error loading signature:', error);
        this.existingSignatureUrl = null;
      },
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedStudentSignature = input.files[0];
    }
  }

  onSubmit(): void {
    if (!this.logSheetForm.valid) {
      this.snackBar.open('Please complete all required fields.', 'Close', {
        duration: 3000,
      });
      return;
    }

    const selectedActivities = this.getSelectedActivitiesWithHours();
    console.log('Submitted Activities:');
    selectedActivities.forEach((act) => {
      console.log(`${act.name} (${act.hours} hr${act.hours !== 1 ? 's' : ''})`);
    });

    this.isUpdating ? this.updateLogsheet() : this.submitLogsheet();
  }

  private updateLogsheet(): void {
    const formData = this.prepareFormData();
    this.authService.update1Logsheet(formData).subscribe({
      next: () => {
        this.snackBar.open('Log sheet updated successfully!', 'Close', {
          duration: 3000,
          panelClass: 'success-snackbar',
        });
        this.router.navigate(['/logbook']);
        if (this.isFromStudentDashboard) {
          this.router.navigate(['/student-dashboard']);
        }
      },
      error: (error) => {
        console.error('Update error:', error);
        this.snackBar.open(
          error.error?.message || 'Failed to update log sheet',
          'Close',
          { duration: 3000 }
        );
      },
    });
  }

  private submitLogsheet(): void {
    const formData = this.prepareFormData();
    formData.append('EHP_HI_Number', 'Not Signed');

    this.authService.createLogSheet(formData).subscribe({
      next: () => {
        this.snackBar.open('Log sheet submitted successfully!', 'Close', {
          duration: 3000,
          panelClass: 'success-snackbar',
        });
      },
      error: (error) => {
        console.error('Submission error:', error);
        this.snackBar.open(
          error.error?.message || 'Failed to submit log sheet',
          'Close',
          { duration: 3000 }
        );
      },
    });
  }

  limitSelection(event: Event, index: number): void {
    const checkbox = event.target as HTMLInputElement;
    const controlKey = `activity${index}`;
    const hoursKey = `hours${index}`;

    if (checkbox.checked) {
      const totalHours = this.getSelectedActivitiesWithHours().reduce(
        (sum, act) => sum + act.hours,
        0
      );

      if (totalHours >= 8) {
        this.snackBar.open(
          'Total activity hours cannot exceed 8 hours per day.',
          'Close',
          { duration: 3000, panelClass: 'error-snackbar' }
        );

        // Uncheck and reset
        this.logSheetForm.get(controlKey)?.setValue(false);
        this.logSheetForm.get(hoursKey)?.setValue(0);
        this.logSheetForm.get(hoursKey)?.disable();
      }
    }
  }

  private prepareFormData(): FormData {
    const formData = new FormData();
    const formValue = this.logSheetForm.value;

    formData.append('log_date', formValue.logDate);
    formData.append('student_number', formValue.studentNumber);
    formData.append('description', formValue.description);
    formData.append('situation_description', formValue.situationDescription);
    formData.append('situation_evaluation', formValue.situationEvaluation);
    formData.append(
      'situation_interpretation',
      formValue.situationInterpretation
    );
    formData.append('date_stamp', formValue.dateStamp);

    const selectedActivities = this.getSelectedActivitiesWithHours();
    selectedActivities.forEach((act, idx) => {
      formData.append(`activity_name${idx + 1}`, act.name);
      formData.append(`hours${idx + 1}`, act.hours.toString());
    });

    if (this.selectedStudentSignature) {
      formData.append('student_signature', this.selectedStudentSignature);
    }

    return formData;
  }
}
