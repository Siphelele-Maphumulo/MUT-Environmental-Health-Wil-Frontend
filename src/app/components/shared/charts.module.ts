import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartWrapperComponent } from './chart-wrapper/chart-wrapper.component';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    ChartWrapperComponent,
    NgChartsModule // Provides BaseChartDirective
  ],
  exports: [
    ChartWrapperComponent, // Export the component
    NgChartsModule // Optional: Export NgChartsModule if other modules need it
  ]
})
export class ChartsSharedModule {}