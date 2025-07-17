import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HpcsaEventComponent } from './hpcsa-event.component';

describe('HpcsaEventComponent', () => {
  let component: HpcsaEventComponent;
  let fixture: ComponentFixture<HpcsaEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HpcsaEventComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HpcsaEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
