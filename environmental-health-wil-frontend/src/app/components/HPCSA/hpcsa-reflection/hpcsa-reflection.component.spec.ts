import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HpcsaReflectionComponent } from './hpcsa-reflection.component';

describe('HpcsaReflectionComponent', () => {
  let component: HpcsaReflectionComponent;
  let fixture: ComponentFixture<HpcsaReflectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HpcsaReflectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HpcsaReflectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
