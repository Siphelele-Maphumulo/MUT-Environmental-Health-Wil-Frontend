import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import {
  faHome,
  faFileAlt,
  faClipboardList,
  faBook,
  faUser,
  faChalkboardTeacher,
} from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../../services/auth.service';
import { FooterComponent } from '../../footer/footer.component';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { UserTypeDialogComponent } from '../user-type-dialog/user-type-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { AnalyticsDashboardComponent } from '../../analytics-dashboard/analytics-dashboard.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    MatToolbarModule,
    CommonModule,
    RouterModule,
    FooterComponent,
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent implements OnInit {
  applicationCard = 'Application';
  userEmail: string | null = null;
  showFooter = true;

  // Font Awesome icons
  faHome = faHome;
  faFileAlt = faFileAlt;
  faClipboardList = faClipboardList;
  faBook = faBook;
  faUser = faUser;
  faChalkboardTeacher = faChalkboardTeacher;

  constructor(
    private router: Router,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.checkAuthentication();
    this.initializeScrollBehavior();
  }

  private checkAuthentication(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/staff-login']);
    } else {
      this.userEmail = this.authService.getUserEmail();
    }
  }

  private initializeScrollBehavior(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });

      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    }
  }

  openChatbot(): void {
    console.log('Chatbot button clicked');
    // Add logic to open the chatbot here
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
  }

  navigateToEvents(): void {
    this.router.navigate(['/upcoming-events'], {
      state: { from: 'admin-dashboard' },
    });
  }

openUserManagement(): void {
  const dialogRef = this.dialog.open(UserTypeDialogComponent, {
    width: '350px',
    disableClose: false,
    data: { title: 'Select User Type' }
  });

  dialogRef.afterClosed().subscribe((result: string | undefined) => {
    if (!result) return; // User clicked cancel or outside the dialog

    if (result === 'students') {
      this.router.navigate(['/user-management'], { queryParams: { type: result } });
    } else if (result === 'staff') {
      this.router.navigate(['/staff-management']);
    }
  });
}

  openAnalyticsDashboard(): void {
    this.dialog.open(AnalyticsDashboardComponent, {
      width: '90vw',
      height: '90vh',
      maxWidth: '90vw',
      panelClass: 'glass-modal',
      disableClose: true // force use of close button
    });

}

}