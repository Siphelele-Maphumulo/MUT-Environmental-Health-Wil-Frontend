import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentorLogsheetsComponent } from './mentor-logsheets.component';

describe('MentorLogsheetsComponent', () => {
  let component: MentorLogsheetsComponent;
  let fixture: ComponentFixture<MentorLogsheetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MentorLogsheetsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MentorLogsheetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
