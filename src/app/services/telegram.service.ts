import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';

// Интерфейс для работы с кнопками
interface TgButton {
  show(): void;
  hide(): void;
  setText(text: string): void;
  onClick(fn: Function): void;
  offClick(fn: Function): void;
  enable(): void;
  disable(): void;
}

@Injectable({
  providedIn: 'root',
})
export class TelegramService {
  private window: any;
  tg: any;

  constructor(@Inject(DOCUMENT) private document: Document) {
    // Проверяем, что выполняем код в браузере
    if (this.isBrowser()) {
      this.window = this.document.defaultView;
      this.tg = this.window?.Telegram?.WebApp;

      if (!this.tg) {
        console.error('Telegram WebApp API недоступен.');
      }
    }
  }

  // Метод для проверки выполнения в браузере
  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  // Инициализация
  ready() {
    if (this.tg) {
      this.tg.ready();
    } else {
      console.error('Telegram WebApp API недоступен, не могу вызвать ready().');
    }
  }

  // Получение MainButton
  get MainButton(): TgButton | undefined {
    return this.tg ? this.tg.MainButton : undefined;
  }

  // Отправка данных в Telegram
  sendData(data: object) {
    if (this.tg) {
      this.tg.sendData(JSON.stringify(data));
    } else {
      console.error('Telegram WebApp API недоступен, не могу отправить данные.');
    }
  }
}
