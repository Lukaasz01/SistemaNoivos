import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { TaskListComponent } from './pages/tasks/task-list.component';
import { GuestListComponent } from './pages/guests/guest-list.component';
import { BudgetListComponent } from './pages/budget/budget-list.component';
import { VendorListComponent } from './pages/vendors/vendor-list.component';
import { SettingsComponent } from './pages/settings/settings.component';

export const routes: Routes = [
  // Rota inicial redireciona para o dashboard de forma limpa
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  // Caminhos oficiais do seu ecossistema
  { path: 'dashboard', component: DashboardComponent },
  { path: 'tasks', component: TaskListComponent },
  { path: 'guests', component: GuestListComponent },
  { path: 'budget', component: BudgetListComponent },
  { path: 'vendors', component: VendorListComponent },
  { path: 'settings', component: SettingsComponent },

  // Rota curinga: se o usuário digitar qualquer coisa errada, volta para o início
  { path: '**', redirectTo: 'dashboard' }
];
