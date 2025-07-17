import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentorGuideComponent } from './mentor-guide.component';

describe('MentorGuideComponent', () => {
  let component: MentorGuideComponent;
  let fixture: ComponentFixture<MentorGuideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MentorGuideComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MentorGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
