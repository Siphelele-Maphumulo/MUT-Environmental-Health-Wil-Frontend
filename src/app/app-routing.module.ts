import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { LogsheetComponent } from './logsheet/logsheet.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';

const appRoutes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' }, // Redirect to login initially
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/signup', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'logsheet', component: LogsheetComponent },
  // Additional routes here...
];

@NgModule({
  imports: [
    MatSnackBarModule,
    RouterModule.forRoot(appRoutes), // Configure the RouterModule with your routes
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
