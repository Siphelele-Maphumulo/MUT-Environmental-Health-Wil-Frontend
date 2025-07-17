import { Component } from '@angular/core';
import { faHome, faFileAlt, faClipboardList, faBook, faUser, faChalkboardTeacher } from '@fortawesome/free-solid-svg-icons';
import { RouterModule } from '@angular/router'; // Import RouterModule for routing

@Component({
    selector: 'app-dashboard',
    imports: [RouterModule],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css'] // Fix styleUrl to styleUrls
})
export class DashboardComponent {

  applicationCard: string = "Application"; 
  // Add other components cards

  faHome = faHome;
  faFileAlt = faFileAlt;
  faClipboardList = faClipboardList;
  faBook = faBook;
  faUser = faUser;
  faChalkboardTeacher = faChalkboardTeacher;

  // Method to refresh the page
  refreshPage(): void {
    window.location.reload();
  }
}


// might need to add this back in, for dashboard data
/*
import { Component, OnInit } from '@angular/core';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { DataService } from '../../services/data.service';
import { MatToolbarModule } from '@angular/material/toolbar';

import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    RouterModule, // For routing with routerLink
    CommonModule  // For common Angular directives like *ngIf, *ngFor
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {
  dashboardData: any; // create an interface once all the dashboard components have been identified

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.fetchDashboardData();
  }

  // Fetch data via the DataService
  fetchDashboardData(): void {
    this.dataService.getDashboardData().subscribe({
      next: (data) => {
        this.dashboardData = data;
        console.log('Dashboard data:', data);
      },
      error: (err) => {
        console.error('Error fetching dashboard data', err);
      }
    });
  }
}
*/