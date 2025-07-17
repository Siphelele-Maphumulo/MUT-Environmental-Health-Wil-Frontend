import { Component, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';


@Component({
    selector: 'app-auditors',
    imports: [
        MatToolbarModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
    ],
    templateUrl: './auditors.component.html',
    styleUrls: ['./auditors.component.scss']
})
export class AuditorsComponent {
  ngOnInit(): void {
    console.log('Benefits component initialized');
}
}
