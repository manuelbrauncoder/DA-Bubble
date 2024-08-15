import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'da-bubble-f85f7',
        appId: '1:409857167813:web:f0b5d9eee028f62a94bbac',
        storageBucket: 'da-bubble-f85f7.appspot.com',
        // locationId: 'europe-west',
        apiKey: 'AIzaSyBYHdvmgztRunwFGFtpHZkLW7veQposscE',
        authDomain: 'da-bubble-f85f7.firebaseapp.com',
        messagingSenderId: '409857167813',
      })
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
  ],
};
