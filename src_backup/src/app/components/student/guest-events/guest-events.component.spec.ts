import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestEventsComponent } from './guest-events.component';

describe('GuestEventsComponent', () => {
  let component: GuestEventsComponent;
  let fixture: ComponentFixture<GuestEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuestEventsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuestEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
