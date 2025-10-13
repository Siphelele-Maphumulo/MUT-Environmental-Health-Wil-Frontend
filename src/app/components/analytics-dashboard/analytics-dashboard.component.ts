import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { AnalyticsService } from '../../services/analytics.service';
import { CommonModule, isPlatformBrowser, NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgChartsModule } from 'ng2-charts';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { ChartsSharedModule } from '../shared/charts.module';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-analytics-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    NgChartsModule,
    MatCardModule,
    MatGridListModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressBarModule,
    MatIconModule,
    MatRippleModule,
    ChartsSharedModule,
  ],
  animations: [
  trigger('fadeIn', [
    transition(':enter', [
      style({ opacity: 0 }),
      animate('300ms ease-out', style({ opacity: 1 }))
    ])
  ]),
  trigger('fadeInUp', [
    transition(':enter', [
      style({ opacity: 0, transform: 'translateY(20px)' }),
      animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
    ])
  ])
],
  templateUrl: './analytics-dashboard.component.html',
  styleUrls: ['./analytics-dashboard.component.scss']
})
export class AnalyticsDashboardComponent implements OnInit {
  loading = true;
  isBrowser: boolean;
  showCharts = false;

  timeRange = '30days';
  startDate: Date;
  endDate: Date;

  // Stats
  totalApplications = 0;
  applicationsChange = 0;
  eventAttendance = 0;
  attendanceChange = 0;
  totalLogsheets = 0;
  logsheetsChange = 0;
  totalStudentsPlaced = 0;
  placementsChange = 0;

  // Chart configurations
  applicationsChart: ChartConfiguration['data'] = {
    datasets: [],
    labels: []
  };
  applicationsOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Applications by Status' }
    }
  };

  logsheetsChart: ChartData<'bar'> = {
    labels: [],
    datasets: []
  };
  logsheetsOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Monthly Logsheet Submissions' }
    },
    scales: { y: { beginAtZero: true } }
  };

  attendanceChart: ChartData<'pie'> = {
    labels: ['Attended', 'Registered', 'No Show'],
    datasets: []
  };
  attendanceOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      title: { display: true, text: 'Event Attendance' }
    }
  };

  placementsMapData: any[] = [];
  studentProgressData: any[] = [];


constructor(
  private analyticsService: AnalyticsService,
  private snackBar: MatSnackBar,
  private dialogRef: MatDialogRef<AnalyticsDashboardComponent>,
  @Inject(PLATFORM_ID) private platformId: Object
) {
  const today = new Date();
  this.endDate = new Date(today); // Create new instance
  this.startDate = new Date(today);
  this.startDate.setDate(today.getDate() - 30); // Default to 30 days back
  this.isBrowser = isPlatformBrowser(platformId);
}

  ngOnInit(): void {
    if (this.isBrowser) {
      setTimeout(() => {
        this.showCharts = true;
      }, 0);
    }
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.analyticsService.getDashboardData(this.timeRange, this.startDate, this.endDate).subscribe({
      next: (data) => {
        console.log('Analytics data loaded:', data);
        this.processData(data);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading analytics data:', error);
        this.loading = false;
        this.snackBar.open('Failed to load analytics data', 'Close', {
          duration: 3000
        });
      }
    });
  }

  processData(data: any): void {
    try {
      // Applications chart
      const appLabels = data.applications?.statusLabels || [];
      const appData = data.applications?.statusCounts || [];
      this.applicationsChart = {
        labels: appLabels,
        datasets: [{
          data: appData,
          backgroundColor: ['#4CAF50', '#FFC107', '#F44336', '#2196F3'],
          label: 'Applications'
        }]
      };
      this.totalApplications = appData.reduce((sum: number, val: number) => sum + (val || 0), 0);
      this.applicationsChange = data.applications?.totalChange || 0;

      // Logsheets chart
      const logMonths = data.logsheets?.map((item: any) => item.month) || [];
      const logCounts = data.logsheets?.map((item: any) => item.count || 0) || [];
      this.logsheetsChart = {
        labels: logMonths,
        datasets: [{
          data: logCounts,
          backgroundColor: '#3F51B5',
          label: 'Logsheets Submitted'
        }]
      };
      this.totalLogsheets = logCounts.reduce((sum: number, val: number) => sum + val, 0);

      // Attendance chart
      const attended = parseInt(data.attendance?.attended) || 0;
      const registered = parseInt(data.attendance?.registered) || 0;
      const noShow = parseInt(data.attendance?.noShow) || 0;
      this.attendanceChart.datasets = [{
        data: [attended, registered, noShow],
        backgroundColor: ['#4CAF50', '#FFC107', '#F44336']
      }];

      // Placements data
      this.placementsMapData = data.placements || [];
      this.totalStudentsPlaced = this.placementsMapData.reduce(
        (sum: number, item: any) => sum + (item.count || 0), 0
      );

      // Student progress
      this.studentProgressData = data.studentProgress || [];

      // System activity
      const systemActivity = Array.isArray(data.systemActivity) ? data.systemActivity[0] : {};
      this.eventAttendance = systemActivity.eventAttendance || 0;
      this.attendanceChange = systemActivity.attendanceChange || 0;
      this.logsheetsChange = systemActivity.logsheetChange || 0;
      this.placementsChange = systemActivity.placementsChange || 0;

    } catch (error) {
      console.error('Error processing data:', error);
      this.snackBar.open('Error processing analytics data', 'Close', {
        duration: 3000
      });
    }
  }

onDateChange(): void {
  // Ensure end date is not before start date
  if (this.startDate && this.endDate && this.startDate > this.endDate) {
    this.snackBar.open('End date cannot be before start date', 'Close', {
      duration: 3000
    });
    return;
  }
  
  this.loadData();
}

onTimeRangeChange(): void {
  const today = new Date();
  const newStartDate = new Date(today); // Create a new date object to avoid reference issues
  
  switch(this.timeRange) {
    case '7days':
      newStartDate.setDate(today.getDate() - 7);
      break;
    case '30days':
      newStartDate.setDate(today.getDate() - 30);
      break;
    case '90days':
      newStartDate.setDate(today.getDate() - 90);
      break;
    case 'custom':
      // Don't modify dates if custom is selected
      return;
  }
  
  // Only update dates if not in custom mode
  this.startDate = newStartDate;
  this.endDate = new Date(today); // Ensure end date is today
  this.loadData();
}

  getMaxPlacementCount(): number {
    return this.placementsMapData.length > 0 
      ? Math.max(...this.placementsMapData.map(p => p.count || 0)) 
      : 1;
  }


closeModal(): void {
  this.dialogRef.close();
}
}