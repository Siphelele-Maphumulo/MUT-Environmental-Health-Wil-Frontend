import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  studentNumber: string = '';
  studentNumberError: string | null = null;
  title: string = '';
  titleError: string | null = null;
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  passwordError: string | null = null;
  contact: string = '';
  contactError: string | null = null;
  gender: string = '';
  initials: string = '';
  initialsError: string | null = null;
  surname: string = '';
  surnameError: string | null = null;
  names: string = '';
  namesError: string | null = null;
  role: string = ''; // Added role property
  showPassword: boolean = false;
  userType: string = 'student';
  usernameLabel: string = 'STUDENT ID';

  constructor(private snackBar: MatSnackBar, private router: Router) {}

  onUserTypeChange(userType: string) {
    this.userType = userType;
    this.usernameLabel = userType === 'personnel' ? 'Personnel ID' : 'STUDENT ID';
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  validateStudentNumber() {
    this.studentNumberError = /^[a-zA-Z0-9]{8}$/.test(this.studentNumber)
      ? null
      : 'Student Number must be exactly 8 alphanumeric characters.';
  }

  validateTitle() {
    const acceptedTitles = ['Dr', 'Mr', 'Mrs', 'Miss', 'Ms'];
    this.titleError = acceptedTitles.includes(this.title.trim())
      ? null
      : 'Title must be one of the following: Dr., Mr., Mrs., Miss., Ms.';
  }

  validateSurname() {
    this.surnameError = this.surname.trim() ? null : 'Surname is required.';
  }

  validateContact() {
    this.contactError = /^\d{10,13}$/.test(this.contact)
      ? null
      : 'Contact must be between 10 and 13 digits.';
  }

  validateInitials() {
    this.initialsError = /^[A-Z]{1,6}$/.test(this.initials) ? null : 'Initials must be uppercase letters (max 6).';
  }

  validateNames() {
    this.namesError = this.names.trim() ? null : 'Full Names are required.';
  }

  validatePasswordsMatch() {
    if (this.password && this.confirmPassword && this.password !== this.confirmPassword) {
        this.passwordError = 'Passwords do not match.';
    } else {
        this.passwordError = null;
    }
}


  onSubmit() {
    // Trigger validation methods before submit
    this.validateStudentNumber();
    this.validateSurname();
    this.validateNames();
    this.validatePasswordsMatch();

    // Additional validation for personnel only
    if (this.userType === 'personnel') {
      this.validateTitle();
      this.validateContact();
      this.validateInitials();
    }

    // Check for errors
    if (
      this.titleError ||
      this.studentNumberError ||
      this.surnameError ||
      this.contactError ||
      this.initialsError ||
      this.namesError ||
      this.passwordError
    ) {
      alert('Please fix the errors before submitting.');
      return;
    }

    // If there are no validation errors, proceed to submit and log the selected user type
    console.log('Sign-Up Data:', {
      studentNumber: this.studentNumber,
      title: this.title,
      email: this.email,
      password: this.password,
      confirmPassword: this.confirmPassword,
      contact: this.contact,
      gender: this.gender,
      initials: this.initials,
      surname: this.surname,
      names: this.names,
      role: this.role, // Added role property in the form data
      userType: this.userType
    });

    alert(`Sign-Up Successful. Selected User Type: ${this.userType}`);
    // Add further processing or backend connection here.
  }
}
