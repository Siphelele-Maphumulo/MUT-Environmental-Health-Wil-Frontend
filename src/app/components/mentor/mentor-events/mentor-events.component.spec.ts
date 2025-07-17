import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentorEventsComponent } from './mentor-events.component';

describe('MentorEventsComponent', () => {
  let component: MentorEventsComponent;
  let fixture: ComponentFixture<MentorEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MentorEventsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MentorEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
