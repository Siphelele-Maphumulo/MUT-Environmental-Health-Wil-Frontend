import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventManagementComponent } from './event-management.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('EventManagementComponent', () => {
  let component: EventManagementComponent;
  let fixture: ComponentFixture<EventManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        EventManagementComponent,
        ReactiveFormsModule,
        MatToolbarModule,
        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatSelectModule,
        NoopAnimationsModule, // Disables animations for tests
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EventManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the EventManagementComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should render the toolbar with the title "Environmental Health - Event Management"', () => {
    const toolbar = fixture.nativeElement.querySelector('.header-toolbar');
    expect(toolbar).toBeTruthy();
    expect(toolbar.textContent).toContain('Environmental Health - Event Management');
  });

  it('should have an input for the Event Title', () => {
    const inputField = fixture.nativeElement.querySelector('input[placeholder="Enter event title"]');
    expect(inputField).toBeTruthy();
  });

  it('should have a dropdown for Event Type', () => {
    const selectField = fixture.nativeElement.querySelector('mat-select');
    expect(selectField).toBeTruthy();
  });

  it('should have a date picker for Event Date', () => {
    const datepicker = fixture.nativeElement.querySelector('input[placeholder="Choose a date"]');
    expect(datepicker).toBeTruthy();
  });

  it('should handle file selection', () => {
    const file = new File(['dummy content'], 'test-file.pdf', { type: 'application/pdf' });
    const event = { target: { files: [file] } } as unknown as Event;

    spyOn(console, 'log');
    component.onFileSelect(event);
    expect(component.selectedFileName).toBe('test-file.pdf');
    expect(console.log).toHaveBeenCalledWith('File selected:', file);
  });
});
