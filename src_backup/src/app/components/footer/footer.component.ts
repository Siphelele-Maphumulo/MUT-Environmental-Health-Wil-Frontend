import { AboutusModalComponent } from './../aboutus-modal/aboutus-modal.component';
import { AboutusService } from './../../aboutus.service';
import { CommonModule, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ContactsService } from '../../contacts.service';

@Component({
  selector: 'app-footer',
  standalone: true, // Add this line
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatIconModule,
    MatSnackBarModule,
    MatTooltipModule,
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  constructor(
    private contactsService: ContactsService,
    private aboutusService: AboutusService
  ) {}
  openContactsModal() {
    this.contactsService.openContactsModal();
  }

  openAboutusModal() {
    this.aboutusService.openAboutusModal();
  }
}
