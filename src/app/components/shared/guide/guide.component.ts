import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
@Component({
    selector: 'app-guide',
    imports: [
        MatCardModule,
        MatToolbarModule,
        MatButtonModule,
    ],
    templateUrl: './guide.component.html',
    styleUrl: './guide.component.scss'
})
export class GuideComponent {
  ngOnInit(): void {
    console.log('Guide component initialized');
}
}