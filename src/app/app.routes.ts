import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', title: 'Charlie Clark | CV', loadComponent: () => import('./cv').then(m => m.Cv) },
  { path: 'timeline', title: 'Charlie Clark | Timeline', loadComponent: () => import('./timeline').then(m => m.Timeline) },
  { path: 'blog', title: 'Charlie Clark | Blog', loadComponent: () => import('./blog').then(m => m.Blog) },
  { path: '**', redirectTo: '' },
];
