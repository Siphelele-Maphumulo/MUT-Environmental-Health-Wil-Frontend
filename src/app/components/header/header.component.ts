import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    RouterModule,
    NgIf,
  ],
})
export class HeaderComponent implements OnInit {
  menuOpen = false;
  showBackButton = false;
  showNavigationLinks = false;
  showHeader = false;
  currentRoute: string = '';

  // Define pages where the header should be visible
  private readonly visiblePages = new Set([
    '/home',
    '/signup',
    '/login',
    '/guide',
    '/contact',
    '/guest',
    '/student-application',
    '/mentor-login',
    '/staff-login',
    '/hpcsa-login',
    '/mentor-signup',
    '/staff-signup',
    '/hpcsa-signup',
    
  ]);

  // Define pages where the header should explicitly be hidden
  private readonly hiddenPages = new Set([
    '/student-dashboard',
    '/admin-dashboard',
    '/mentor-dashboard',
  ]);

  hoverStyle = {
    color: 'white',
    'text-shadow': '0 0 5px gold',
  };

  constructor(private router: Router, private location: Location) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateHeaderVisibility(event.urlAfterRedirects);
      }
    });
  }

  ngOnInit(): void {
    this.updateHeaderVisibility(this.router.url);
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  goBack(): void {
    this.location.back();
  }

  private updateHeaderVisibility(url: string): void {
    this.currentRoute = url;
    const shouldShowHeader =
      this.visiblePages.has(url) && !this.hiddenPages.has(url);

    this.showHeader = shouldShowHeader;
    this.showNavigationLinks = shouldShowHeader;
    this.showBackButton = this.shouldShowBackButton(url);
  }

  private shouldShowBackButton(url: string): boolean {
    // Add logic for when to show back button
    return !this.visiblePages.has(url) && !this.hiddenPages.has(url);
  }

  isCurrentRoute(route: string): boolean {
    return this.currentRoute === route;
  }

  isLoggedIn(): boolean {
    if (typeof window !== 'undefined' && localStorage) {
      return localStorage.getItem('authToken') !== null;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  // Add these to your component
showLoginMenu = false;
showSignupMenu = false;

toggleLoginMenu() {
  this.showLoginMenu = !this.showLoginMenu;
  if (this.showSignupMenu) this.showSignupMenu = false;
}

toggleSignupMenu() {
  this.showSignupMenu = !this.showSignupMenu;
  if (this.showLoginMenu) this.showLoginMenu = false;
}
}
