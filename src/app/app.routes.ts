import { Routes } from '@angular/router';
import { privateGuard, publicGuard } from './core/guards/auth.guards';

export const routes: Routes = [
  // rutas publicas
  {
    path: 'auth',
    canActivate: [publicGuard],
    loadChildren: () => import('./auth/features/auth.routes'),
  },
  // rutas privadas
  {
    path: '',
    canActivate: [privateGuard],
    loadComponent: () => import('./shared/ui/layout/layout.component'),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
      },
      {
        path: 'persons',
        loadChildren: () => import('./persons/features/persons.routes'),
      },
      {
        path: 'presupuestos',
        loadChildren: () => import('./presupuesto/features/presupuesto.routes'),
      },
      {
        path: '**',
        redirectTo: 'dashboard',
      },
    ],
  },

  {
    path: '**',
    loadComponent: () => import('./error/error.component').then(m => m.ErrorComponent),
  },
];
