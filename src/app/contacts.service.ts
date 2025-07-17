import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ContactsModalComponent } from './components/contacts-modal/contacts-modal.component';

@Injectable({
  providedIn: 'root',
})
export class ContactsService {
  constructor(private dialog: MatDialog) {}

  openContactsModal() {
    const dialogRef = this.dialog.open(ContactsModalComponent, {
      width: '90%',
      maxWidth: '650px',
      panelClass: 'contacts-modal-container',
      autoFocus: false,
      disableClose: false,
      backdropClass: 'modal-backdrop', // Add this for backdrop animation
      hasBackdrop: true,
    });

    return dialogRef;
  }
}
