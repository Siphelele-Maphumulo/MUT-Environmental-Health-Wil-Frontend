import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'app-hpcsa-header',
    imports: [
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        CommonModule,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    templateUrl: './hpcsa-header.component.html',
    styleUrls: ['./hpcsa-header.component.scss']
})
export class HpcsaHeaderComponent implements OnInit {
  private previousUrl: string | null = null;

  constructor(private router: Router, private location: Location) {}

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.previousUrl = event.url;
    });
  }

  goBack() {
    this.router.navigate(['/hpcsa-dashboard']);
  }
}
