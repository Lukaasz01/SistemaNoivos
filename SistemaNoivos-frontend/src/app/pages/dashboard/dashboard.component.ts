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
  taskService = inject(TaskService);
  guestService = inject(GuestService);

  upcomingTasks = computed(() => {
    return this.taskService.tasks().filter(t => !t.completed).slice(0, 3);
  });

  budget = signal({
    spent: 45200,
    estimated: 75000,
    percentage: 60
  });

  // Lista de fornecedores do resumo atualizada para o novo modelo estrito
  vendors = signal<Vendor[]>([
    {
      id: 1, name: 'Studio Luz', category: 'Fotografia', status: 'Contratado',
      contactName: 'Marcos Santos', phone: '(11) 99999-3333', cost: 8200, rating: 4, isFavorite: true,
      icon: 'fa-solid fa-camera', iconColor: 'text-success', bgClass: 'bg-success bg-opacity-10', badgeClass: 'bg-success bg-opacity-25 text-success'
    },
    {
      id: 2, name: 'Banda Viva', category: 'Música', status: 'Contratado',
      contactName: 'Rafa & Banda', phone: '(11) 99999-4444', cost: 5000, rating: 4, isFavorite: false,
      icon: 'fa-solid fa-music', iconColor: 'text-primary', bgClass: 'bg-primary bg-opacity-10', badgeClass: 'bg-success bg-opacity-25 text-success'
    },
    {
      id: 3, name: 'A definir', category: 'Buffet', status: 'Orçando',
      contactName: '-', phone: '-', cost: 0, rating: 0, isFavorite: false,
      icon: 'fa-solid fa-cake-candles', iconColor: 'text-warning', bgClass: 'bg-warning bg-opacity-10', badgeClass: 'bg-warning bg-opacity-25 text-warning'
    }
  ]);
}
