import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentorSignDialogComponent } from './mentor-sign-dialog.component';

describe('MentorSignDialogComponent', () => {
  let component: MentorSignDialogComponent;
  let fixture: ComponentFixture<MentorSignDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MentorSignDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MentorSignDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
