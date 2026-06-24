import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TaskService } from './pages/tasks/task.service';
import { AuthService } from './core/auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  // Mantemos o TaskService aqui para a bolinha do menu com o número de pendências
  taskService = inject(TaskService);

  // 🔐 Injeta o serviço de autenticação global
  public authService = inject(AuthService);
}
