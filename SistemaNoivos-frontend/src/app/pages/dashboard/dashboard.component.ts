import { Component, inject, ChangeDetectionStrategy, signal, computed, OnInit, OnDestroy, PLATFORM_ID } from '@angular/core';
import { CommonModule, DecimalPipe, isPlatformBrowser } from '@angular/common'; // 👈 Adicionado isPlatformBrowser
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { TaskService } from '../tasks/task.service';
import { GuestService } from '../guests/guest.service';
import { VendorService } from '../vendors/vendor.service';
import { BudgetService } from '../budget/budget.service';
import { VendorStatus } from '../../models/wedding.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, DecimalPipe, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, OnDestroy {
  taskService = inject(TaskService);
  guestService = inject(GuestService);
  vendorService = inject(VendorService);
  budgetService = inject(BudgetService);
  private fb = inject(FormBuilder);
  private platformId = inject(PLATFORM_ID); // 👈 Injetado para detectar se é navegador ou servidor

  // 📝 Signals nascem com dados padrão para o servidor não quebrar
  weddingDate = signal<string>('2026-10-12T18:00:00');
  weddingLocation = signal<string>('Fazenda Santa Bárbara, SP');

  // ⏱️ Signals do Cronômetro
  daysLeft = signal<number>(0);
  hoursLeft = signal<number>(0);
  minutesLeft = signal<number>(0);
  private timerId: any;

  // 📑 Formulário de Edição
  weddingForm!: FormGroup;

  // 📅 Computa a data por extenso dinamicamente em Português
  formattedWeddingDate = computed(() => {
    const dateObj = new Date(this.weddingDate());
    return dateObj.toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  });

  ngOnInit(): void {
    // 🛡️ PROTEÇÃO SSR: Só lê o localStorage se estiver no navegador
    if (isPlatformBrowser(this.platformId)) {
      const savedDate = localStorage.getItem('wedding_date');
      const savedLocation = localStorage.getItem('wedding_location');

      if (savedDate) this.weddingDate.set(savedDate);
      if (savedLocation) this.weddingLocation.set(savedLocation);
    }

    // Carrega dados gerais das tabelas do banco
    this.taskService.getAllTasks().subscribe();
    this.guestService.getAllGuests().subscribe();
    this.vendorService.getAllVendors().subscribe();
    this.budgetService.getAllExpenses().subscribe();

    // Inicializa o formulário e a contagem regressiva
    this.initForm();
    this.calculateCountdown();

    // 🛡️ PROTEÇÃO SSR: O temporizador só deve rodar no navegador
    if (isPlatformBrowser(this.platformId)) {
      this.timerId = setInterval(() => this.calculateCountdown(), 60000);
    }
  }

  ngOnDestroy(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
  }

  initForm() {
    const currentTargetDate = this.weddingDate().substring(0, 16);
    this.weddingForm = this.fb.group({
      date: [currentTargetDate, Validators.required],
      location: [this.weddingLocation(), Validators.required]
    });
  }

  calculateCountdown() {
    const targetTime = new Date(this.weddingDate()).getTime();
    const now = new Date().getTime();
    const difference = targetTime - now;

    if (difference > 0) {
      this.daysLeft.set(Math.floor(difference / (1000 * 60 * 60 * 24)));
      this.hoursLeft.set(Math.floor((difference / (1000 * 60 * 60)) % 24));
      this.minutesLeft.set(Math.floor((difference / (1000 * 60)) % 60));
    } else {
      this.daysLeft.set(0);
      this.hoursLeft.set(0);
      this.minutesLeft.set(0);
    }
  }

  openEditModal() {
    const currentTargetDate = this.weddingDate().substring(0, 16);
    this.weddingForm.patchValue({
      date: currentTargetDate,
      location: this.weddingLocation()
    });

    const modalElement = document.getElementById('editWeddingModal');
    if (modalElement) {
      const modal = new (window as any).bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  onSaveWeddingDetails() {
    if (this.weddingForm.valid) {
      const formValues = this.weddingForm.value;

      this.weddingDate.set(formValues.date);
      this.weddingLocation.set(formValues.location);

      // 🛡️ PROTEÇÃO SSR: Só salva se estiver no navegador (embora cliques só ocorram no navegador)
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('wedding_date', formValues.date);
        localStorage.setItem('wedding_location', formValues.location);
      }

      this.calculateCountdown();
      this.closeModal();
    }
  }

  closeModal() {
    const modalElement = document.getElementById('editWeddingModal');
    if (modalElement) {
      let modal = (window as any).bootstrap.Modal.getInstance(modalElement);
      if (!modal) modal = new (window as any).bootstrap.Modal(modalElement);
      modal.hide();
    }
  }

  // --- OUTROS MÉTODOS REATIVOS DO DASHBOARD ---
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
