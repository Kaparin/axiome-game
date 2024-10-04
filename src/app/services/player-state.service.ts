import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlayerStateService {
  private telegramIdSubject = new BehaviorSubject<string | null>(null);
  private progressSubject = new BehaviorSubject<number>(0);

  // Наблюдатели за состоянием

  telegramId$ = this.telegramIdSubject.asObservable();
  progress$ = this.progressSubject.asObservable();

  // Метод для установки данных пользователя
  setPlayer(telegramId: string, progress: number) {
    this.telegramIdSubject.next(telegramId);
    this.progressSubject.next(progress);
  }

  // Метод для обновления прогресса
  updateProgress(increment: number) {
    const currentProgress = this.progressSubject.getValue();
    this.progressSubject.next(currentProgress + increment);
  }

  // Получение текущего telegramId
  getTelegramId(): string | null {
    return this.telegramIdSubject.getValue();
  }

  // Получение текущего прогресса
  getProgress(): number {
    return this.progressSubject.getValue();
  }
}
