import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentLoginComponent } from './student-login.component';

describe('LoginComponent', () => {
  let component: StudentLoginComponent;
  let fixture: ComponentFixture<StudentLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentLoginComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
