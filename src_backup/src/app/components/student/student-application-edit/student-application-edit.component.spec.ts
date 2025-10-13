import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentApplicationEditComponent } from './student-application-edit.component';

describe('StudentApplicationEditComponent', () => {
  let component: StudentApplicationEditComponent;
  let fixture: ComponentFixture<StudentApplicationEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentApplicationEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentApplicationEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
