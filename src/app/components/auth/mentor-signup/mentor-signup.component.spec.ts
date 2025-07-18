import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentorSignupComponent } from './mentor-signup.component';

describe('MentorSignupComponent', () => {
  let component: MentorSignupComponent;
  let fixture: ComponentFixture<MentorSignupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MentorSignupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MentorSignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
