import { TestBed, ComponentFixture } from '@angular/core/testing';
import { DataService } from '../../services/data.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterTestingModule } from '@angular/router/testing';
import { AnalyticsDashboardComponent } from './analytics-dashboard.component';

describe('AnalyticsDashboardComponent', () => {
  let component: AnalyticsDashboardComponent;
  let fixture: ComponentFixture<AnalyticsDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AnalyticsDashboardComponent,
        HttpClientTestingModule,  // Mocks HttpClient
        MatSidenavModule,
        MatListModule,
        MatIconModule,
        MatCardModule,
        MatButtonModule,
        MatToolbarModule,
        RouterTestingModule       // Mocks Router for navigation
      ],
      providers: [DataService]
    }).compileComponents();

    fixture = TestBed.createComponent(AnalyticsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the AnalyticsDashboardComponent', () => {
    expect(component).toBeTruthy();
  });
});
