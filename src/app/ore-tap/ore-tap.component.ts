import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgStyle, NgForOf } from '@angular/common';
import { PlayerStateService } from '../services/player-state.service';
import { GameService } from '../services/game.service';

declare global {
  interface Window {
    Telegram: any;
  }
}

@Component({
  selector: 'app-ore-tap',
  templateUrl: './ore-tap.component.html',
  styleUrls: ['./ore-tap.component.scss'],
  standalone: true,
  imports: [MatProgressBarModule, NgStyle, NgForOf],
  animations: [
    trigger('pointsAnimation', [
      transition(':enter', [
        style({ transform: 'translateY(0)', opacity: 1 }),
        animate('1s cubic-bezier(0.25, 1, 0.5, 1)', style({ transform: 'translateY(-150px) rotate(20deg)', opacity: 0 }))
      ])
    ])
  ]
})
export class OreTapComponent {
  @Input() totalOrex: number = 0;
  @Output() oreTap = new EventEmitter<void>();
  orexPerTap = 1;
  pointsList = signal<Array<{ x: number, y: number, color: string }>>([]);
  rockState = signal('default');

  constructor(private playerStateService: PlayerStateService, private gameService: GameService) {}

  ngOnInit() {
    this.loadOrexFromServer();
  }

  loadOrexFromServer() {
    if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
      const telegramId = window.Telegram.WebApp.initDataUnsafe.user?.id;
      this.gameService.getUserProgress(telegramId).subscribe(
        (data: any) => {
          this.totalOrex = data.orex;
        },
        (error) => {
          console.error('Ошибка при загрузке Orex:', error);
        }
      );
    } else {
      console.log('Не удалось получить данные о пользователе из Telegram.');
    }
  }

  onTap(event: TouchEvent | MouseEvent) {
    event.preventDefault();
    this.oreTap.emit();

    const target = event.target as HTMLElement;
    const rect = target.getBoundingClientRect();
    let x = 0, y = 0;

    if (event instanceof TouchEvent && event.touches.length > 0) {
      const touch = event.touches[0];
      x = touch.clientX - rect.left;
      y = touch.clientY - rect.top;
    } else if (event instanceof MouseEvent) {
      x = event.clientX - rect.left;
      y = event.clientY - rect.top;
    }

    if (x && y) {
      this.addPointsDisplay(x, y);
      this.totalOrex += this.orexPerTap;
      this.syncOrexWithServer();
      this.rockState.set('highlighted');
      setTimeout(() => this.rockState.set('default'), 300);
    }
  }

  addPointsDisplay(x: number, y: number) {
    const color = this.getRandomColor();
    this.pointsList.update(list => [...list, { x, y, color }]);
    setTimeout(() => this.pointsList.update(list => list.slice(1)), 1000);
  }

  syncOrexWithServer() {
    const telegramId = window.Telegram.WebApp.initDataUnsafe.user.id;
    this.gameService.updateProgress(telegramId, this.totalOrex).subscribe(response => {
      console.log('Orex синхронизирован с сервером:', response);
    });
  }

  getRandomColor(): string {
    const r = Math.floor(Math.random() * 56 + 200);
    const g = Math.floor(Math.random() * 56 + 200);
    const b = Math.floor(Math.random() * 155 + 100);
    return `rgb(${r}, ${g}, ${b})`;
  }
}
