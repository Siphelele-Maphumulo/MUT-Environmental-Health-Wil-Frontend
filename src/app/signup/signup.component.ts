import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';  // Import ToastrService

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  studentNumber: string = '';
  email: string = '';
  password: string = '';
  contact: string = '';
  gender: string = '';
  initials: string = '';
  surname: string = '';
  names: string = '';
  title: string = '';
  confirmPassword: string = '';
  showPassword: boolean = false;
  userType: string = 'student';
  usernameLabel: string = 'STUDENT ID';

  constructor(private router: Router, private toastr: ToastrService) {}

  onUserTypeChange(userType: string) {
    this.userType = userType;
    this.usernameLabel = userType === 'personnel' ? 'Personnel ID' : 'STUDENT ID';
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    // Validate student number
    if (!/^\d{8}$/.test(this.studentNumber)) {
      this.toastr.error('Student Number must be exactly 8 digits.', 'Validation Error');
      return;
    }

    // Validate Level of Study (1 to 4)

    // Validate Gender (Male or Female)
    if (!/^(Male|Female)$/.test(this.gender)) {
      this.toastr.error('Gender must be Male or Female.', 'Validation Error');
      return;
    }

    // Validate Email
    if (!this.email) {
      this.toastr.error('Please enter a valid email address.', 'Validation Error');
      return;
    }

    // Validate Password
    if (!/(?=.*[!@#$%^&*])(?=.*[A-Z])[A-Za-z\d!@#$%^&*]{8,}/.test(this.password)) {
      this.toastr.error('Password must start with a capital letter and include a special character.', 'Validation Error');
      return;
    }

    // Validate Confirm Password
    if (this.password !== this.confirmPassword) {
      this.toastr.error('Passwords do not match.', 'Validation Error');
      return;
    }

    // If all validations pass
    this.toastr.success('Form submitted successfully!', 'Success');
    console.log('Sign-Up Data:', {
      studentNumber: this.studentNumber,
      email: this.email,
      password: this.password,
      confirmPassword: this.confirmPassword,
      contact: this.contact,
      gender: this.gender,
      title: this.title,
      initials: this.initials,
      surname: this.surname,
      names: this.names,
    });
  }
}
