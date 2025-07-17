import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HpcsaHeaderComponent } from './hpcsa-header.component';

describe('HpcsaHeaderComponent', () => {
  let component: HpcsaHeaderComponent;
  let fixture: ComponentFixture<HpcsaHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HpcsaHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HpcsaHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
