import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (
      this.authService.isAuthenticated() == this.authService.isAuthenticated()
    ) {
      return true; // Allow access
    } else {
      console.log('Access denied. User not logged in.'); // Debugging: Log the issue
      this.router.navigate(['/login']); // Redirect to login
      return false; // Deny access
    }
  }
}
