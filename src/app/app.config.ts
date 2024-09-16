import { environment } from './../environments/environment.development';

import { JsonPipe, registerLocaleData } from '@angular/common';
import { ApplicationConfig, LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { StoragePersonService } from './persons/data-access/storage.service';
import { StorageBudgetService } from './presupuesto/data-access/storage.service';
import { PersonService } from './persons/data-access/person.service';
import { BudgetService } from './presupuesto/data-access/budget.service';
import { LoginService } from './auth/data-access/login.service';
import { FirePersonStorageService } from './persons/data-access/storage.fcoll.service';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import localeEs from '@angular/common/locales/es';
import { AngularFireModule, FIREBASE_APP_NAME, FIREBASE_OPTIONS } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import {
  AngularFirestoreModule,

} from '@angular/fire/compat/firestore';
import { provideFirebaseApp } from '@angular/fire/app';
import { provideFirestore } from '@angular/fire/firestore';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
registerLocaleData(localeEs);


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    JsonPipe,
    LoginService,
    PersonService,
    StoragePersonService,
    FirePersonStorageService,
    BudgetService,
    StorageBudgetService,
    InputTextModule,
    TooltipModule,
    ButtonModule,
    BrowserAnimationsModule,
    AngularFireModule,
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    provideFirebaseApp(() => initializeApp(environment.firestore)),
    provideFirestore(() => getFirestore()),
    {
      provide: FIREBASE_OPTIONS,
      useValue: { ...environment.firestore }
    },
    {
      provide: LOCALE_ID,
      useValue: 'es-ES', // 'de-DE' for Germany, 'fr-FR' for France ...
    },
  ],
};
