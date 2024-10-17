import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './shared/guide/home/home.component';
import { LoginComponent } from './components/auth/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
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
