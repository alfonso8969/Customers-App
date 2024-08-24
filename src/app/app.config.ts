import { JsonPipe, registerLocaleData } from '@angular/common';
import { ApplicationConfig, LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { PersonService } from './persons/data-access/person.service';
import { StoragePersonService } from './persons/data-access/storage.service';
import { StorageBudgetService } from './presupuesto/data-access/storage.service';
import { BudgetService } from './presupuesto/data-access/budget.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import localeEs from '@angular/common/locales/es';
registerLocaleData(localeEs);


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    PersonService,
    StoragePersonService,
    JsonPipe,
    BudgetService,
    StorageBudgetService,
    InputTextModule,
    TooltipModule,
    ButtonModule,
    BrowserAnimationsModule,
    {
      provide: LOCALE_ID,
      useValue: 'es' // 'de-DE' for Germany, 'fr-FR' for France ...
    },

  ]
};
