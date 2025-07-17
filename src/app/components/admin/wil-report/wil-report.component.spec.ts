import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WilReportComponent } from './wil-report.component';

describe('WilReportComponent', () => {
  let component: WilReportComponent;
  let fixture: ComponentFixture<WilReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WilReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WilReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
