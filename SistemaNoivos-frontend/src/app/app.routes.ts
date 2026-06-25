import { Routes } from '@angular/router';

// 🟢 CORREÇÃO AQUI: Apontando os dois guards para a pasta física correta (/core/guard/)
import { authGuard } from './core/guard/auth.guard';
import { loginGuard } from './core/guard/login.guard';

export const routes: Routes = [
  // 🔓 TELA DE LOGIN: Protegida pelo loginGuard (se o usuário já estiver logado, não consegue entrar aqui)
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
    canActivate: [loginGuard]
  },

  // 🔒 ROTAS PROTEGIDAS: Todo o ecossistema envelopado pelo AuthGuard usando Lazy Loading
  {
    path: '',
    canActivate: [authGuard],
    children: [
      // Rota inicial limpa dentro do painel logado
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

      // 🟢 COMPONENTES CARREGADOS SOB DEMANDA (Lazy Loading)
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'tasks',
        loadComponent: () => import('./pages/tasks/task-list.component').then(m => m.TaskListComponent)
      },
      {
        path: 'guests',
        loadComponent: () => import('./pages/guests/guest-list.component').then(m => m.GuestListComponent)
      },
      {
        path: 'budget',
        loadComponent: () => import('./pages/budget/budget-list.component').then(m => m.BudgetListComponent)
      },
      {
        path: 'vendors',
        loadComponent: () => import('./pages/vendors/vendor-list.component').then(m => m.VendorListComponent)
      },
      {
        path: 'settings',
        loadComponent: () => import('./pages/settings/settings.component').then(m => m.SettingsComponent)
      }
    ]
  },

  // 🚪 ROTA CURINGA: Se digitar qualquer URL inválida, joga para o Dashboard.
  { path: '**', redirectTo: 'dashboard' }
];
