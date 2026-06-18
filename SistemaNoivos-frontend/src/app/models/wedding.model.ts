// ==========================================
// TAREFAS
// ==========================================
export interface Task {
  id: number;
  title: string;
  date: string;
  category: string;
  categoryTheme: 'primary' | 'success' | 'warning' | 'info' | 'secondary' | 'accent';
  completed: boolean;
  isOverdue?: boolean;
}

// ==========================================
// FORNECEDORES
// ==========================================
export interface Vendor {
  id: number;
  name: string;
  category: string;
  status: 'Contratado' | 'Orçando';
  icon: string;
  iconColor: string;
  bgClass: string;
  badgeClass: string;
}

// ==========================================
// CONVIDADOS
// ==========================================
export type RsvpStatus = 'confirmed' | 'pending' | 'declined';
export type GuestGroup = 'Família Noiva' | 'Família Noivo' | 'Amigos' | 'Trabalho';

export interface Guest {
  id: number;
  name: string;
  group: GuestGroup;
  companions: number; // Número de acompanhantes além do convidado principal
  status: RsvpStatus;
  phone: string;
  dietaryRestrictions?: string;
}

// ==========================================
// ORÇAMENTO E DESPESAS
// ==========================================
export type ExpenseCategory = 'Espaço & Buffet' | 'Foto & Vídeo' | 'Decoração' | 'Trajes' | 'Música' | 'Outros';
export type PaymentStatus = 'Pago' | 'Parcial' | 'Pendente';

export interface Expense {
  id: number;
  description: string;
  category: ExpenseCategory;
  estimatedCost: number;
  actualCost: number;
  paidAmount: number;
}
