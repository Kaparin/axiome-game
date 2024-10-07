import { Routes } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';  // Замените на ваши компоненты
import { OreTapComponent } from './ore-tap/ore-tap.component';

export const routes: Routes = [
  { path: '', component: MainPageComponent },
  { path: 'ore-tap', component: OreTapComponent },
  { path: '**', redirectTo: '' }  // Переадресация на главную страницу, если маршрут не найден
];
