import { Component, AfterViewInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingScreenComponent } from './loading-screen/loading-screen.component';
import { MainPageComponent } from './main-page/main-page.component';
import { NavigationBarComponent } from './navigation-bar/navigation-bar.component';
import { signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { PlayerStateService } from './services/player-state.service';  // Подключаем PlayerStateService
import { GameService } from './services/game.service';  // Подключаем GameService


declare var Telegram: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    CommonModule,
    LoadingScreenComponent,
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
  user: any;  // Данные пользователя Telegram

  @ViewChild('telegramLogin', { static: false }) telegramLoginContainer!: ElementRef;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private playerStateService: PlayerStateService,  // Инжектируем PlayerStateService
    private gameService: GameService  // Инжектируем GameService
  ) {
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

  ngOnInit() {
    // Инициализация Telegram Web App SDK и получение данных пользователя
    if (this.isBrowser) {
      const tg = Telegram.WebApp;
      this.user = tg.initDataUnsafe?.user;

      if (this.user) {
        console.log('Пользователь авторизован:', this.user);
        // Инициализируем игрока и прогресс в PlayerStateService
        this.playerStateService.setPlayer(this.user.id, 0);  // Прогресс начинаем с 0 или загружаем с сервера
      } else {
        console.log('Данные пользователя не получены.');
      }
    }
  }

  // Метод для обновления прогресса и синхронизации с сервером
  updateProgressInGame(increment: number) {
    const telegramId = this.playerStateService.getTelegramId();
    const currentProgress = this.playerStateService.getProgress();

    if (telegramId) {
      this.playerStateService.updateProgress(increment);  // Локально обновляем прогресс

      // Отправляем прогресс на сервер
      this.gameService.updateProgress(telegramId, currentProgress + increment).subscribe(response => {
        console.log('Прогресс синхронизирован с сервером:', response);
      });
    }
  }
}
