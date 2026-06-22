import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core'; // 👈 Adicionado OnInit
import { CommonModule } from '@angular/common';
import { TaskService } from './task.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent implements OnInit { // 👈 Implementando OnInit
  taskService = inject(TaskService);

  // Carrega as tarefas assim que entra na tela
  ngOnInit(): void {
    this.taskService.getAllTasks().subscribe({
      error: (err) => console.error('Erro ao buscar tarefas do Java:', err)
    });
  }

  // Executa a ação de alternar o status chamando o back-end
  onToggleTask(id: number): void {
    this.taskService.toggleTask(id).subscribe({
      error: (err) => console.error('Erro ao alternar status da tarefa:', err)
    });
  }

  // Executa a exclusão no banco
  onDeleteTask(id: number): void {
    if (confirm('Deseja realmente excluir esta tarefa?')) {
      this.taskService.deleteTask(id).subscribe({
        error: (err) => console.error('Erro ao deletar tarefa:', err)
      });
    }
  }

  getCategoryBadgeClass(theme: string): string {
    switch(theme) {
      case 'primary': return 'badge-primary';
      case 'accent': return 'badge-accent';
      case 'warning': return 'badge-warning';
      case 'info': return 'badge-info';
      default: return 'badge-secondary';
    }
  }
}
