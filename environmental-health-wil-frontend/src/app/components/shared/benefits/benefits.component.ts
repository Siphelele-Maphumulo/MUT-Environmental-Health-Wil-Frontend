import { Component, OnInit } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { MatCard } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-benefits',
    imports: [
        MatToolbar,
        MatCard,
        MatButton,
        MatIconModule,
    ],
    templateUrl: './benefits.component.html',
    styleUrl: './benefits.component.scss'
})
export class BenefitsComponent {
  ngOnInit(): void {
    console.log('Benefits component initialized');
}
}
