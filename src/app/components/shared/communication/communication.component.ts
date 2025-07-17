import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-communication',
    imports: [
        MatCardModule,
        MatToolbarModule,
        MatButtonModule,
    ],
    templateUrl: './communication.component.html',
    styleUrl: './communication.component.scss'
})
export class CommunicationComponent {
  ngOnInit(): void {
    console.log('Communication component initialized');
}
}
