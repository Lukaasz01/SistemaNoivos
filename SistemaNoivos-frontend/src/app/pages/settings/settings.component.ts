import { Component, signal, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SettingsTab } from '../../models/wedding.model';
import { SettingsService } from './settings.service'; // 👈 Mantido o import correto local

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit {
  // 💎 Injeções de dependência limpas e sem repetição
  settingsService = inject(SettingsService);
  private fb = inject(FormBuilder);

  activeTab = signal<SettingsTab>('geral');
  settingsForm!: FormGroup;

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    // Corta a string se necessário para encaixar no input tipo 'datetime-local' do HTML
    let dateVal = this.settingsService.weddingDate();
    if (dateVal && dateVal.includes('T')) {
      dateVal = dateVal.substring(0, 16);
    }

    this.settingsForm = this.fb.group({
      brideName: [this.settingsService.brideName(), Validators.required],
      groomName: [this.settingsService.groomName(), Validators.required],
      email: [this.settingsService.email(), [Validators.required, Validators.email]],
      weddingDate: [dateVal, Validators.required],
      weddingLocation: [this.settingsService.weddingLocation(), Validators.required],
      eventStyle: [this.settingsService.eventStyle(), Validators.required],
      whatsappNotifications: [this.settingsService.whatsappNotifications()],
      weeklyReport: [this.settingsService.weeklyReport()],
      budgetAlerts: [this.settingsService.budgetAlerts()]
    });
  }

  setTab(tab: SettingsTab) {
    this.activeTab.set(tab);
  }

  saveSettings() {
    if (this.settingsForm.valid) {
      this.settingsService.saveAll(this.settingsForm.value);
      alert('🎉 Configurações gravadas com sucesso no ecossistema!');
    } else {
      this.settingsForm.markAllAsTouched();
      alert('⚠️ Por favor, corrija os erros do formulário antes de salvar.');
    }
  }
}
