import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  studentNumber: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  onSubmit() {
    console.log('Sign-Up Data:', {
      studentNumber: this.studentNumber,
      email: this.email,
      password: this.password,
      confirmPassword: this.confirmPassword
    });
    // Add further processing or validation here.
  }
}
