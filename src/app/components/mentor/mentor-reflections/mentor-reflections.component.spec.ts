import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentorReflectionsComponent } from './mentor-reflections.component';

describe('MentorReflectionsComponent', () => {
  let component: MentorReflectionsComponent;
  let fixture: ComponentFixture<MentorReflectionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MentorReflectionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MentorReflectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
