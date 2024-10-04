import { Component, Input, OnChanges } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-loading-screen',
  templateUrl: './loading-screen.component.html',
  styleUrls: ['./loading-screen.component.scss'],
  imports: [MatProgressBarModule],
  standalone: true
})
export class LoadingScreenComponent implements OnChanges {
  @Input() loadingProgress: number = 0; // Процент загрузки
  strokeDashArray = '0, 100'; // Значение по умолчанию для stroke-dasharray

  ngOnChanges() {
    const progress = this.loadingProgress / 100 * 75; // Преобразуем процент в 0-75% прогресса
    this.strokeDashArray = `${progress}, 100`; // Обновляем stroke-dasharray для круга
  }
}
