import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentReflectionComponent } from './student-reflection.component';

describe('StudentReflectionComponent', () => {
  let component: StudentReflectionComponent;
  let fixture: ComponentFixture<StudentReflectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentReflectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentReflectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
