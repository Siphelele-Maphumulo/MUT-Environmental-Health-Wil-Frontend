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
  selector: 'app-aboutus-modal',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './aboutus-modal.component.html',
  styleUrl: './aboutus-modal.component.scss',
  host: {
    '[@.disabled]': 'true',
  },
})
export class AboutusModalComponent {
  @HostBinding('class.modal-slide-up') slideUp = true;
  private destroy$ = new Subject<void>();

  currentPage = 0;
  pages = [0, 1, 2, 3, 4, 5]; // Page numbers (0-indexed)

  constructor(public dialogRef: MatDialogRef<AboutusModalComponent>) {
    dialogRef
      .beforeClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.slideUp = false;
      });
  }

  nextPage() {
    if (this.currentPage < this.pages.length - 1) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
  }

  closeModal() {
    this.slideUp = false;
    setTimeout(() => this.dialogRef.close(), 300);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
