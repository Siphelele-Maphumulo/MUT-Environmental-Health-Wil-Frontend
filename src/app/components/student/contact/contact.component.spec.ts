import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactComponent } from './contact.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ContactComponent,  // Import standalone component here
        ReactiveFormsModule,
        MatToolbarModule,
        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule
      ]
    }).compileComponents();
    

    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the ContactComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should have an invalid form when initialized', () => {
    expect(component.enquiryForm.valid).toBeFalsy();
  });

  it('should require email to be a valid format', () => {
    const emailControl = component.enquiryForm.controls['email'];
    emailControl.setValue('invalidEmail');
    expect(emailControl.valid).toBeFalsy();
    emailControl.setValue('test@example.com');
    expect(emailControl.valid).toBeTruthy();
  });

  it('should require enquiry to be filled', () => {
    const enquiryControl = component.enquiryForm.controls['enquiry'];
    enquiryControl.setValue('');
    expect(enquiryControl.valid).toBeFalsy();
    enquiryControl.setValue('Sample enquiry');
    expect(enquiryControl.valid).toBeTruthy();
  });

  it('should submit form if valid', () => {
    spyOn(console, 'log'); // Spy on console.log to verify form submission output

    // Set valid values for form controls
    component.enquiryForm.controls['email'].setValue('test@example.com');
    component.enquiryForm.controls['enquiry'].setValue('Sample enquiry');
    expect(component.enquiryForm.valid).toBeTruthy();

    // Trigger submit function
    component.onSubmit();
    expect(console.log).toHaveBeenCalledWith('Form submitted:', {
      email: 'test@example.com',
      enquiry: 'Sample enquiry'
    });
  });

  it('should not submit form if invalid', () => {
    spyOn(console, 'log');

    // Leave form invalid
    component.enquiryForm.controls['email'].setValue('');
    component.enquiryForm.controls['enquiry'].setValue('');
    expect(component.enquiryForm.valid).toBeFalsy();

    // Trigger submit function
    component.onSubmit();
    expect(console.log).not.toHaveBeenCalled();
  });
});
