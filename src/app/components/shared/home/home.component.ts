import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router'; // Needed for routerLink

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule, // Add this line
    MatCardModule,
    MatButtonModule,
    RouterModule,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  private initialized = false;

  ngOnInit(): void {
    // Only log once to prevent console spam
    if (!this.initialized) {
      this.initialized = true;
      console.log('Home component initialized');
    }
  }
}
