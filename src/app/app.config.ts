
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
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
registerLocaleData(localeEs);


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    JsonPipe,
    PersonService,
    StoragePersonService,
    FirePersonStorageService,
    BudgetService,
    StorageBudgetService,
    LoginService,
    InputTextModule,
    TooltipModule,
    ButtonModule,
    BrowserAnimationsModule,
    AngularFireAuthModule,
    AngularFireModule,
    AngularFireDatabaseModule,
    {
      provide: LOCALE_ID,
      useValue: 'es-ES', // 'de-DE' for Germany, 'fr-FR' for France ...
    },
  ],
};
