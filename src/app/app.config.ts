import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withFetch } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter([]), // Настройка маршрутизации, если требуется
    importProvidersFrom(MatProgressBarModule, MatButtonModule),
    provideAnimationsAsync(),
    provideHttpClient(withFetch())  // Включаем поддержку fetch API
    // Удаляем рекурсивную ссылку на appConfig.providers
  ]
};
