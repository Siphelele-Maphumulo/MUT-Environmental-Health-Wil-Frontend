import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-update-staff',
    imports: [FormsModule, CommonModule],
    templateUrl: './update-staff.component.html',
    styleUrls: ['./update-staff.component.scss']
})
export class UpdateStaffComponent {
  studentNumber: string = '';
  studentNumberError: string | null = null;
  title: string = '';
  titleError: string | null = null;
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  contact: string = '';
  contactError: string | null = null;
  gender: string = '';
  initials: string = '';
  initialsError: string | null = null;
  surname: string = '';
  surnameError: string | null = null;
  names: string = '';
  namesError: string | null = null;
  showPassword: boolean = false;
  userType: string = 'student';
  usernameLabel: string = 'MUT ID';

  constructor(private router: Router) {}

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
    this.contactError = this.contact.trim() ? null : 'Contact is required.';
  }

  validateInitials() {
    this.initialsError = this.initials.trim() ? null : 'Initials are required.';
  }

  validateNames() {
    this.namesError = this.names.trim() ? null : 'Full Names are required.';
  }

  onSubmit() {
    // Trigger validation methods before submit
    this.validateStudentNumber();
    this.validateTitle();
    this.validateSurname();
    this.validateContact();
    this.validateInitials();
    this.validateNames();

    if (
      this.titleError ||
      this.studentNumberError ||
      this.surnameError ||
      this.contactError ||
      this.initialsError ||
      this.namesError
    ) {
      alert('Please fix the errors before submitting.');
      return;
    }

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
    });
    // Add further processing or backend connection here.
  }
}
