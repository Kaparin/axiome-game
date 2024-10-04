import { Component, signal } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgStyle, NgForOf } from '@angular/common';

@Component({
  selector: 'app-ore-tap',
  templateUrl: './ore-tap.component.html',
  styleUrls: ['./ore-tap.component.scss'],
  standalone: true,
  imports: [MatProgressBarModule, NgStyle, NgForOf], // Добавляем NgForOf для работы с *ngFor
  animations: [
    trigger('pointsAnimation', [
      transition(':enter', [
        style({ transform: 'translateY(0)', opacity: 1 }),
        animate('1s', style({ transform: 'translateY(-100px)', opacity: 0 }))
      ])
    ])
  ]
})
export class OreTapComponent {
  orexPerTap = 1;
  totalOrex = signal(0); // Инициализация сигнала
  pointsList = signal<Array<{ x: number, y: number }>>([]);

  // Обработка тапа
  onTap(event: TouchEvent | MouseEvent) {
    event.preventDefault();

    const target = event.target as HTMLElement;
    const rect = target.getBoundingClientRect();
    let x = 0, y = 0;

    if (event instanceof TouchEvent && event.touches.length > 0) {
      const touch = event.touches[0];
      x = touch.clientX;
      y = touch.clientY;
    } else if (event instanceof MouseEvent) {
      x = event.clientX;
      y = event.clientY;
    }

    if (x && y && x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
      this.totalOrex.update(value => value + this.orexPerTap);
      this.addPointsDisplay(x, y);
    }
  }

  // Добавление очков
  addPointsDisplay(x: number, y: number) {
    this.pointsList.update(list => [...list, { x, y }]);

    setTimeout(() => {
      this.pointsList.update(list => list.slice(1)); // Удаление старого элемента
    }, 1000);
  }

  // Метод для сброса руды
  resetOrex() {
    this.totalOrex.set(0);
  }

  preventDefault(event: Event) {
    event.preventDefault();
  }
}
