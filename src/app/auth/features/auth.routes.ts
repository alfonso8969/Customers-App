import { Routes } from '@angular/router';

export default [
  {
    path: 'log-in',
    loadComponent: () => import('./log-in/log-in.component').then(m => m.LogInComponent),
  },
  {
    path: 'sign-up',
    loadComponent: () => import('./sign-up/sign-up.component').then(m => m.SignUpComponent),
  },
] as Routes;
