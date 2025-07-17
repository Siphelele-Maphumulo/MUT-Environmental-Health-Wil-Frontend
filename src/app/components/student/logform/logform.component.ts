import { Component, OnInit } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { MatCard } from '@angular/material/card';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
    selector: 'app-logform',
    imports: [
        MatButton,
        MatCard,
        MatFormField,
        MatButton,
        MatInput,
        MatToolbarModule,
        MatToolbar,
        MatFormFieldModule,
        MatInputModule,
    ],
    templateUrl: './logform.component.html',
    styleUrls: ['./logform.component.scss']
})
export class LogformComponent implements OnInit {
  ngOnInit(): void {
    // Initialization logic here
    console.log('LogformComponent initialized');
  }

  onVerifyClick(): void {
    console.log('Verify button clicked');
  }

  onDoneClick(): void {
    console.log('Done button clicked');
  }
}
