import { Routes } from '@angular/router';

export default [
  {
    path: 'presupuesto/:id',
    loadComponent: () => import('./cabecero/cabecero.component').then(m => m.CabeceroComponent)
  }
] as Routes;
