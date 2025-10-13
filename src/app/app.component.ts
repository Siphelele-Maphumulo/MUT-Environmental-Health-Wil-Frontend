import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { CommonModule } from '@angular/common';
import { StudentHeaderComponent } from './components/student/student-header/student-header.component';
import { AdminHeaderComponent } from './components/admin/admin-header/admin-header.component';
import { MentorHeaderComponent } from './components/mentor/mentor-header/mentor-header.component';
import { RouterModule } from '@angular/router';
import { HpcsaHeaderComponent } from './components/HPCSA/hpcsa-header/hpcsa-header.component';

@Component({
  selector: 'app-root',
  template: `
    <app-header *ngIf="showHeader && !showAdminHeader && !showMentorHeader && !showHpcsaHeader"></app-header>
    <app-student-header *ngIf="showStudentHeader"></app-student-header>
    <app-admin-header *ngIf="showAdminHeader"></app-admin-header>
    <app-mentor-header *ngIf="showMentorHeader"></app-mentor-header>
    <app-hpcsa-header *ngIf="showHpcsaHeader"></app-hpcsa-header>

    <router-outlet></router-outlet>

    <app-footer *ngIf="showFooter"></app-footer>
  `,
  imports: [ 
    RouterModule,
    HeaderComponent,
    StudentHeaderComponent,
    AdminHeaderComponent,
    MentorHeaderComponent,
    HpcsaHeaderComponent,
    FooterComponent,
    CommonModule,
  ],
  standalone: true
})
export class AppComponent implements OnInit {
  title = 'environmental-health-wil-frontend';
  showHeader = true;
  showStudentHeader = false;
  showAdminHeader = false;
  showMentorHeader = false;
  showHpcsaHeader = false;
  showFooter = true;

  studentHeaderRoutes = [
    '/logsheet',
    '/logbook',
    '/student-application',
    '/student-application-edit',
    '/student-applications',
    '/profile',
    '/guest-events',
    '/update-logsheet',
    '/letter',
    '/reflections',
  ];

  adminHeaderRoutes = [
    '/applications',
    '/view-logbooks',
    '/viewlogsheets',
    '/event-management',
    '/view-users',
    '/user-management',
    '/placement',
    '/event-code',
    '/upcoming-events',
    '/declaration-letter',
    '/view-declaration-letters',
    '/view-reflections',
    '/view-placements',
    '/staff-codes',
    '/logbook-file',
    '/wil-report',
    '/staff-management',
    '/mentor-management',
    '/hpcsa-management',
    '/auditors',
  ];

  mentorHeaderRoutes = [
    '/mentor-logsheets',
    '/mentor-profile',
    '/declaration-report',
    '/mentor-logbooks',
    '/mentor-placements',
    '/mentor-reflections',
    '/mentor-events',
    '/mentor-event-management',
    '/mentor-event-code',
    '/mentor-declaration-letters',
  ];

  hpcsaHeaderRoutes = [
    '/hpcsa-applications',
    '/hpcsa-logsheets',
    '/hpcsa-profile',
    '/auditors',
    '/hpcsa-logbooks',
    '/hpcsa-placement',
    '/hpcsa-reflection',
    '/hpcsa-event',
    '/hpcsa-declaration',
    '/student-logbook-viewer',
  ];

  hiddenRoutes = [
    '/student-dashboard',
    '/admin-dashboard',
    '/hpcsa-dashboard',
    '/mentor-dashboard',
    '/analytics-dashboard',
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const currentUrl = event.urlAfterRedirects;

        const isHiddenRoute = this.hiddenRoutes.some((route) =>
          currentUrl.startsWith(route)
        );

        this.showStudentHeader =
          !isHiddenRoute &&
          this.studentHeaderRoutes.some((route) =>
            currentUrl.startsWith(route)
          );

        this.showAdminHeader =
          !isHiddenRoute &&
          this.adminHeaderRoutes.some((route) =>
            currentUrl.startsWith(route)
          );

        this.showMentorHeader =
          !isHiddenRoute &&
          this.mentorHeaderRoutes.some((route) =>
            currentUrl.startsWith(route)
          );

        this.showHpcsaHeader =
          !isHiddenRoute &&
          this.hpcsaHeaderRoutes.some((route) =>
            currentUrl.startsWith(route)
          );

        this.showHeader =
          !isHiddenRoute &&
          !this.showStudentHeader &&
          !this.showAdminHeader &&
          !this.showMentorHeader &&
          !this.showHpcsaHeader;

        this.showFooter = !isHiddenRoute;
      }
    });
  }
}
