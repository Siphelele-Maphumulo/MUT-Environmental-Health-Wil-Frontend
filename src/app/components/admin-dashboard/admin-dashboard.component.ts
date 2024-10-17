import { Component } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { faHome, faFileAlt, faClipboardList, faBook, faUser, faChalkboardTeacher } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [MatBadgeModule, MatButtonModule, MatIconModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {


  applicationCard: string = "Application"; 
  // Add other components cards

  faHome = faHome;
  faFileAlt = faFileAlt;
  faClipboardList = faClipboardList;
  faBook = faBook;
  faUser = faUser;
  faChalkboardTeacher = faChalkboardTeacher;

  hidden = false;

  toggleBadgeVisibility() {
    this.hidden = !this.hidden;
  }
}
