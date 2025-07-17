import { Injectable } from '@angular/core';
import { AboutusModalComponent } from './components/aboutus-modal/aboutus-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root',
})
export class AboutusService {
  constructor(private dialog: MatDialog) {}

  openAboutusModal() {
    const dialogRef = this.dialog.open(AboutusModalComponent, {
      width: '90%',
      maxWidth: '650px',
      panelClass: 'aboutus-modal-container',
      autoFocus: false,
      disableClose: false,
      backdropClass: 'modal-backdrop',
      hasBackdrop: true,
    });

    return dialogRef;
  }
}
