import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Location } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { lastValueFrom, firstValueFrom } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';

import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  MatDatepickerInputEvent,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { DomSanitizer } from '@angular/platform-browser';

import { YearFormatPipe } from '../../../year-format.pipe';
import { LogbookService } from '../../../services/logbook/logbook.service';
import { LogbookDialogComponent } from '../../shared/logbook-dialog/logbook-dialog.component';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Activity {
  name: string;
  hours: number;
}

interface LogSheet {
  id: number;
  log_date: string;
  student_number: string;
  description: string;
  situation_description: string;
  situation_evaluation: string;
  situation_interpretation: string;
  student_signature: string | null;
  supervisor_signature: string | null;
  EHP_HI_Number: string;
  date_stamp: string;
  created_at: string;
  activities: Activity[];
  [key: string]: any;
}

interface Student {
  first_names: string;
  surname: string;
  student_number: string;
  level_of_study: string;
  totalHoursWorked?: number;
  totalDaysWorked?: number;
  totalDaysLeft?: number;
  completionPercentage?: number;
  progressColor?: string;
  hpcsaStatus?: string;
  hpcsaStatusColor?: string;
}

@Component({
  selector: 'app-student-logbook-viewer',
  templateUrl: './student-logbook-viewer.component.html',
  styleUrls: ['./student-logbook-viewer.component.scss'], // Corrected to styleUrls
  standalone: true,
  imports: [
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    RouterModule,
    ReactiveFormsModule,
    MatOptionModule,
    MatSelectModule,
    YearFormatPipe,
    FormsModule,
  ],
})
export class StudentLogbookViewerComponent implements OnInit {
  students: Student[] = [];
  filteredStudents: Student[] = [];

  // Filter properties
  firstNameFilter: string = '';
  surnameFilter: string = '';
  studentNumberFilter: string = '';
  yearFilter: string = '';
  hpcsaStatusFilter: string = '';
  minHours: number | null = null;
  maxHours: number | null = null;
  minDays: number | null = null;
  maxDays: number | null = null;
  minDaysLeft: number | null = null;
  maxDaysLeft: number | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private logbookService: LogbookService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadStudents();
  }
  async loadStudents(): Promise<void> {
    try {
      const students = await lastValueFrom(
        this.http.get<Student[]>(
          'http://localhost:8080/api/students-with-log-sheets'
        )
      );

      for (const student of students) {
        const logSheets = await this.fetchLogSheets(student.student_number);
        const totals = this.calculateTotals(logSheets);
        const hpcsaStatus = await this.fetchHpcsaStatus(student.student_number);

        this.students.push({
          ...student,
          totalHoursWorked: totals.totalHoursWorked,
          totalDaysWorked: totals.totalDaysWorked,
          totalDaysLeft: totals.totalDaysLeft,
          completionPercentage: totals.completionPercentage,
          progressColor: this.getProgressColor(totals.completionPercentage),
          hpcsaStatus: hpcsaStatus || 'Pending',
          hpcsaStatusColor: this.getHpcsaStatusColor(hpcsaStatus),
        });
      }

      this.filteredStudents = [...this.students];
    } catch (error) {
      console.error('Error loading students:', error);
    }
  }

  applyFilters(): void {
    this.filteredStudents = this.students.filter((student) => {
      // Text filters
      const firstNameMatch = student.first_names
        .toLowerCase()
        .includes(this.firstNameFilter.toLowerCase());
      const surnameMatch = student.surname
        .toLowerCase()
        .includes(this.surnameFilter.toLowerCase());
      const studentNumberMatch = student.student_number.includes(
        this.studentNumberFilter
      );
      const yearMatch = this.yearFilter
        ? (student.level_of_study?.toString() || '') === this.yearFilter
        : true;
      const hpcsaStatusMatch = this.hpcsaStatusFilter
        ? (student.hpcsaStatus || '').toLowerCase() ===
          this.hpcsaStatusFilter.toLowerCase()
        : true;

      // Numeric range filters
      const hoursMatch = this.checkRange(
        student.totalHoursWorked || 0,
        this.minHours,
        this.maxHours
      );
      const daysMatch = this.checkRange(
        student.totalDaysWorked || 0,
        this.minDays,
        this.maxDays
      );
      const daysLeftMatch = this.checkRange(
        student.totalDaysLeft || 0,
        this.minDaysLeft,
        this.maxDaysLeft
      );

      return (
        firstNameMatch &&
        surnameMatch &&
        studentNumberMatch &&
        yearMatch &&
        hpcsaStatusMatch &&
        hoursMatch &&
        daysMatch &&
        daysLeftMatch
      );
    });
  }

  private checkRange(
    value: number,
    min: number | null,
    max: number | null
  ): boolean {
    const minValid = min === null || value >= min;
    const maxValid = max === null || value <= max;
    return minValid && maxValid;
  }

  resetFilters(): void {
    this.firstNameFilter = '';
    this.surnameFilter = '';
    this.studentNumberFilter = '';
    this.yearFilter = '';
    this.hpcsaStatusFilter = '';
    this.minHours = null;
    this.maxHours = null;
    this.minDays = null;
    this.maxDays = null;
    this.minDaysLeft = null;
    this.maxDaysLeft = null;
    this.filteredStudents = [...this.students];
  }

