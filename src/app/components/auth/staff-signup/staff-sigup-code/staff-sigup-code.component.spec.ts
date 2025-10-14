import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffSignupCodeComponent } from './staff-sigup-code.component';

describe('StaffSignupCodeComponent', () => {
  let component: StaffSignupCodeComponent;
  let fixture: ComponentFixture<StaffSignupCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaffSignupCodeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaffSignupCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
