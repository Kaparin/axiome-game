import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-ore-converter',
  templateUrl: './ore-converter.component.html',
  styleUrls: ['./ore-converter.component.scss'],
  standalone: true
})
export class OreConverterComponent {
  @Input() orex: number = 0;  // Текущее количество Orex, передается от родительского компонента
  @Input() xiom: number = 0;  // Текущее количество Xiom, передается от родительского компонента
  @Output() convert = new EventEmitter<void>();  // Событие для отправки действия конвертации родителю

  // Метод для конвертации Orex в Xiom
  onConvertClick() {
    if (this.orex >= 10) {
      this.convert.emit();  // Генерируем событие для родительского компонента
    }
  }
}
