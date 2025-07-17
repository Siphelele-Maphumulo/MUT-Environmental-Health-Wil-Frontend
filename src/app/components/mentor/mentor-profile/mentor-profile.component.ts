import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-mentor-profile',
    imports: [
        MatToolbarModule,
        MatButtonModule,
        MatInputModule,
        MatSelectModule,
        MatCheckboxModule,
        CommonModule,
    ],
    templateUrl: './mentor-profile.component.html',
    styleUrls: ['./mentor-profile.component.scss']
})
export class MentorProfileComponent {
  titles = ['Mr', 'Ms', 'Dr', 'Prof'];
  services = ['Health Institute', 'Municipal Service'];

  submitProfile() {
    console.log('Profile Submitted');
  }
}
