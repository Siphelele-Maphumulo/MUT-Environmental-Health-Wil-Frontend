import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HpcsaDashboardComponent } from './hpcsa-dashboard.component';

describe('HpcsaDashboardComponent', () => {
  let component: HpcsaDashboardComponent;
  let fixture: ComponentFixture<HpcsaDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HpcsaDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HpcsaDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
