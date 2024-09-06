import { Routes } from '@angular/router';

export default [
  {
    path: 'presupuesto/:budgetId',
    title: 'Presupuesto',
    loadComponent: () => import('./cabecero/cabecero.component').then(m => m.CabeceroComponent),
  },
  {
    path: 'presupuesto',
    title: 'Presupuesto',
    loadComponent: () => import('./cabecero/cabecero.component').then(m => m.CabeceroComponent)
  }
] as Routes;
