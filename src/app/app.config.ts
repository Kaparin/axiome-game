import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter([]), // Настройка маршрутизации, если требуется
    importProvidersFrom(MatProgressBarModule, MatButtonModule) // Импортируем модули Angular Material
  ]
};
