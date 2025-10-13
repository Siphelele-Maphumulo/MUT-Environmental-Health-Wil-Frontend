import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComplianceReportComponent } from './compliance-report.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';  // Import animations module

describe('ComplianceReportComponent', () => {
  let component: ComplianceReportComponent;
  let fixture: ComponentFixture<ComplianceReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ComplianceReportComponent,
        BrowserAnimationsModule  // Import BrowserAnimationsModule to support Angular Material animations
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ComplianceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the ComplianceReportComponent', () => {
    expect(component).toBeTruthy();
  });
});
