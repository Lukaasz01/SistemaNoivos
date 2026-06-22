import { Injectable, signal, computed, inject } from '@angular/core';
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

  // Inicializa o estado vazio, aguardando o banco de dados
  tasks = signal<Task[]>([]);
  currentFilter = signal<FilterType>('all');

  // --- ESTATÍSTICAS E FILTROS COMPUTADOS ---
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

  // --- AÇÕES LOCAIS ---
  setFilter(filter: FilterType) {
    this.currentFilter.set(filter);
  }

  // --- INTEGRAÇÃO COM O BACK-END (JAVA) ---

  getAllTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl).pipe(
      tap(dados => this.tasks.set(dados))
    );
  }

  addTask(taskData: Omit<Task, 'id'>): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, taskData).pipe(
      tap(newTask => {
        // Adiciona a nova tarefa no topo da lista local
        this.tasks.update(allTasks => [newTask, ...allTasks]);
      })
    );
  }

  updateTask(id: number, updatedData: Partial<Task>): Observable<Task> {
    // Busca a tarefa local primeiro para mesclar com os novos dados
    const currentTask = this.tasks().find(t => t.id === id);
    if (!currentTask) throw new Error('Tarefa não encontrada localmente');

    const taskToSave = { ...currentTask, ...updatedData };

    return this.http.put<Task>(`${this.apiUrl}/${id}`, taskToSave).pipe(
      tap(updatedTask => {
        this.tasks.update(tasks => tasks.map(t => t.id === id ? updatedTask : t));
      })
    );
  }

  toggleTask(id: number): Observable<Task> {
    const taskToToggle = this.tasks().find(t => t.id === id);
    if (!taskToToggle) throw new Error('Tarefa não encontrada localmente');

    // Inverte o status de completed
    const updatedTask = { ...taskToToggle, completed: !taskToToggle.completed };

    return this.http.put<Task>(`${this.apiUrl}/${id}`, updatedTask).pipe(
      tap(taskSalvaNoBanco => {
        this.tasks.update(tasks => tasks.map(t => t.id === id ? taskSalvaNoBanco : t));
      })
    );
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.tasks.update(tasks => tasks.filter(t => t.id !== id)))
    );
  }
}
