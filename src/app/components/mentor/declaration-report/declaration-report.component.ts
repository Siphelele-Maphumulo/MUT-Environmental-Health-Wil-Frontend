import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-declaration-report',
    imports: [
        MatToolbarModule,
        MatButtonModule,
        MatCardModule,
        MatInputModule,
        MatRadioModule,
        CommonModule,
    ],
    templateUrl: './declaration-report.component.html',
    styleUrls: ['./declaration-report.component.scss']
})
export class DeclarationReportComponent {
  criteriaOptions = ['Good', 'Average', 'Poor'];
  criteria = [
    { label: 'Work Ethic' },
    { label: 'Tidiness' },
    { label: 'Attendance' },
    { label: 'Dress and Appearance' },
    { label: 'Interaction with Personnel' },
    { label: 'Responsibility' },
    { label: 'Report Writing' }
  ];

  saveReport() {
    console.log('Report Saved');
  }

  submitReport() {
    console.log('Report Submitted');
  }
}
