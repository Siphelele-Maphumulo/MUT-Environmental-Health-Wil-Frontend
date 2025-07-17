import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-pdf-viewer',
  standalone: true,
  template: `
    <h2 mat-dialog-title>View PDF</h2>
    <mat-dialog-content>
      <iframe
        [src]="data.pdfUrl"
        width="100%"
        height="600px"
        style="border: none;"
      ></iframe>
    </mat-dialog-content>
  `,
  imports: [MatDialogModule],
})
export class PdfViewerComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { pdfUrl: SafeUrl }) {}
}
