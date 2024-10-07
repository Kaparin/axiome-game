import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrexService {
  private apiUrl = 'http://localhost:3000';  // URL сервера

  constructor(private http: HttpClient) {}

  // Метод для получения состояния OREX и XIOM
  getCurrencyState(telegramId: string): Observable<any> {
    const encodedTelegramId = encodeURIComponent(telegramId);
    return this.http.get(`${this.apiUrl}/api/orex/currency/${encodedTelegramId}`);
  }

  // Метод для обновления валют
  updateCurrency(telegramId: string, orex: number, xiom: number): Observable<any> {
    const payload = { telegramId, orex, xiom };
    return this.http.post(`${this.apiUrl}/api/orex/updateCurrency`, payload);
  }
}
