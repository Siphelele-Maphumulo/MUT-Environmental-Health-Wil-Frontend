import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CodeService {
  trackGeneratedCode(appId: number, code: string, email: string): void {
    // Implement your code tracking logic here
    console.log(`Tracking code ${code} for app ${appId} (${email})`);
    // You might want to store this in a service or send to your backend
  }
}
