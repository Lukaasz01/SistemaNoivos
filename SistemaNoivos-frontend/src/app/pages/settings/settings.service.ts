import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private platformId = inject(PLATFORM_ID);

  // 💎 Estados Reativos Globais (Signals)
  brideName = signal<string>('Ana Beatriz Silva');
  groomName = signal<string>('Carlos Eduardo Almeida');
  email = signal<string>('nosso@casamento.com.br');
  weddingDate = signal<string>('2026-10-12T18:00:00');
  weddingLocation = signal<string>('Fazenda Santa Bárbara, SP');
  eventStyle = signal<string>('Rústico / Campo');

  // 🔔 Estados de Notificação
  whatsappNotifications = signal<boolean>(true);
  weeklyReport = signal<boolean>(true);
  budgetAlerts = signal<boolean>(false);

  constructor() {
    // 🛡️ Se estiver rodando no navegador, carrega o histórico salvo pelo usuário
    if (isPlatformBrowser(this.platformId)) {
      this.loadSettings();
    }
  }

  private loadSettings() {
    this.brideName.set(localStorage.getItem('bride_name') || 'Ana Beatriz Silva');
    this.groomName.set(localStorage.getItem('groom_name') || 'Carlos Eduardo Almeida');
    this.email.set(localStorage.getItem('wedding_email') || 'nosso@casamento.com.br');
    this.weddingDate.set(localStorage.getItem('wedding_date') || '2026-10-12T18:00:00');
    this.weddingLocation.set(localStorage.getItem('wedding_location') || 'Fazenda Santa Bárbara, SP');
    this.eventStyle.set(localStorage.getItem('event_style') || 'Rústico / Campo');

    this.whatsappNotifications.set(localStorage.getItem('notify_wa') !== 'false');
    this.weeklyReport.set(localStorage.getItem('notify_email') !== 'false');
    this.budgetAlerts.set(localStorage.getItem('notify_budget') === 'true');
  }

  saveAll(data: any) {
    // Atualiza os Signals na hora
    this.brideName.set(data.brideName);
    this.groomName.set(data.groomName);
    this.email.set(data.email);
    this.weddingDate.set(data.weddingDate);
    this.weddingLocation.set(data.weddingLocation);
    this.eventStyle.set(data.eventStyle);
    this.whatsappNotifications.set(data.whatsappNotifications);
    this.weeklyReport.set(data.weeklyReport);
    this.budgetAlerts.set(data.budgetAlerts);

    // Grava no LocalStorage com segurança
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('bride_name', data.brideName);
      localStorage.setItem('groom_name', data.groomName);
      localStorage.setItem('wedding_email', data.email);
      localStorage.setItem('wedding_date', data.weddingDate);
      localStorage.setItem('wedding_location', data.weddingLocation);
      localStorage.setItem('event_style', data.eventStyle);
      localStorage.setItem('notify_wa', String(data.whatsappNotifications));
      localStorage.setItem('notify_email', String(data.weeklyReport));
      localStorage.setItem('notify_budget', String(data.budgetAlerts));
    }
  }
}
