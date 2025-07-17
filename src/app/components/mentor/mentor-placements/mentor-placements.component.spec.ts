import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentorPlacementsComponent } from './mentor-placements.component';

describe('MentorPlacementsComponent', () => {
  let component: MentorPlacementsComponent;
  let fixture: ComponentFixture<MentorPlacementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MentorPlacementsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MentorPlacementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
