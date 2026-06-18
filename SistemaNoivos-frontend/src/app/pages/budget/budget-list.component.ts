import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { BudgetService } from './budget.service';
import { Expense, PaymentStatus } from '../../models/wedding.model';

@Component({
  selector: 'app-budget-list',
  standalone: true,
  imports: [CommonModule, DecimalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './budget-list.component.html',
  styleUrl: './budget-list.component.css'
})
export class BudgetListComponent {
  budgetService = inject(BudgetService);

  getExpenseStatus(expense: Expense): PaymentStatus {
    return this.budgetService.getExpenseStatus(expense);
  }

  getPaymentStatusClass(status: PaymentStatus): string {
    switch (status) {
      case 'Pago': return 'bg-success bg-opacity-10 text-success';
      case 'Parcial': return 'bg-warning bg-opacity-10 text-warning';
      case 'Pendente': return 'bg-danger bg-opacity-10 text-danger';
    }
  }
}
