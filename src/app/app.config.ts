import { JsonPipe } from '@angular/common';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { PersonService } from './persons/data-access/person.service';
import { StoragePersonService } from './persons/data-access/storage.service';
import { StorageBudgetService } from './presupuesto/data-access/storage.service';
import { BudgetService } from './presupuesto/data-access/budget.service';


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    PersonService,
    StoragePersonService,
    JsonPipe,
    BudgetService,
    StorageBudgetService

  ]
};
