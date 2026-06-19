import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    // Usamos a versão oficial e estável sugerida pelo próprio Angular!
    provideZonelessChangeDetection(),

    provideRouter(routes, withComponentInputBinding()),
    provideClientHydration()
  ]
};
