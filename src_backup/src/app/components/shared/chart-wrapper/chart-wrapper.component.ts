import { Component, Input, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chart-wrapper',
  standalone: true,
  imports: [CommonModule, NgChartsModule], // Import NgChartsModule instead of BaseChartDirective
  template: `
    <div class="chart-container" *ngIf="isBrowser">
      <canvas baseChart
        [data]="data"
        [type]="type"
        [options]="options">
      </canvas>
    </div>
  `,
  styles: [`
    .chart-container {
      position: relative;
      height: 300px;
    }
  `]
})
export class ChartWrapperComponent implements OnInit {
  @Input() data: ChartData | ChartConfiguration['data'] = { datasets: [], labels: [] };
  @Input() type: ChartType = 'bar';
  @Input() options: ChartConfiguration['options'] = {};
  
  isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {}
}