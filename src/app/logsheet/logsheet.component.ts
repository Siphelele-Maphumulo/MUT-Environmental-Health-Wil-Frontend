import { Component } from '@angular/core';

@Component({
  selector: 'app-logsheet',
  templateUrl: './logsheet.component.html',
  styleUrls: ['./logsheet.component.css']
})
export class LogsheetComponent {
  today: string;
  activities: { activity: string; hours: number | null }[] = [];

  constructor() {
    // Get today’s date in YYYY-MM-DD format
    const currentDate = new Date();
    this.today = currentDate.toISOString().split('T')[0];
    
    // Initialize with one activity row
    this.addActivity();
  }

  // Method to add an activity
  addActivity() {
    if (this.activities.length < 6) {
      this.activities.push({ activity: '', hours: null });
    }
  }

  // Method to remove an activity
  removeActivity(index: number) {
    if (this.activities.length > 1) { // Ensures there’s always at least one activity row
      this.activities.splice(index, 1);
    }
  }
}
