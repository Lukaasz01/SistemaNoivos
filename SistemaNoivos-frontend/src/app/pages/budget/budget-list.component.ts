import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BudgetService } from './budget.service';
import { Expense, PaymentStatus } from '../../models/wedding.model';

@Component({
  selector: 'app-budget-list',
  standalone: true,
  imports: [CommonModule, DecimalPipe, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './budget-list.component.html',
  styleUrl: './budget-list.component.css'
})
export class BudgetListComponent implements OnInit {
  budgetService = inject(BudgetService);
  private fb = inject(FormBuilder);

  expenseForm!: FormGroup;
  editingExpenseId: number | null = null;

  ngOnInit(): void {
    this.budgetService.getAllExpenses().subscribe({
      error: (err) => console.error('Erro ao buscar orçamento:', err)
    });
    this.initForm();
  }

  initForm() {
    this.expenseForm = this.fb.group({
      description: ['', Validators.required],
      category: ['Espaço & Buffet', Validators.required],
      estimatedCost: [0, [Validators.required, Validators.min(0)]],
      actualCost: [0, [Validators.required, Validators.min(0)]],
      paidAmount: [0, [Validators.required, Validators.min(0)]]
    });
  }

  resetForm() {
    this.editingExpenseId = null;
    this.expenseForm.reset({
      category: 'Espaço & Buffet',
      estimatedCost: 0,
      actualCost: 0,
      paidAmount: 0
    });
  }

  openEditModal(expense: Expense) {
    this.editingExpenseId = expense.id;
    this.expenseForm.patchValue({
      description: expense.description,
      category: expense.category,
      estimatedCost: expense.estimatedCost,
      actualCost: expense.actualCost,
      paidAmount: expense.paidAmount
    });

    const modalElement = document.getElementById('addExpenseModal');
    if (modalElement) {
      const modal = new (window as any).bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  deleteExpense(id: number) {
    if (confirm('Deseja realmente excluir esta despesa?')) {
      this.budgetService.deleteExpense(id).subscribe({
        error: (err) => console.error('Erro ao deletar despesa:', err)
      });
    }
  }

  onSubmit() {
    if (this.expenseForm.valid) {
      const expenseData = this.expenseForm.value;

      if (this.editingExpenseId) {
        this.budgetService.updateExpense(this.editingExpenseId, expenseData).subscribe({
          next: () => this.closeModal(),
          error: (err) => console.error('Erro ao editar:', err)
        });
      } else {
        this.budgetService.addExpense(expenseData).subscribe({
          next: () => this.closeModal(),
          error: (err) => console.error('Erro ao criar:', err)
        });
      }
    } else {
      this.expenseForm.markAllAsTouched();
    }
  }

  closeModal() {
    this.resetForm();
    const modalElement = document.getElementById('addExpenseModal');
    if (modalElement) {
      let modal = (window as any).bootstrap.Modal.getInstance(modalElement);
      if (!modal) modal = new (window as any).bootstrap.Modal(modalElement);
      modal.hide();

      document.body.classList.remove('modal-open');
      const backdrops = document.querySelectorAll('.modal-backdrop');
      backdrops.forEach(b => b.remove());
    }
  }

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
