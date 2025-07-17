import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'app-mentor-header',
    imports: [
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        CommonModule,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    templateUrl: './mentor-header.component.html',
    styleUrls: ['./mentor-header.component.scss']
})
export class MentorHeaderComponent implements OnInit {
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
    this.router.navigate(['/mentor-dashboard']);
  }
}
