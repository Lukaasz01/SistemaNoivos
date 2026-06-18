import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { TaskListComponent } from './pages/tasks/task-list.component';
import { GuestListComponent } from './pages/guests/guest-list.component';
import { BudgetListComponent } from './pages/budget/budget-list.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'tasks', component: TaskListComponent },
  { path: 'guests', component: GuestListComponent },
  { path: 'budget', component: BudgetListComponent },
  { path: '**', redirectTo: '' }
];
