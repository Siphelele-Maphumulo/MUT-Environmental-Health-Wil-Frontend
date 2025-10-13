import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeclarationReportComponent } from './declaration-report.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { CommonModule } from '@angular/common';

describe('DeclarationReportComponent', () => {
  let component: DeclarationReportComponent;
  let fixture: ComponentFixture<DeclarationReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DeclarationReportComponent,
        NoopAnimationsModule,
        MatToolbarModule,
        MatButtonModule,
        MatCardModule,
        MatInputModule,
        MatRadioModule,
        CommonModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DeclarationReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the DeclarationReportComponent', () => {
    expect(component).toBeTruthy();
  });
});
