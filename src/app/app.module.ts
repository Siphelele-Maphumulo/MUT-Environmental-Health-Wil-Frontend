import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Add FormsModule for ngModel

import { AppComponent } from './app.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule, // Ensure FormsModule is included
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {} // Ensure the export is correct
