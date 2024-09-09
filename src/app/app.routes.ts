import { Routes } from '@angular/router';
import { AuthGuard, publicGuard } from './core/guards/auth.guards';

export const routes: Routes = [
  // rutas publicas
  {
    path: 'auth',
    canActivate: [publicGuard],
    loadChildren: () => import('./auth/features/auth.routes')
  },
  // rutas privadas
  {
    path: '',
    loadComponent: () => import('./shared/ui/layout/layout.component'),
    children: [
      {
        path: 'dashboard',
        canActivate: [publicGuard],
        title: 'Dashboard',
        data: { rol: ['ALL'] },
        loadComponent: () =>
          import('./dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),

      },
      {
        path: 'persons',
        canActivate: [AuthGuard],
        data: { rol: ['admin', 'user'] },
        title: 'Personas',
        loadChildren: () => import('./persons/features/persons.routes'),
      },
      {
        path: 'budgets',
        canActivate: [AuthGuard],
        data: { rol: ['admin', 'user'] },
        title: 'Presupuesto',
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
    loadComponent: () =>
      import('./error/error.component').then((m) => m.ErrorComponent),
  },
];
