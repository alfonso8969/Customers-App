import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./list/persons.component').then(m => m.PersonsComponent),
  },
  {
    path: 'person/:id',
    loadComponent: () => import('./detail/person.component').then(m => m.PersonComponent)
  },
] as Routes;
