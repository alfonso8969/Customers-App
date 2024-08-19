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
  {
    path: 'edit/:id',
    loadComponent: () => import('./form/form.component').then(m => m.FormComponent)
  },
  {
    path: 'new',
    loadComponent: () => import('./form/form.component').then(m => m.FormComponent)
  }
] as Routes;
