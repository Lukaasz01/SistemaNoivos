import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { TaskListComponent } from './pages/tasks/task-list.component';
import { GuestListComponent } from './pages/guests/guest-list.component';
import { BudgetListComponent } from './pages/budget/budget-list.component';
import { VendorListComponent } from './pages/vendors/vendor-list.component';
import { SettingsComponent } from './pages/settings/settings.component';

// 👇 NOVOS IMPORTS DE SEGURANÇA 👇
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  // 🔓 ROTA ABERTA: Tela de Login (Livre para qualquer usuário acessar)
  { path: 'login', component: LoginComponent },

  // 🔒 ROTAS PROTEGIDAS: Todo o ecossistema agora está blindado pelo AuthGuard
  {
    path: '',
    canActivate: [authGuard], // 👈 Exige o Token JWT para qualquer rota filha abaixo
    children: [
      // Rota inicial limpa dentro do painel logado
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

      // Caminhos oficiais do seu ecossistema protegidos
      { path: 'dashboard', component: DashboardComponent },
      { path: 'tasks', component: TaskListComponent },
      { path: 'guests', component: GuestListComponent },
      { path: 'budget', component: BudgetListComponent },
      { path: 'vendors', component: VendorListComponent },
      { path: 'settings', component: SettingsComponent }
    ]
  },

  // 🚪 ROTA CURINGA: Se digitar qualquer URL inválida, joga para o Dashboard.
  // Se o usuário não tiver o token, o Guard interceptará e o jogará para a tela de login automaticamente.
  { path: '**', redirectTo: 'dashboard' }
];
