import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) { // ✅ Fixed: Just check if authenticated
      console.log('✅ AuthGuard: User is authenticated, allowing access');
      return true; // Allow access
    } else {
      console.log('❌ AuthGuard: User not authenticated, redirecting to login');
      this.router.navigate(['/student-login']); // Make sure this matches your login route
      return false; // Deny access
    }
  }
}