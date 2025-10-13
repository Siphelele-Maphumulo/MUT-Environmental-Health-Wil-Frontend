import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-student-header',
  templateUrl: './student-header.component.html',
  styleUrls: ['./student-header.component.scss'],
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class StudentHeaderComponent implements OnInit {
  private previousUrl: string | null = null;

  constructor(private router: Router, private location: Location) {}

  ngOnInit() {
    // Track the previous URL
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.previousUrl = event.url;
      });
  }

  goBack() {
    // Navigate back to the appropriate dashboard based on previous URL
    if (this.previousUrl) {
      if (this.previousUrl.includes('/admin-dashboard')) {
        this.router.navigate(['/admin-dashboard']);
      } else if (this.previousUrl.includes('/student-dashboard')) {
        this.router.navigate(['/student-dashboard']);
      } else if (this.previousUrl.includes('/mentor-dashboard')) {
        this.router.navigate(['/mentor-dashboard']);
      } else if (this.previousUrl.includes('/auditor-dashboard')) {
        this.router.navigate(['/auditor-dashboard']);
      } else if (this.previousUrl.includes('/mutStaff-dashboard')) {
        this.router.navigate(['/mutStaff-dashboard']);
      } else if (this.previousUrl.includes('/guest-events')) {
        this.router.navigate(['/home']);
      } else {
        // Default to student dashboard if no specific dashboard found
        this.router.navigate(['/student-dashboard']);
      }
    } else {
      // Default to student dashboard if previous URL is null
      this.router.navigate(['/student-dashboard']);
    }
  }
}
