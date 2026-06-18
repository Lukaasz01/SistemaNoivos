import { Injectable, signal, computed } from '@angular/core';
import { Task } from '../../models/wedding.model'; // Importando a tipagem centralizada!

export type FilterType = 'all' | 'pending' | 'completed';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  // Estado Base
  tasks = signal<Task[]>([
    { id: 1, title: 'Degustação do Buffet Fasano', date: 'Hoje, 19:00', category: 'Buffet', categoryTheme: 'warning', completed: false, isOverdue: true },
    { id: 2, title: 'Aprovar arte do convite com o designer', date: 'Amanhã', category: 'Convites', categoryTheme: 'accent', completed: false, isOverdue: true },
    { id: 3, title: 'Pagar 2ª parcela do Fotógrafo', date: '20 Jun 2026', category: 'Financeiro', categoryTheme: 'secondary', completed: false },
    { id: 4, title: 'Primeira prova do vestido de noiva', date: '15 Jul 2026', category: 'Trajes', categoryTheme: 'primary', completed: false },
    { id: 5, title: 'Definir lista de padrinhos', date: '01 Ago 2026', category: 'Convidados', categoryTheme: 'info', completed: false },
    { id: 6, title: 'Visitar espaço Fazenda Santa Bárbara', date: '10 Fev 2026', category: 'Local', categoryTheme: 'accent', completed: true },
    { id: 7, title: 'Criar pasta de inspirações (Pinterest)', date: '05 Fev 2026', category: 'Planejamento', categoryTheme: 'primary', completed: true },
  ]);

  // Estado do Filtro
  currentFilter = signal<FilterType>('all');

  // Computed Properties
  filteredTasks = computed(() => {
    const filter = this.currentFilter();
    const allTasks = this.tasks();

    if (filter === 'pending') return allTasks.filter(t => !t.completed);
    if (filter === 'completed') return allTasks.filter(t => t.completed);
    return allTasks;
  });

  totalCount = computed(() => this.tasks().length);
  completedCount = computed(() => this.tasks().filter(t => t.completed).length);
  pendingCount = computed(() => this.totalCount() - this.completedCount());

  progressPercentage = computed(() => {
    const total = this.totalCount();
    if (total === 0) return 0;
    return Math.round((this.completedCount() / total) * 100);
  });

  // Ações
  setFilter(filter: FilterType) {
    this.currentFilter.set(filter);
  }

  toggleTask(id: number) {
    this.tasks.update(tasks =>
      tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }
}
