import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss'],
  standalone: true
})
export class NavigationBarComponent {
  @Output() tabSelected = new EventEmitter<string>();

  selectTab(tab: string) {
    this.tabSelected.emit(tab);
  }
}
