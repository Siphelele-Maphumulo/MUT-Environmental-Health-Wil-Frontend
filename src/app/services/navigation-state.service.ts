// navigation-state.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavigationStateService {
  private originDashboard: 'admin' | 'mentor' = 'admin';
  
  setOrigin(dashboard: 'admin' | 'mentor') {
    this.originDashboard = dashboard;
  }
  
  getOrigin(): 'admin' | 'mentor' {
    return this.originDashboard;
  }
}