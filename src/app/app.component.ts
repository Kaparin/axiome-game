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

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private playerStateService: PlayerStateService,  // Инжектируем PlayerStateService
    private gameService: GameService  // Инжектируем GameService
  ) {
    // Определяем, выполняется ли приложение на стороне клиента
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.simulateLoading();
  }

  ngAfterViewInit(){ // Here is the empty required method
    // You originally implemented Telegram here.
    // Now that this is removed, you can leave this method empty,
    // or you can remove `implements AfterViewInit` from the class definition if you no longer need it.
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
