import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HpcsaPlacementComponent } from './hpcsa-placement.component';

describe('HpcsaPlacementComponent', () => {
  let component: HpcsaPlacementComponent;
  let fixture: ComponentFixture<HpcsaPlacementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HpcsaPlacementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HpcsaPlacementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
