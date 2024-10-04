import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';  // Импортируем все необходимые модули
import { CommonModule } from '@angular/common';
import { LoadingScreenComponent } from './loading-screen/loading-screen.component';
import { MainPageComponent } from './main-page/main-page.component';
import { NavigationBarComponent } from './navigation-bar/navigation-bar.component';
import { signal } from '@angular/core';  // Импортируем функцию signal
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';




@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    CommonModule,
    LoadingScreenComponent,  // Импортируем компонент для использования
    MainPageComponent,
    NavigationBarComponent
  ],
  standalone: true
})
export class AppComponent implements AfterViewInit {
  // Signals для управления состоянием
  loadingProgress = signal(0);
  loadingComplete = signal(false);
  activeTab = signal('dobycha');
  isBrowser: boolean;

  @ViewChild('telegramLogin', { static: false }) telegramLoginContainer!: ElementRef;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    // Определяем, выполняется ли приложение на стороне клиента
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.simulateLoading();
  }

  simulateLoading() {
    const interval = setInterval(() => {
      if (this.loadingProgress() < 100) {
        this.loadingProgress.update(progress => progress + 5);
      } else {
        this.loadingComplete.set(true);
        clearInterval(interval);
      }
    }, 300);
  }

  selectTab(tab: string) {
    this.activeTab.set(tab);
  }

  ngAfterViewInit() {
    if (this.isBrowser) {
      // Код для работы с документом только на стороне клиента (браузере)
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://telegram.org/js/telegram-widget.js?7';
      script.setAttribute('data-telegram-login', 'AxmCryptoGalaxy_bot');
      script.setAttribute('data-size', 'large');
      script.setAttribute('data-auth-url', 'https://f481-84-229-70-159.ngrok-free.app/auth/telegram');
      script.setAttribute('data-request-access', 'write');

      this.telegramLoginContainer.nativeElement.appendChild(script);
    }
  }
}
