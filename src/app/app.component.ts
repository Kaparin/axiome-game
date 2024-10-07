import { Component, AfterViewInit, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingScreenComponent } from './loading-screen/loading-screen.component';
import { MainPageComponent } from './main-page/main-page.component';
import { NavigationBarComponent } from './navigation-bar/navigation-bar.component';
import { signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { PlayerStateService } from './services/player-state.service';
import { GameService } from './services/game.service';
import { TelegramService } from './services/telegram.service';

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
export class AppComponent implements OnInit, AfterViewInit {
  loadingProgress = signal(0);
  loadingComplete = signal(false);
  activeTab = signal('dobycha');
  isBrowser: boolean;
  user: any;  // Для хранения данных пользователя Telegram

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private playerStateService: PlayerStateService,
    private gameService: GameService,
    private telegramService: TelegramService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.simulateLoading();
  }

  ngOnInit(): void {
    if (this.isBrowser && window.Telegram && window.Telegram.WebApp) {
      // Проверка доступности API Telegram и инициализация
      window.Telegram.WebApp.ready();
      this.user = window.Telegram.WebApp.initDataUnsafe?.user;

      if (this.user) {
        console.log('Пользователь авторизован:', this.user);
        this.syncUserWithServer();  // Синхронизация пользователя с сервером
        this.setupMainButton(); // Устанавливаем MainButton после авторизации
      } else {
        console.error('Не удалось получить данные пользователя.');
      }
    } else {
      console.error('Telegram WebApp API недоступен.');
    }

    // Инициализация через TelegramService
    this.telegramService.ready();
    const user = this.telegramService.tg?.initDataUnsafe?.user;
    if (user) {
      console.log('Пользователь авторизован через сервис Telegram:', user);
    } else {
      console.error('Не удалось получить данные пользователя через сервис Telegram.');
    }
  }

  ngAfterViewInit() {
    // Дополнительная логика после загрузки представления
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

  syncUserWithServer() {
    const telegramId = this.user?.id;
    const firstName = this.user?.first_name;
    const lastName = this.user?.last_name;
    const username = this.user?.username;

    if (telegramId) {
      this.gameService.syncUser(telegramId, firstName, lastName, username).subscribe(
        (response: any) => {
          console.log('Синхронизация завершена:', response);
          this.loadUserProgress(telegramId);  // Загружаем прогресс после синхронизации
        },
        (error: any) => {
          console.error('Ошибка синхронизации:', error);
        }
      );
    } else {
      console.error('Нет данных пользователя для синхронизации.');
    }
  }

  loadUserProgress(telegramId: string) {
    this.gameService.getUserProgress(telegramId).subscribe(
      (response: any) => {
        if (response.success) {
          console.log('Прогресс пользователя загружен:', response);
          this.playerStateService.setPlayer(telegramId, response.orex);  // Обновляем локальный прогресс
        }
      },
      (error: any) => {
        console.error('Ошибка загрузки прогресса:', error);
      }
    );
  }

  updateProgressInGame(increment: number) {
    const telegramId = this.playerStateService.getTelegramId();
    const currentProgress = this.playerStateService.getProgress();

    if (telegramId) {
      this.playerStateService.updateProgress(increment);  // Локально обновляем прогресс

      // Отправляем прогресс на сервер
      this.gameService.updateProgress(telegramId, currentProgress + increment).subscribe(
        (response: any) => {
          console.log('Прогресс синхронизирован с сервером:', response);
        },
        (error: any) => {
          console.error('Ошибка при синхронизации прогресса:', error);
        }
      );
    } else {
      console.error('Не удалось обновить прогресс, так как не найден Telegram ID.');
    }
  }

  // Настройка MainButton и его логика
  setupMainButton() {
    const mainButton = this.telegramService.MainButton;
    if (mainButton) {
      mainButton.setText('Отправить данные');
      mainButton.show();
      mainButton.onClick(() => {
        this.sendUserData();
      });
    } else {
      console.error('MainButton недоступен.');
    }
  }

  // Отправка данных в Telegram
  sendUserData() {
    if (this.user) {
      const data = {
        id: this.user.id,
        username: this.user.username,
        progress: this.playerStateService.getProgress()
      };

      this.telegramService.sendData(data);  // Отправка данных через TelegramService
      console.log('Данные отправлены в Telegram:', data);
    } else {
      console.error('Данные пользователя недоступны для отправки.');
    }
  }
}
