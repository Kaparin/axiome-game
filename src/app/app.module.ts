import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { OreTapComponent } from './ore-tap/ore-tap.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    OreTapComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
