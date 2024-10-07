import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { OreTapComponent } from './ore-tap/ore-tap.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { provideHttpClient } from '@angular/common/http';

@NgModule({
  declarations: [
    OreTapComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule
  ],
  providers: [
    provideHttpClient()  // Здесь мы подключаем новый HTTP клиент
  ],
  exports: [
    OreTapComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
