import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';

// Import FontAwesome icons
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
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [RouterModule, CommonModule, FooterComponent],
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.scss'], // Fixed typo here
})
export class StudentDashboardComponent implements OnInit {
  applicationCard: string = 'Application';
  // Add other components cards as needed
  userEmail: string | null = null;
  studentNumber: string | null = null;
  showFooter = true;

  faHome = faHome;
  faFileAlt = faFileAlt;
  faClipboardList = faClipboardList;
  faBook = faBook;
  faUser = faUser;
  faChalkboardTeacher = faChalkboardTeacher;

  constructor(
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    // Check if the user is authenticated
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']); // Redirect to login if not authenticated
    } else {
      // Get the logged-in user's email
      this.userEmail = this.authService.getUserEmail();
      this.studentNumber = this.authService.getStudentNumber();
    }

    // Scroll to the top of the page when the component initializes (browser-only)
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' }); // Smooth scrolling
    }

    // Handle scroll restoration for navigation events
    this.router.events.subscribe((event) => {
      if (
        event instanceof NavigationEnd &&
        isPlatformBrowser(this.platformId)
      ) {
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Smooth scrolling
      }
    });
  }

  // Logout method
  logout(): void {
    this.authService.logout(); // Call the logout method from AuthService
  }

  // Method to refresh the page
  refreshPage(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.location.reload();
    }
  }

  navigateToLogsheet() {
    if (this.studentNumber) {
      this.router.navigate(['/logsheet'], {
        state: {
          studentNumber: this.studentNumber,
          from: 'student-dashboard',
        },
      });
    } else {
      console.error('Student number not available');
      // Handle error or show message to user
    }
  }

  navigateToreflections() {
    if (this.studentNumber) {
      this.router.navigate(['/reflections'], {
        state: {
          studentNumber: this.studentNumber,
          from: 'student-dashboard',
        },
      });
    } else {
      console.error('Student number not available');
      this.snackBar.open('Student number not found', 'Close', {
        duration: 3000,
      });
    }
  }
}
