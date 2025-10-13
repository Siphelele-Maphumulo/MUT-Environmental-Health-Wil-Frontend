import { Component, OnInit } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { MatButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatInput } from '@angular/material/input';
import { MatFormField } from '@angular/material/input';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';


@Component({
    selector: 'app-contact',
    imports: [
        MatToolbar,
        MatButton,
        MatCard,
        MatInput,
        MatFormField,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatInputModule,
    ],
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  enquiryForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.enquiryForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      enquiry: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.enquiryForm.valid) {
      const formData = this.enquiryForm.value;
      console.log('Form submitted:', formData);
      // Handle the submission logic here
    }
  }
}
