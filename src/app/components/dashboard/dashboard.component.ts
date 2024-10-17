import { Component } from '@angular/core';
import { faHome, faFileAlt, faClipboardList, faBook, faUser, faChalkboardTeacher } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
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
}
