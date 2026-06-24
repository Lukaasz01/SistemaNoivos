import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';

import { routes } from './app.routes';
import { authInterceptor } from './core/auth/auth.interceptor'; // Garante o envio do Token JWT

export const appConfig: ApplicationConfig = {
  providers: [
    // Configuração das rotas oficiais do seu ecossistema
    provideRouter(routes, withComponentInputBinding()),

    // Suporte ao SSR (Server-Side Rendering)
    provideClientHydration(),

    // 🔐 Mantém a interceptação automática do Token ativa globalmente
    provideHttpClient(
      withInterceptors([authInterceptor])
    )
  ]
};
