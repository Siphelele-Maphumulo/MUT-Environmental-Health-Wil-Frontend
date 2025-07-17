import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideZoneChangeDetection } from '@angular/core';

// Import routes
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // Zone.js optimization for change detection
    provideZoneChangeDetection({ eventCoalescing: true }),

    // Client-side hydration support
    provideClientHydration(),

    // HTTP client with fetch and interceptors
    provideHttpClient(
      withFetch(),
      withInterceptors([]) // Add interceptors here if needed
    ),

    // Async animations support
    provideAnimationsAsync(),

    // Router configuration
    provideRouter(appRoutes),
  ],
};
