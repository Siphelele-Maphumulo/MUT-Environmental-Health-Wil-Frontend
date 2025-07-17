import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HpcsaLogsheetsComponent } from './hpcsa-logsheets.component';

describe('HpcsaLogsheetsComponent', () => {
  let component: HpcsaLogsheetsComponent;
  let fixture: ComponentFixture<HpcsaLogsheetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HpcsaLogsheetsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HpcsaLogsheetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
