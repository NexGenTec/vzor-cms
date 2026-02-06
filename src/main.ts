import { enableProdMode, importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import { AppRoutingModule } from './app/app-routing.module';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore, connectFirestoreEmulator } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
  //show this warning only on prod mode
  if (typeof window !== 'undefined') {
    selfXSSWarning();
  }
}

// Console para verificar la configuración de Firestore
console.log('🔥 Firestore Configuration:', {
  projectId: environment.firebaseConfig.projectId,
  databaseId: environment.firestoreConfig.databaseId,
  expectedUrl: `projects/${environment.firebaseConfig.projectId}/databases/${environment.firestoreConfig.databaseId}`,
  fullConfig: environment
});

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule, AppRoutingModule),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideFirestore(() => {
      const firestore = getFirestore(initializeApp(environment.firebaseConfig), environment.firestoreConfig.databaseId);
      console.log('🔥 Firestore initialized with database:', environment.firestoreConfig.databaseId);
      return firestore;
    }),
    provideAuth(() => getAuth(initializeApp(environment.firebaseConfig))),
    provideStorage(() => getStorage(initializeApp(environment.firebaseConfig))),
    provideAnimations()
  ],
}).catch((err) => console.error(err));

function selfXSSWarning() {
  setTimeout(() => {
    console.log(
      '%c** STOP **',
      'font-weight:bold; font: 2.5em Arial; color: white; background-color: #e11d48; padding-left: 15px; padding-right: 15px; border-radius: 25px; padding-top: 5px; padding-bottom: 5px;',
    );
    console.log(
      `\n%cThis is a browser feature intended for developers. Using this console may allow attackers to impersonate you and steal your information sing an attack called Self-XSS. Do not enter or paste code that you do not understand.`,
      'font-weight:bold; font: 2em Arial; color: #e11d48;',
    );
  });
}