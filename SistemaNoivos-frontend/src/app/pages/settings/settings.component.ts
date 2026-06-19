import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsTab } from '../../models/wedding.model';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  // Controle de Abas usando Signals
  activeTab = signal<SettingsTab>('geral');

  setTab(tab: SettingsTab) {
    this.activeTab.set(tab);
  }

  saveSettings() {
    alert('As configurações foram salvas com sucesso!');
  }
}
