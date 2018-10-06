import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { routing } from './app.routes';

import { ControllerTestModule } from './shared/views/controller-test/controller-test.module';
import { ControllerModule } from './shared/views/controller/controller.module';
import { RtcModule } from './shared/views/rtc/rtc.module';
import { UiModule } from './shared/views/ui/ui.module';

@NgModule({
  imports: [BrowserModule, CommonModule, ControllerModule, ControllerTestModule, RtcModule, UiModule, routing],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
