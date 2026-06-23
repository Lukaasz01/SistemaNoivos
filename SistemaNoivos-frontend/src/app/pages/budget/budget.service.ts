import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Expense, PaymentStatus } from '../../models/wedding.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/expenses`;

  totalBudget = signal<number>(80000);
  expenses = signal<Expense[]>([]);

  // 🧮 MATEMÁTICA FINANCEIRA AJUSTADA
  summary = computed(() => {
    let estimated = 0;
    let actual = 0;
    let paid = 0;

    this.expenses().forEach(exp => {
      estimated += exp.estimatedCost;
      actual += exp.actualCost; // 👈 Corrigido: Custo Real agora só soma o que foi contratado de verdade!
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
      // Gráfico acompanha o custo real se houver, ou estimado se estiver orçando
      const cost = exp.actualCost > 0 ? exp.actualCost : exp.estimatedCost;
      categories[exp.category] = (categories[exp.category] || 0) + cost;
    });

    return Object.keys(categories).map(name => ({
      name,
      amount: categories[name],
      percentage: totalActual > 0 ? Math.round((categories[name] / totalActual) * 100) : 0,
      color: colorMap[name] || '#CBD5E1'
    })).sort((a, b) => b.amount - a.amount);
  });

  // 🎯 STATUS SEGUINDO A REGRA DE CONTRATO
  getExpenseStatus(expense: Expense): PaymentStatus {
    // Caso especial: Contrato fechado com valor R$ 0,00 (cortesia/bônus)
    if (expense.estimatedCost === 0 && expense.actualCost === 0) {
      return 'Pago';
    }

    const cost = expense.actualCost > 0 ? expense.actualCost : expense.estimatedCost;
    if (expense.paidAmount >= cost && cost > 0) return 'Pago';
    if (expense.paidAmount > 0) return 'Parcial';
    return 'Pendente';
  }

  // --- CONEXÃO COM O JAVA ---
  getAllExpenses(): Observable<Expense[]> {
    return this.http.get<Expense[]>(this.apiUrl).pipe(
      tap(dados => this.expenses.set(dados))
    );
  }

  addExpense(expenseData: Omit<Expense, 'id'>): Observable<Expense> {
    return this.http.post<Expense>(this.apiUrl, expenseData).pipe(
      tap(newExpense => this.expenses.update(list => [newExpense, ...list]))
    );
  }

  updateExpense(id: number, updatedData: Partial<Expense>): Observable<Expense> {
    const currentExpense = this.expenses().find(e => e.id === id);
    if (!currentExpense) throw new Error('Despesa não encontrada localmente');

    const expenseToSave = { ...currentExpense, ...updatedData };
    return this.http.put<Expense>(`${this.apiUrl}/${id}`, expenseToSave).pipe(
      tap(updated => this.expenses.update(list => list.map(e => e.id === id ? updated : e)))
    );
  }

  deleteExpense(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.expenses.update(list => list.filter(e => e.id !== id)))
    );
  }
}
