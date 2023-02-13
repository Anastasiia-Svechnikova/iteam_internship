import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
 import {MatButtonModule} from '@angular/material/button';
import { StopwatchComponent } from './stopwatch/stopwatch.component'; 
import { PadStartPipe } from './stopwatch/padStart.pipe';

@NgModule({
  declarations: [
    AppComponent,
    StopwatchComponent,
    PadStartPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
