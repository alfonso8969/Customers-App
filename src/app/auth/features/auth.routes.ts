import { Routes } from '@angular/router';
import { publicGuard } from '../../core/guards/auth.guards';

export default [
  {
    path: 'login',
    title: 'Login',
    loadComponent: () => import('./log-in/log-in.component').then(m => m.LogInComponent),
  },
  {
    path: 'signup',
    title: 'Registro',
    loadComponent: () => import('./sign-up/sign-up.component').then(m => m.SignUpComponent),
  }
] as Routes;
