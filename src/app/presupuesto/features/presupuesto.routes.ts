import { Routes } from '@angular/router';

export default [
  {
    path: 'presupuesto/:budgetId',
    loadComponent: () => import('./cabecero/cabecero.component').then(m => m.CabeceroComponent)
  },
  {
    path: 'presupuesto',
    loadComponent: () => import('./cabecero/cabecero.component').then(m => m.CabeceroComponent)
  }
] as Routes;
