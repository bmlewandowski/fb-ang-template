import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';


import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

const firebaseConfig = {
  apiKey: "AIzaSyCdwq-x1D3ltR7iH6QJfrljxwg2VMBSqnk",
  authDomain: "pgp-site.firebaseapp.com",
  databaseURL: "https://pgp-site-default-rtdb.firebaseio.com",
  projectId: "pgp-site",
  storageBucket: "pgp-site.appspot.com",
  messagingSenderId: "880007784358",
  appId: "1:880007784358:web:85f9a7b0e53913b58bd167"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom([
      AngularFireDatabaseModule,
      AngularFireStorageModule,
      AngularFireModule.initializeApp(firebaseConfig),
      provideFirebaseApp(() => initializeApp(firebaseConfig)),
      provideAuth(() => getAuth())
    ]), provideAnimationsAsync(),
  ],

};
