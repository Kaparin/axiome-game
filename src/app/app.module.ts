import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { OreTapComponent } from './ore-tap/ore-tap.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';

@NgModule({
    declarations: [
        OreTapComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule
    ],
    providers: [],
    exports: [
        OreTapComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
