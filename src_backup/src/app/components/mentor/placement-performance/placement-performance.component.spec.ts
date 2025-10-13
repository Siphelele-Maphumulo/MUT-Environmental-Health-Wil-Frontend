import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlacementPerformanceComponent } from './placement-performance.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';

describe('PlacementPerformanceComponent', () => {
  let component: PlacementPerformanceComponent;
  let fixture: ComponentFixture<PlacementPerformanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PlacementPerformanceComponent,
        NoopAnimationsModule, // Use NoopAnimationsModule for testing animations
        MatSelectModule,
        MatButtonModule,
        MatIconModule,
        MatToolbarModule,
        CommonModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PlacementPerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the PlacementPerformanceComponent', () => {
    expect(component).toBeTruthy();
  });
});
