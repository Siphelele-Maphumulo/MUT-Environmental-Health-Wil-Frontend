import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true, // Ensures it's a standalone component
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, FormsModule] // Import FormsModule to use ngModel
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  showPassword: boolean = false;
  userType: string = 'student';
  usernameLabel: string = 'Student Email:';

  constructor(private router: Router) {}

  onUserTypeChange(userType: string) {
    this.userType = userType;
    this.usernameLabel = userType === 'personnel' ? 'Personnel ID' : 'Student Email:';
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  validateLogin(): boolean {
    const usernamePattern = /^[0-9]{8}$/;
    if (!usernamePattern.test(this.username)) {
      alert('MUT ID must be exactly 8 digits.');
      return false;
    }
    if (this.password.trim() === '') {
      alert('Password cannot be empty.');
      return false;
    }
    return true;
  }

  onSubmit() {
    if (this.validateLogin()) {
      console.log("Login successful with:", this.username, this.password);
      this.router.navigate(['/forms']); // Replace with your desired route
    }
  }
}
