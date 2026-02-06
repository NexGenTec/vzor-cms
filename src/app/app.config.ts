import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideClientHydration } from '@angular/platform-browser';
import { routes } from './app-routing.module'; 
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { environment } from '../environments/environment';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers:
   [ provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideClientHydration(),
    { provide: FIREBASE_OPTIONS, useValue: environment.firebaseConfig },
    { provide: 'FIRESTORE_DATABASE_ID', useValue: environment.firestoreConfig.databaseId },
    { provide: 'FIRESTORE_SETTINGS', useValue: { databaseId: environment.firestoreConfig.databaseId } },
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideStorage(() => getStorage()),
    provideFirestore(() => getFirestore()),
   ]
};