async fetchHpcsaStatus(studentNumber: string): Promise<string | null> {
  try {
    const response = await lastValueFrom(
      this.http.get<{ status: string; check_status: string | null }>(
        `http://localhost:8080/api/hpcsa-status/${studentNumber}`
      )
    );

    if (response.status === "Not Found") {
      console.warn(`Student number ${studentNumber} not found.`);
      return null;
    }

    return response.check_status;
  } catch (error) {
    console.error("Error fetching HPCSA status:", error);
    return null;
  }
}


  getHpcsaStatusColor(status: string | null): string {
    if (!status) return 'gray';
    return status.toLowerCase() === 'yes'
      ? 'green'
      : status.toLowerCase() === 'no'
      ? 'red'
      : 'orange';
  }

  async fetchLogSheets(studentNumber: string): Promise<LogSheet[]> {
    try {
      const response: LogSheet[] = await lastValueFrom(
        this.http.get<LogSheet[]>(
          `http://localhost:8080/api/logbook?student_number=${studentNumber}`
        )
      );

      return response.map((log: LogSheet) => ({
        ...log,
        activities: this.getActivities(log),
      }));
    } catch (error) {
      console.error(`Error fetching logsheets for ${studentNumber}:`, error);
      return [];
    }
  }

  getActivities(log: LogSheet): Activity[] {
    const activities: Activity[] = [];
    for (let i = 1; i <= 14; i++) {
      const activityKey = `activity${i}`;
      const hoursKey = `hours${i}`;
      if (log[activityKey] && !isNaN(parseFloat(log[hoursKey]))) {
        activities.push({
          name: log[activityKey],
          hours: parseFloat(log[hoursKey]),
        });
      }
    }
    return activities;
  }

  calculateTotals(logSheets: LogSheet[]): {
    totalHoursWorked: number;
    totalDaysWorked: number;
    totalDaysLeft: number;
    completionPercentage: number;
  } {
    const uniqueDates = new Set<string>();
    let totalHoursWorked = 0;

    for (const log of logSheets) {
      uniqueDates.add(log.log_date);

      for (const activity of log.activities || []) {
        totalHoursWorked += activity.hours;
      }
    }

    const totalDaysWorked = uniqueDates.size;
    const totalDaysLeft = Math.max(0, 180 - totalDaysWorked);
    const completionPercentage = Math.round((totalDaysWorked / 180) * 100);

    return {
      totalHoursWorked,
      totalDaysWorked,
      totalDaysLeft,
      completionPercentage,
    };
  }

  getProgressColor(percentage: number): string {
    if (percentage < 40) return 'red';
    if (percentage < 70) return 'orange';
    return 'green';
  }

  loadLogbook(studentNumber: string): void {
    this.logbookService.getLogbook(studentNumber).subscribe((data) => {
      console.log('Logbook data:', data);
      // Assign to your component variables
    });
  }

  viewLWilReport(studentNumber: string): void {
    this.dialog.open(LogbookDialogComponent, {
      width: '90%',
      maxWidth: '90vw',
      height: '80vh',
      data: { studentNumber },
      panelClass: 'logbook-modal',
    });
    console.log('Opening logbook dialog for student:', studentNumber);
  }
}
