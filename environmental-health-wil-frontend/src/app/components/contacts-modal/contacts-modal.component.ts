import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  HostBinding,
  OnDestroy,
  Output,
} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-contacts-modal',
  imports: [CommonModule, MatIconModule],
  templateUrl: './contacts-modal.component.html',
  styleUrls: ['./contacts-modal.component.scss'],
  host: {
    '[@.disabled]': 'true', // Disable Angular's default animations
  },
})
export class ContactsModalComponent implements OnDestroy {
  @HostBinding('class.modal-slide-up') slideUp = true;
  private destroy$ = new Subject<void>();

  constructor(public dialogRef: MatDialogRef<ContactsModalComponent>) {
    // Handle closing animation
    dialogRef
      .beforeClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.slideUp = false;
      });
  }

  closeModal() {
    this.slideUp = false;
    setTimeout(() => this.dialogRef.close(), 300); // Match animation duration
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
