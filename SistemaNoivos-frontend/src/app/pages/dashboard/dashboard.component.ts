import { Component, inject, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TaskService } from '../tasks/task.service';
import { GuestService } from '../guests/guest.service';
import { Vendor } from '../../models/wedding.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, DecimalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  // Injetando os serviços reais que você já criou!
  taskService = inject(TaskService);
  guestService = inject(GuestService);

  // Computa apenas as próximas 3 tarefas pendentes para o resumo
  upcomingTasks = computed(() => {
    return this.taskService.tasks().filter(t => !t.completed).slice(0, 3);
  });

  // Estado Temporário do Orçamento (Até criarmos o BudgetService)
  budget = signal({
    spent: 45200,
    estimated: 75000,
    percentage: 60
  });

  // Estado Temporário dos Fornecedores (Até criarmos o VendorService)
  vendors = signal<Vendor[]>([
    {
      id: 1, name: 'Studio Luz', category: 'Fotografia e Vídeo', status: 'Contratado',
      icon: 'fa-solid fa-camera', iconColor: 'text-success', bgClass: 'bg-success bg-opacity-10', badgeClass: 'bg-success bg-opacity-25 text-success'
    },
    {
      id: 2, name: 'Banda Viva', category: 'Música / DJ', status: 'Contratado',
      icon: 'fa-solid fa-music', iconColor: 'text-primary', bgClass: 'bg-primary bg-opacity-10', badgeClass: 'bg-success bg-opacity-25 text-success'
    },
    {
      id: 3, name: 'A definir', category: 'Bolo e Doces', status: 'Orçando',
      icon: 'fa-solid fa-cake-candles', iconColor: 'text-warning', bgClass: 'bg-warning bg-opacity-10', badgeClass: 'bg-warning bg-opacity-25 text-warning'
    }
  ]);
}
