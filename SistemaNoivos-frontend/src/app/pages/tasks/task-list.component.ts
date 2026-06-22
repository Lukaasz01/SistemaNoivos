import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
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
 export class TaskListComponent {
   taskService = inject(TaskService);

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
