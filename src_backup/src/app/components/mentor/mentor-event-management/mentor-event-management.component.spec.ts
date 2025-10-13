import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentorEventManagementComponent } from './mentor-event-management.component';

describe('MentorEventManagementComponent', () => {
  let component: MentorEventManagementComponent;
  let fixture: ComponentFixture<MentorEventManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MentorEventManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MentorEventManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
