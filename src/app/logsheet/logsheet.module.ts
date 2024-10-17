import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LogsheetComponent } from './logsheet.component';

@NgModule({
  declarations: [LogsheetComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule // Import ReactiveFormsModule here
  ]
})
export class LogsheetModule {}
