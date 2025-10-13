import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentorLogbooksComponent } from './mentor-logbooks.component';

describe('MentorLogbooksComponent', () => {
  let component: MentorLogbooksComponent;
  let fixture: ComponentFixture<MentorLogbooksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MentorLogbooksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MentorLogbooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
