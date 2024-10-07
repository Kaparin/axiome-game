import { Component, signal } from '@angular/core';
import { OreTapComponent } from '../ore-tap/ore-tap.component';
import { OreConverterComponent } from '../ore-converter/ore-converter.component';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { PlayerStateService } from '../services/player-state.service';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [CommonModule, OreTapComponent, OreConverterComponent, MatProgressBarModule],
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent {
  totalOrex = signal(0);
  totalXiom = signal(0);

  constructor(private playerStateService: PlayerStateService) {}

  ngOnInit() {
    const playerId = this.playerStateService.getTelegramId();
    const progress = this.playerStateService.getProgress();
    if (playerId) {
      this.totalOrex.set(progress); // Устанавливаем прогресс пользователя в основной компонент
    }
  }

  handleOreTap() {
    this.totalOrex.update(orex => orex + 1);
  }

  handleConvert() {
    if (this.totalOrex() >= 10) {
      this.totalOrex.update(orex => orex - 10);
      this.totalXiom.update(xiom => xiom + 1);
    }
  }
}
