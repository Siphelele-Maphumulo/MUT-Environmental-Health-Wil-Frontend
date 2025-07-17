import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from './../../services/user.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-update-profile',
    imports: [
        CommonModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        ReactiveFormsModule,
        MatIconModule,
    ],
    templateUrl: './update-profile.component.html',
    styleUrls: ['./update-profile.component.scss']
})
export class UpdateProfileComponent implements OnInit {
  updateForm!: FormGroup;
  hide: boolean = true;
  hideConfirm: boolean = true;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.updateForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      title: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });

    // Fetch user data to pre-fill the form
    this.userService.getUserData().subscribe((data: { email: string; title: string }) => {
      this.updateForm.patchValue({
        email: data.email,
        title: data.title,
      });
    });
  }

  onSubmit(): void {
    if (this.updateForm.valid) {
      const updatedData = this.updateForm.value;
      
      if (updatedData.password !== updatedData.confirmPassword) {
        alert('Passwords do not match');
        return;
      }

      this.userService.updateUserData(updatedData).subscribe(() => {
        this.router.navigate(['/profile']);
      });
    }
  }
}
