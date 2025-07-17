import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentorEventCodeComponent } from './mentor-event-code.component';

describe('MentorEventCodeComponent', () => {
  let component: MentorEventCodeComponent;
  let fixture: ComponentFixture<MentorEventCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MentorEventCodeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MentorEventCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
