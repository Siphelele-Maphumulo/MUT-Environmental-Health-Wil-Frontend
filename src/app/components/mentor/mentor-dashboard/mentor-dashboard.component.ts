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
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-mentor-dashboard',
  standalone: true,
  imports: [
    MatToolbarModule,
    CommonModule,
    RouterModule,
    FooterComponent,
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './mentor-dashboard.component.html',
  styleUrls: ['./mentor-dashboard.component.scss'],
})
export class MentorDashboardComponent implements OnInit {
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
    this.router.navigate(['/mentor-events'], {
      state: { from: 'admin-dashboard' },
    });
  }


}