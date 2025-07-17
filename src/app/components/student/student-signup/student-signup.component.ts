// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { AuthService } from '../../../services/auth.service';
// import { Router } from '@angular/router';
// import { ReactiveFormsModule } from '@angular/forms';
// import { MatCardModule } from '@angular/material/card';
// import { MatInputModule } from '@angular/material/input';
// import { MatButtonModule } from '@angular/material/button';
// import { CommonModule, NgIf } from '@angular/common';
// import { MatSlideToggleModule } from '@angular/material/slide-toggle';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatIconModule } from '@angular/material/icon';
// import { MatSnackBarModule } from '@angular/material/snack-bar';
// import { MatTooltipModule } from '@angular/material/tooltip';

// @Component({
//   selector: 'app-student-signup',
//   standalone: true,
//   imports: [
//     ReactiveFormsModule,
//     MatCardModule,
//     MatInputModule,
//     MatButtonModule,
//     CommonModule,
//     NgIf,
//     MatSlideToggleModule,
//     MatFormFieldModule,
//     MatIconModule,
//     MatSnackBarModule,
//     MatTooltipModule,
//   ],
//   templateUrl: './student-signup.component.html',
//   styleUrls: ['./student-signup.component.scss']
// })
// export class StudentSignupComponent implements OnInit {
//   signupForm!: FormGroup;
//   hide: boolean = true;
//   hideConfirm: boolean = true;

//   constructor(
//     private fb: FormBuilder,
//     private authService: AuthService,
//     private router: Router
//   ) {}

//   ngOnInit(): void {
//     this.signupForm = this.fb.group({
//       email: ['', [Validators.required, Validators.email]],
//       password: ['', Validators.required],
//       title: ['', Validators.required],
//       confirmPassword: ['', Validators.required],
//     });
//   }

//   onSubmit(): void {
//     if (this.signupForm.valid) {
//       this.authService.signUp(this.signupForm.value).subscribe({
//         next: (response) => {
//           console.log('Signup successful:', response);
//           this.router.navigate(['/login']);
//         },
//         error: (err: any) => {
//           console.error('Signup failed:', err);
//         },
//         complete: () => {
//           console.log('Signup process completed.');
//         },
//       });
//     }
//   }

//   login(): void {
//     this.router.navigate(['/student-login']);
//   }
// }
