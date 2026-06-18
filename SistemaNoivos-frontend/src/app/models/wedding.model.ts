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
// CONVIDADOS
// ==========================================
export type RsvpStatus = 'confirmed' | 'pending' | 'declined';
export type GuestGroup = 'Família Noiva' | 'Família Noivo' | 'Amigos' | 'Trabalho';

export interface Guest {
  id: number;
  name: string;
  group: GuestGroup;
  companions: number;
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

// ==========================================
// FORNECEDORES
// ==========================================
export type VendorStatus = 'Contratado' | 'Em Negociação' | 'Orçando';
export type VendorCategory = 'Espaço' | 'Buffet' | 'Fotografia' | 'Decoração' | 'Música' | 'Trajes' | 'Assessoria';

export interface Vendor {
  id: number;
  name: string;
  category: VendorCategory;
  contactName: string;
  phone: string;
  status: VendorStatus;
  cost: number;
  rating: number;
  isFavorite: boolean;
  icon: string;
  // Propriedades opcionais e alinhadas para o Dashboard
  iconColor?: string;
  bgClass?: string;
  badgeClass?: string;
}
