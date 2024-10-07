import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private apiUrl = 'http://localhost:3000';  // URL сервера

  constructor(private http: HttpClient) {}

  // Синхронизация данных пользователя с сервером
  syncUser(telegramId: string, firstName: string, lastName: string, username: string): Observable<any> {
    const payload = { telegramId, firstName, lastName, username };
    return this.http.post(`${this.apiUrl}/api/orex/update`, payload);
  }

  // Получение прогресса пользователя
  getUserProgress(telegramId: string): Observable<any> {
    const encodedTelegramId = encodeURIComponent(telegramId);  // Кодируем ID
    return this.http.get(`${this.apiUrl}/api/orex/${encodedTelegramId}`);
  }

  // Обновление прогресса пользователя
  updateProgress(telegramId: string, progress: number): Observable<any> {
    const payload = { telegramId, progress };
    return this.http.post(`${this.apiUrl}/api/orex/updateProgress`, payload);
  }
}
