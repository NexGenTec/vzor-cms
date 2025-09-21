import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideClientHydration } from '@angular/platform-browser';
import { routes } from './app-routing.module'; 
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { environment } from '../environments/environment.prod';

export const appConfig: ApplicationConfig = {
  providers:
   [ provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideClientHydration(),
    { provide: FIREBASE_OPTIONS, useValue: environment.firebaseConfig },
   ]
};