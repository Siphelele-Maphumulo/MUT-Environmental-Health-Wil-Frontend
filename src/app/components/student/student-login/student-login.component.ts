// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [],
//   templateUrl: './login.component.html',
//   styleUrl: './login.component.scss'
// })
// export class LoginComponent {

// }

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input'; 
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';//interesting, some modules cannot be detected automatically when importing them, such as this one

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';  // If you use snack bars for notifications
import { MatTooltipModule } from '@angular/material/tooltip';  // Tooltips, if needed
import { CommonModule, NgIf } from '@angular/common';


@Component({
    selector: 'app-student-login',
    imports: [
        CommonModule,
        NgIf,
        ReactiveFormsModule,
        MatCardModule,
        MatInputModule,
        MatButtonModule,
        MatSlideToggleModule,
        MatFormFieldModule, // MatFormField for form controls
        MatIconModule, // MatIcon for icons
        MatSnackBarModule, // Optional: For notifications
        MatTooltipModule, // Optional: For tooltips
    ],
    templateUrl: './student-login.component.html',
    styleUrls: ['./student-login.component.scss']
}) 
export class StudentLoginComponent implements OnInit {
  loginForm!: FormGroup;
  // Declare the 'hide' property to control password visibility
  hide: boolean = true;
  // just declaring them here
  // password: any;
  // email: any;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  // these make the code so much cleaner, notice the space between get and the property
  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authService.studentLogin(this.loginForm.value).subscribe({
        next: (response) => {
          console.log('Login successful:', response);
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error('Login failed:', err);
        },
        complete: () => {
          console.log('Login process completed.');
        }
      });
    }
    else {
      this.loginForm.markAllAsTouched(); // mark all fields as touched to trigger validation messages
    }
  }
  
  signUp(): void {
    this.router.navigate(['/student-signup']);
  }
}
