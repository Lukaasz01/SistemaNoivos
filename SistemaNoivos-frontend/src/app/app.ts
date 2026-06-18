import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Módulo mágico de navegação!
import { TaskService } from './pages/tasks/task.service';

@Component({
  selector: 'app-root',
  standalone: true,
  // Trocamos os componentes fixos pelo RouterModule
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  // Mantemos o TaskService aqui para a bolinha do menu com o número de pendências
  taskService = inject(TaskService);
}
