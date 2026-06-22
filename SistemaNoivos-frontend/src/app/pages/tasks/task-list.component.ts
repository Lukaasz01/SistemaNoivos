import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskService } from './task.service';
import { Task } from '../../models/wedding.model';
import { DateMaskDirective } from '../../shared/directives/date-mask';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DateMaskDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent implements OnInit {
  taskService = inject(TaskService);
  private fb = inject(FormBuilder);

  taskForm!: FormGroup;
  editingTaskId: number | null = null;

  ngOnInit(): void {
    this.loadTasks();
    this.initForm();
  }

  loadTasks() {
    this.taskService.getAllTasks().subscribe({
      error: (err) => console.error('Erro ao conectar com o banco de dados:', err)
    });
  }

  initForm() {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      date: ['', Validators.required],
      category: ['Planejamento', Validators.required]
    });
  }

  getThemeByCategory(category: string): 'primary' | 'success' | 'warning' | 'info' | 'secondary' | 'accent' {
    switch(category) {
      case 'Buffet': return 'warning';
      case 'Convites': return 'accent';
      case 'Financeiro': return 'secondary';
      case 'Trajes': return 'primary';
      case 'Convidados': return 'info';
      case 'Local': return 'accent';
      default: return 'primary';
    }
  }

  resetForm() {
    this.editingTaskId = null;
    this.taskForm.reset({ category: 'Planejamento' });
  }

  openEditModal(task: Task) {
    this.editingTaskId = task.id;
    this.taskForm.patchValue({
      title: task.title,
      date: task.date,
      category: task.category
    });

    const modalElement = document.getElementById('addTaskModal');
    if (modalElement) {
      const modal = new (window as any).bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  deleteTask(id: number) {
    if (confirm('Deseja realmente excluir esta tarefa?')) {
      this.taskService.deleteTask(id).subscribe({
        error: (err) => console.error('Erro ao deletar:', err)
      });
    }
  }

  toggleTask(id: number) {
    this.taskService.toggleTask(id).subscribe({
      error: (err) => console.error('Erro ao atualizar status:', err)
    });
  }

  onSubmit() {
    if (this.taskForm.valid) {
      const { title, date, category } = this.taskForm.value;
      const categoryTheme = this.getThemeByCategory(category);

      if (this.editingTaskId) {
        this.taskService.updateTask(this.editingTaskId, { title, date, category, categoryTheme }).subscribe({
          next: () => this.closeModal(),
          error: (err) => {
            console.error('Erro ao editar:', err);
            alert('❌ O Java recusou a edição!');
          }
        });
      } else {
        this.taskService.addTask({
          title,
          date,
          category,
          categoryTheme,
          completed: false,
          isOverdue: false
        }).subscribe({
          next: () => this.closeModal(),
          error: (err) => {
            console.error('Erro ao criar:', err);
            alert('❌ O Java recusou salvar a tarefa!');
          }
        });
      }
    } else {
      this.taskForm.markAllAsTouched();
      alert('⚠️ Preencha todos os campos corretamente antes de salvar.');
    }
  }

  closeModal() {
    this.resetForm();
    const modalElement = document.getElementById('addTaskModal');
    if (modalElement) {
      let modal = (window as any).bootstrap.Modal.getInstance(modalElement);
      if (!modal) {
        modal = new (window as any).bootstrap.Modal(modalElement);
      }
      modal.hide();

      document.body.classList.remove('modal-open');
      const backdrops = document.querySelectorAll('.modal-backdrop');
      backdrops.forEach(b => b.remove());
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
