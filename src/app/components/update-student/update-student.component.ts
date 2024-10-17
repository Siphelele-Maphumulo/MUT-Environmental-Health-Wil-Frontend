import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update-student',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './update-student.component.html',
  styleUrl: './update-student.component.css'
})
export class UpdateStudentComponent {
    
   // Define form fields for Section A
   title: string = '';
   initials: string = '';
   surname: string = '';
   firstNames: string = '';
   studentNumber: string = '';
   levelOfStudy: string = '';
   race: string = '';
   gender: string = '';
   emailAddress: string = '';
   physicalAddress: string = '';
   cellPhoneNumber: string = '';
   homeTown: string = '';
 
   // Define form fields for Section B
   institutionName: string = '';
   townSituated: string = '';
   contactPerson: string = '';
   contactEmail: string = '';
   telephoneNumber: string = '';
   contactCellPhone: string = '';
 
   // Error messages for Section A
   titleError: string | null = null;
   initialsError: string | null = null;
   surnameError: string | null = null;
   firstNamesError: string | null = null;
   studentNumberError: string | null = null;
   levelOfStudyError: string | null = null;
   raceError: string | null = null;
   genderError: string | null = null;
   emailError: string | null = null;
   physicalAddressError: string | null = null;
   cellPhoneNumberError: string | null = null;
   homeTownError: string | null = null;
 
   // Error messages for Section B
   institutionNameError: string | null = null;
   townSituatedError: string | null = null;
   contactPersonError: string | null = null;
   contactEmailError: string | null = null;
   telephoneNumberError: string | null = null;
   contactCellPhoneError: string | null = null;
 
   constructor(private router: Router) {}
 
   onSubmit() {
     if (this.isFormValid()) {
       console.log('Form Submitted:', {
         title: this.title,
         initials: this.initials,
         surname: this.surname,
         firstNames: this.firstNames,
         studentNumber: this.studentNumber,
         levelOfStudy: this.levelOfStudy,
         race: this.race,
         gender: this.gender,
         emailAddress: this.emailAddress,
         physicalAddress: this.physicalAddress,
         cellPhoneNumber: this.cellPhoneNumber,
         homeTown: this.homeTown,
         institutionName: this.institutionName,
         townSituated: this.townSituated,
         contactPerson: this.contactPerson,
         contactEmail: this.contactEmail,
         telephoneNumber: this.telephoneNumber,
         contactCellPhone: this.contactCellPhone
       });
     }
   }
 
   // Section A Validation Methods
   validateEmailAddress() {
     this.emailError = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(this.emailAddress) ? null : 'Please enter a valid email address.';
   }
 
   validateTitle() {
     this.titleError = /^(Mr|Mrs|Ms)$/.test(this.title) ? null : 'Title must be Mr, Mrs, or Ms.';
   }
 
   validateInitials() {
     this.initialsError = /^[A-Z]{1,6}$/.test(this.initials) ? null : 'Initials must be uppercase letters (max 6).';
   }
 
   validateSurname() {
     this.surnameError = /^[A-Za-z]+$/.test(this.surname) ? null : 'Surname must contain only letters.';
   }
 
   validateFirstNames() {
     this.firstNamesError = /^[A-Za-z ]+$/.test(this.firstNames) ? null : 'First names must contain only letters and spaces.';
   }
 
   validateStudentNumber() {
     this.studentNumberError = /^[0-9]{8}$/.test(this.studentNumber) ? null : 'Student number must be exactly 8 digits.';
   }
 
   validateLevelOfStudy() {
     this.levelOfStudyError = /^[1-4]$/.test(this.levelOfStudy) ? null : 'Level of study must be between 1 and 4.';
   }
 
   validateRace() {
     this.raceError = /^(African|White|Indian|Coloured|Other)$/.test(this.race) ? null : 'Race must be African, White, Indian, Coloured, or Other.';
   }
 
   validateGender() {
     this.genderError = this.gender ? null : 'Gender is required.';
   }
 
   validatePhysicalAddress() {
     this.physicalAddressError = /^[A-Za-z0-9 ,.-]+$/.test(this.physicalAddress) ? null : 'Physical address must contain only valid characters.';
   }
 
   validateCellPhoneNumber() {
     this.cellPhoneNumberError = /^[0-9]{10,13}$/.test(this.cellPhoneNumber) ? null : 'Cell phone number must be between 10 and 13 digits.';
   }
 
   validateHomeTown() {
     this.homeTownError = /^[A-Za-z ]+$/.test(this.homeTown) ? null : 'Home town must contain only letters and spaces.';
   }
 
   // Section B Validation Methods
   validateInstitutionName() {
     this.institutionNameError = this.institutionName.trim() ? null : 'Institution name is required.';
   }
 
   validateTownSituated() {
     this.townSituatedError = /^[A-Za-z ]+$/.test(this.townSituated) ? null : 'Town situated must contain only letters and spaces.';
   }
 
   validateContactPerson() {
     this.contactPersonError = /^[A-Za-z ]+$/.test(this.contactPerson) ? null : 'Contact person must contain only letters and spaces.';
   }
 
   validateContactEmail() {
     this.contactEmailError = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(this.contactEmail) ? null : 'Please enter a valid email address.';
   }
 
   validateTelephoneNumber() {
     this.telephoneNumberError = /^[0-9]{10,13}$/.test(this.telephoneNumber) ? null : 'Telephone number must be between 10 and 13 digits.';
   }
 
   validateContactCellPhone() {
     this.contactCellPhoneError = /^[0-9]{10,13}$/.test(this.contactCellPhone) ? null : 'Cell phone number must be between 10 and 13 digits.';
   }
 
   isFormValid(): boolean {
     return !(
       this.titleError ||
       this.initialsError ||
       this.surnameError ||
       this.firstNamesError ||
       this.studentNumberError ||
       this.levelOfStudyError ||
       this.raceError ||
       this.genderError ||
       this.emailError ||
       this.physicalAddressError ||
       this.cellPhoneNumberError ||
       this.homeTownError ||
       this.institutionNameError ||
       this.townSituatedError ||
       this.contactPersonError ||
       this.contactEmailError ||
       this.telephoneNumberError ||
       this.contactCellPhoneError
     );
   }
 }
