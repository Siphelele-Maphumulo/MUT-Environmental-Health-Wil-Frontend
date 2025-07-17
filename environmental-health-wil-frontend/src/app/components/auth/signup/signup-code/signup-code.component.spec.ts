import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupCodeComponent } from './signup-code.component';

describe('SignupCodeComponent', () => {
  let component: SignupCodeComponent;
  let fixture: ComponentFixture<SignupCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignupCodeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignupCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
