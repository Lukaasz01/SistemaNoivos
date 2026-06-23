import { Component, inject, ChangeDetectionStrategy, computed, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TaskService } from '../tasks/task.service';
import { GuestService } from '../guests/guest.service';
import { VendorService } from '../vendors/vendor.service';
import { BudgetService } from '../budget/budget.service';
import { VendorStatus } from '../../models/wedding.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, DecimalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  taskService = inject(TaskService);
  guestService = inject(GuestService);
  vendorService = inject(VendorService);
  budgetService = inject(BudgetService);

  ngOnInit(): void {
    this.taskService.getAllTasks().subscribe();
    this.guestService.getAllGuests().subscribe();
    this.vendorService.getAllVendors().subscribe();
    this.budgetService.getAllExpenses().subscribe();
  }

  upcomingTasks = computed(() => {
    return this.taskService.tasks().filter(t => !t.completed).slice(0, 4);
  });

  budgetSummary = computed(() => {
    const summary = this.budgetService.summary();
    const spent = summary.actual;
    const estimated = summary.estimated;
    const percentage = estimated > 0 ? Math.min(Math.round((spent / estimated) * 100), 100) : 0;

    return { spent, estimated, percentage };
  });

  topBudgetCategories = computed(() => {
    return this.budgetService.categoryBreakdown().slice(0, 2);
  });

  dashboardVendors = computed(() => {
    return this.vendorService.vendors().slice(0, 6);
  });

  getVendorIconStyles(category: string) {
    switch(category) {
      case 'Fotografia': case 'Foto & Vídeo': return { icon: 'fa-camera', color: 'text-success', bg: 'bg-success bg-opacity-10' };
      case 'Música': return { icon: 'fa-music', color: 'text-primary', bg: 'bg-primary bg-opacity-10' };
      case 'Buffet': case 'Espaço & Buffet': return { icon: 'fa-utensils', color: 'text-warning', bg: 'bg-warning bg-opacity-10' };
      case 'Decoração': return { icon: 'fa-wand-magic-sparkles', color: 'text-info', bg: 'bg-info bg-opacity-10' };
      case 'Espaço': return { icon: 'fa-tree', color: 'text-success', bg: 'bg-success bg-opacity-10' };
      case 'Trajes': return { icon: 'fa-shirt', color: 'text-danger', bg: 'bg-danger bg-opacity-10' };
      case 'Assessoria': return { icon: 'fa-gem', color: 'text-secondary', bg: 'bg-secondary bg-opacity-10' };
      default: return { icon: 'fa-store', color: 'text-dark', bg: 'bg-light' };
    }
  }

  getVendorBadgeClass(status: VendorStatus): string {
    switch (status) {
      case 'Contratado': return 'bg-success bg-opacity-25 text-success';
      case 'Em Negociação': return 'bg-warning bg-opacity-25 text-warning';
      case 'Orçando': return 'bg-secondary bg-opacity-25 text-secondary';
    }
  }
}
