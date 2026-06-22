import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Task } from '../../models/wedding.model';
import { environment } from '../../../environments/environment';

export type FilterType = 'all' | 'pending' | 'completed';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/tasks`;

  // Estado Base inicializado vazio esperando o Java
  tasks = signal<Task[]>([]);
  currentFilter = signal<FilterType>('all');

  // Computed Properties (Permanecem IGUAIS! A reatividade do Angular Signals faz a mágica)
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

  // --- CHAMADAS DA API JAVA ---

  // Buscar tarefas do PostgreSQL
  getAllTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl).pipe(
      tap(dados => this.tasks.set(dados))
    );
  }

  // Mudar status (concluir/desmarcar) salvando no banco
  toggleTask(id: number): Observable<Task> {
    const taskToUpdate = this.tasks().find(t => t.id === id);
    if (!taskToUpdate) throw new Error('Tarefa não encontrada localmente');

    const updatedTask = { ...taskToUpdate, completed: !taskToUpdate.completed };

    return this.http.put<Task>(`${this.apiUrl}/${id}`, updatedTask).pipe(
      tap(taskSalva => {
        this.tasks.update(lista => lista.map(t => t.id === id ? taskSalva : t));
      })
    );
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.tasks.update(lista => lista.filter(t => t.id !== id)))
    );
  }

  setFilter(filter: FilterType) {
    this.currentFilter.set(filter);
  }
}
