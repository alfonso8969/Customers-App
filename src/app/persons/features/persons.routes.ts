import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./list/persons.component').then(m => m.PersonsComponent),
  },
  {
    path: 'person/:id',
    title: 'Detalle',
    loadComponent: () => import('./detail/person.component').then(m => m.PersonComponent),
  },
  {
    path: 'edit/:id',
    title: 'Edición',
    loadComponent: () => import('./form/form.component').then(m => m.FormComponent)
  },
  {
    path: 'new',
    title: 'Nuevo',
    loadComponent: () => import('./form/form.component').then(m => m.FormComponent)
  }
] as Routes;
