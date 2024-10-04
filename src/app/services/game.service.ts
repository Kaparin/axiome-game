import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  constructor(private http: HttpClient) {}

  updateProgress(telegramId: string, progress: number): Observable<any> {
    const url = 'https://example.com/api/update-progress';  // Ваш API endpoint
    return this.http.post(url, { telegramId, progress });
  }
}
