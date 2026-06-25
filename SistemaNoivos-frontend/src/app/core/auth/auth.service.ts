import { Injectable, inject, signal, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  // 🟢 Ajustado para a URL base da autenticação
  private baseUrl = 'http://127.0.0.1:9001/api/auth';

  // 💎 Signals globais do estado de login
  isAuthenticated = signal<boolean>(false);
  userRole = signal<string | null>(null);
  weddingProfileId = signal<number | null>(null);

  constructor() {
    // Ao carregar o app, se estiver no navegador, recupera o login salvo
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      if (token) {
        this.isAuthenticated.set(true);
        this.userRole.set(localStorage.getItem('user_role'));
        this.weddingProfileId.set(Number(localStorage.getItem('wedding_profile_id')));
      }
    }
  }

  login(credentials: { email: string; password: string }): Observable<any> {
      return this.http.post<any>(`${this.baseUrl}/login`, credentials).pipe(
        tap(response => {
          // Guarda os dados no estado reativo (Signals)
          this.isAuthenticated.set(true);
          this.userRole.set(response.role);
          this.weddingProfileId.set(response.weddingProfileId);

          // Salva as chaves fisicamente no navegador
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('user_role', response.role);
            localStorage.setItem('wedding_profile_id', String(response.weddingProfileId));
          }

          // 🟢 A CORREÇÃO ESTÁ AQUI: Redireciona para o painel principal!
          this.router.navigate(['/dashboard']);
        })
      );
    }

  logout(): void {
    // 🟢 Dispara a chamada POST para o Java limpar o contexto de segurança
    this.http.post(`${this.baseUrl}/logout`, {}).subscribe({
      next: () => console.log('Contexto de segurança encerrado no Back-end.'),
      error: (err) => console.error('Erro ao avisar o back-end sobre o logout:', err)
    });

    // 🟢 Executa a limpeza local imediatamente (Garante boa experiência visual ao usuário)
    this.isAuthenticated.set(false);
    this.userRole.set(null);
    this.weddingProfileId.set(null);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.clear();
    }

    // Chuta o usuário de volta para a tela de login
    this.router.navigate(['/login']);
  }
}
