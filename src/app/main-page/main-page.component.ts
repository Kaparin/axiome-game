import { Component } from '@angular/core';
import { OreTapComponent } from '../ore-tap/ore-tap.component';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
  standalone: true,
  imports: [OreTapComponent]
})
export class MainPageComponent {

}

