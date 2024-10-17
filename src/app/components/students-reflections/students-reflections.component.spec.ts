import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentsReflectionsComponent } from './students-reflections.component';

describe('StudentsReflectionsComponent', () => {
  let component: StudentsReflectionsComponent;
  let fixture: ComponentFixture<StudentsReflectionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentsReflectionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentsReflectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
