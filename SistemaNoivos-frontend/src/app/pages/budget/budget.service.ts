import { Injectable, signal, computed } from '@angular/core';
import { Expense, ExpenseCategory, PaymentStatus } from '../../models/wedding.model';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {
  totalBudget = signal<number>(80000);

  expenses = signal<Expense[]>([
    { id: 1, description: 'Aluguel do Espaço', category: 'Espaço & Buffet', estimatedCost: 15000, actualCost: 15000, paidAmount: 15000 },
    { id: 2, description: 'Serviço de Buffet (150 pax)', category: 'Espaço & Buffet', estimatedCost: 20000, actualCost: 22500, paidAmount: 5000 },
    { id: 3, description: 'Fotografia + Drone', category: 'Foto & Vídeo', estimatedCost: 8000, actualCost: 8200, paidAmount: 4100 },
    { id: 4, description: 'Vestido de Noiva', category: 'Trajes', estimatedCost: 6000, actualCost: 5500, paidAmount: 5500 },
    { id: 5, description: 'Terno do Noivo', category: 'Trajes', estimatedCost: 2000, actualCost: 0, paidAmount: 0 },
    { id: 6, description: 'Decoração Cerimônia e Festa', category: 'Decoração', estimatedCost: 12000, actualCost: 14000, paidAmount: 2000 },
    { id: 7, description: 'Banda da Festa', category: 'Música', estimatedCost: 5000, actualCost: 5000, paidAmount: 1000 },
    { id: 8, description: 'Lembrancinhas', category: 'Outros', estimatedCost: 1500, actualCost: 1200, paidAmount: 0 },
  ]);

  summary = computed(() => {
    let estimated = 0;
    let actual = 0;
    let paid = 0;

    this.expenses().forEach(exp => {
      estimated += exp.estimatedCost;
      actual += exp.actualCost > 0 ? exp.actualCost : exp.estimatedCost;
      paid += exp.paidAmount;
    });

    const pending = actual - paid;
    const paidPercentage = actual > 0 ? Math.round((paid / actual) * 100) : 0;

    return { estimated, actual, paid, pending, paidPercentage };
  });

  categoryBreakdown = computed(() => {
    const categories: Record<string, number> = {};
    const totalActual = this.summary().actual;

    const colorMap: Record<string, string> = {
      'Espaço & Buffet': 'var(--cat-1)',
      'Decoração': 'var(--cat-2)',
      'Foto & Vídeo': 'var(--cat-3)',
      'Trajes': 'var(--cat-4)',
      'Música': 'var(--cat-5)',
      'Outros': 'var(--cat-6)'
    };

    this.expenses().forEach(exp => {
      const cost = exp.actualCost > 0 ? exp.actualCost : exp.estimatedCost;
      if (!categories[exp.category]) {
        categories[exp.category] = 0;
      }
      categories[exp.category] += cost;
    });

    return Object.keys(categories).map(name => ({
      name,
      amount: categories[name],
      percentage: totalActual > 0 ? Math.round((categories[name] / totalActual) * 100) : 0,
      color: colorMap[name] || '#CBD5E1'
    })).sort((a, b) => b.amount - a.amount);
  });

  getExpenseStatus(expense: Expense): PaymentStatus {
    const cost = expense.actualCost > 0 ? expense.actualCost : expense.estimatedCost;
    if (expense.paidAmount === 0) return 'Pendente';
    if (expense.paidAmount >= cost) return 'Pago';
    return 'Parcial';
  }
}
