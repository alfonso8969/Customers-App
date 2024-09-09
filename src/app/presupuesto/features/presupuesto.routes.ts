import { Routes } from '@angular/router';

export default [
  {
    path: 'budget/:budgetId',
    title: 'Presupuesto',
    loadComponent: () => import('./cabecero/cabecero.component').then(m => m.CabeceroComponent),
  },
  {
    path: 'budget',
    title: 'Presupuesto',
    loadComponent: () => import('./cabecero/cabecero.component').then(m => m.CabeceroComponent)
  }
] as Routes;
