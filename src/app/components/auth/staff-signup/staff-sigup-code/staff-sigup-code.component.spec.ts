import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffSigupCodeComponent } from './staff-sigup-code.component';

describe('StaffSigupCodeComponent', () => {
  let component: StaffSigupCodeComponent;
  let fixture: ComponentFixture<StaffSigupCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaffSigupCodeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaffSigupCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
