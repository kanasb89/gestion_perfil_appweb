import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    children: [
      {
        path: 'perfil',
        loadComponent: () =>
          import('./components/perfil/perfil.component').then(m => m.PerfilComponent)
      },
      { path: '', redirectTo: 'perfil', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '/login' }
];