import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProgressService {
  private progressSubject = new BehaviorSubject<number>(0);  // Начальный прогресс
  progress$ = this.progressSubject.asObservable();  // Наблюдатель за изменениями прогресса
  telegramId!: string;  // Telegram ID пользователя

  constructor(private http: HttpClient) {}

  // Инициализация пользователя и его прогресса
  init(telegramId: string, initialProgress: number) {
    this.telegramId = telegramId;
    this.progressSubject.next(initialProgress);  // Устанавливаем начальный прогресс
  }

  // Метод для обновления прогресса
  updateProgress(increment: number) {
    const newProgress = this.progressSubject.value + increment;
    this.progressSubject.next(newProgress);  // Обновляем значение локально
    this.syncProgress(newProgress);  // Синхронизируем с сервером
  }

  // Метод для синхронизации прогресса с сервером
  private syncProgress(newProgress: number) {
    this.http.post('/update-progress', { telegramId: this.telegramId, newProgress })
      .subscribe(response => {
        console.log('Прогресс успешно синхронизирован с сервером:', response);
      });
  }
}
